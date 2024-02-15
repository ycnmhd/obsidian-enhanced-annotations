import {
    App,
    Editor,
    EditorPosition,
    EditorSuggest,
    EditorSuggestContext,
    EditorSuggestTriggerInfo,
    MarkdownView,
} from 'obsidian';
import LabeledAnnotations from 'src/main';
import { isValidLabel } from './helpers/is-valid-label';
import { isInsideAnnotation } from './helpers/is-inside-annotation';

export type AnnotationCompletion = {
    label: string;
};

export class AnnotationSuggest extends EditorSuggest<AnnotationCompletion> {
    readonly app: App;
    private mostRecentSuggestion: string;
    private secondMostRecentSuggestion: string;
    private plugin: LabeledAnnotations;
    private usedSuggestions: Record<
        string,
        { count: number; timestamp: number }
    > = {};

    constructor(app: App, plugin: LabeledAnnotations) {
        super(app);
        this.app = app;
        this.plugin = plugin;

        // @ts-ignore
        this.scope.register(['Shift'], 'Enter', (evt: KeyboardEvent) => {
            // @ts-ignore
            this.suggestions.useSelectedItem(evt);
            return false;
        });
    }

    getSuggestions(context: EditorSuggestContext): AnnotationCompletion[] {
        const groups = this.plugin.settings.getValue().decoration.styles.labels;
        const labels = Object.values(groups)
            .map((g) => g.label)
            .filter((v) => v);
        const suggestions = labels
            .map((val) => ({ label: val }))
            .filter((item) =>
                item.label.toLowerCase().startsWith(context.query),
            )
            .sort((a, b) => {
                const nA = this.usedSuggestions[a.label];
                const nB = this.usedSuggestions[b.label];
                const countB = nB?.count || 0;
                const countA = nA?.count || 0;
                return countB === countA
                    ? nB?.timestamp - nB?.timestamp
                    : countB - countA;
            });
        if (suggestions.length) {
            return suggestions;
        }

        if (isValidLabel(context.query)) return [{ label: context.query }];
        else return [];
    }

    renderSuggestion(suggestion: AnnotationCompletion, el: HTMLElement): void {
        el.addClass('enhanced-annotations__suggestion');
        const textEL = el.createEl('span');
        const label = suggestion.label;
        textEL.setText(label);
        el.appendChild(textEL);
        const count = this.usedSuggestions[label]?.count;
        if (count > 0) {
            const countEl = el.createEl('sup');
            countEl.addClass('enhanced-annotations__suggestion-count');
            countEl.setText(String(count));
            el.appendChild(countEl);
        }
    }

    selectSuggestion(
        suggestion: AnnotationCompletion,
        event: KeyboardEvent | MouseEvent,
    ): void {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView) return;
        if (!this.context) return;

        const settings = this.plugin.settings.getValue();
        const label = suggestion.label.trim();
        const text =
            settings.editorSuggest.commentFormat === 'html'
                ? `<!--${label}: -->`
                : `%%${label}: %%`;
        activeView.editor.replaceRange(
            text,
            this.context.start,
            this.context.end,
        );
        const cursor = activeView.editor.getCursor();
        activeView.editor.setCursor({
            line: cursor.line,
            ch:
                cursor.ch -
                (settings.editorSuggest.commentFormat === 'html' ? 3 : 2),
        });

        this.recordUsedSuggestion(label, true);
    }

    onTrigger(
        cursor: EditorPosition,
        editor: Editor,
    ): EditorSuggestTriggerInfo | null {
        const settings = this.plugin.settings.getValue();
        if (!settings.editorSuggest.enableAutoSuggest) {
            return null;
        }

        const triggerPhrase = settings.editorSuggest.triggerPhrase;
        const startPos = this.context?.start || {
            line: cursor.line,
            ch: cursor.ch - triggerPhrase.length,
        };

        if (!editor.getRange(startPos, cursor).startsWith(triggerPhrase)) {
            return null;
        }

        const precedingChar = editor.getRange(
            {
                line: startPos.line,
                ch: startPos.ch - 1,
            },
            startPos,
        );

        if (precedingChar && /[`a-zA-Z0-9]/.test(precedingChar)) {
            return null;
        }
        const line = editor.getLine(cursor.line);
        if (isInsideAnnotation(line, '//', startPos.ch)) return null;
        return {
            start: startPos,
            end: cursor,
            query: editor
                .getRange(startPos, cursor)
                .substring(triggerPhrase.length),
        };
    }

    useSecondMostRecentSuggestion(): string {
        this.recordUsedSuggestion(this.secondMostRecentSuggestion);
        return this.secondMostRecentSuggestion;
    }

    useMostRecentSuggestion(): string {
        this.recordUsedSuggestion(this.mostRecentSuggestion);
        return this.mostRecentSuggestion;
    }

    private recordUsedSuggestion = (
        suggestion: string,
        updateMostRecent = false,
    ) => {
        if (!this.usedSuggestions[suggestion])
            this.usedSuggestions[suggestion] = {
                count: 1,
                timestamp: Date.now(),
            };
        else {
            this.usedSuggestions[suggestion].timestamp = Date.now();
            this.usedSuggestions[suggestion].count++;
        }

        if (updateMostRecent) {
            if (this.mostRecentSuggestion !== suggestion)
                this.secondMostRecentSuggestion = this.mostRecentSuggestion;
            this.mostRecentSuggestion = suggestion;
        }
    };
}
