import {
    App,
    Editor,
    EditorPosition,
    EditorSuggest,
    EditorSuggestContext,
    EditorSuggestTriggerInfo,
    MarkdownView,
    TFile,
} from 'obsidian';
import CommentLabels from 'src/main';
import { isValidLabel } from '../helpers/is-valid-label';
import { decorationState } from '../editor-plugin/helpers/decorate-comments/decoration-state';

export type CommentCompletion = {
    label: string;
    // text: string;
};

export class CommentSuggest extends EditorSuggest<CommentCompletion> {
    private plugin: CommentLabels;
    readonly app: App;

    constructor(app: App, plugin: CommentLabels) {
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

    getSuggestions(context: EditorSuggestContext): CommentCompletion[] {
        const groups = this.plugin.settings.getValue().decoration.styles.labels;
        const patterns = Object.values(groups).map((g) => g.label);
        const suggestions = patterns
            .map((val) => ({ label: val, text: `<!--${val}: -->` }))
            .filter((item) =>
                item.label.toLowerCase().startsWith(context.query),
            )
            .sort((a, b) => {
                const nA = this.usedSuggestions[a.label] || 0;
                const nB = this.usedSuggestions[b.label] || 0;
                return nB - nA;
            });
        if (suggestions.length) {
            return suggestions;
        }

        if (isValidLabel(context.query)) return [{ label: context.query }];
        else return [];
    }

    renderSuggestion(suggestion: CommentCompletion, el: HTMLElement): void {
        el.setText(suggestion.label);
    }

    private usedSuggestions: Record<string, number> = {};
    private recordUsedSuggestion = (suggestion: string) => {
        if (!this.usedSuggestions[suggestion])
            this.usedSuggestions[suggestion] = 0;
        this.usedSuggestions[suggestion] = this.usedSuggestions[suggestion] + 1;
    };

    selectSuggestion(
        suggestion: CommentCompletion,
        event: KeyboardEvent | MouseEvent,
    ): void {
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView) return;
        if (!this.context) return;

        const settings = this.plugin.settings.getValue();
        const label = suggestion.label.trim();
        const text =
            settings.editorSuggest.commentType === 'html'
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
                (settings.editorSuggest.commentType === 'html' ? 3 : 2),
        });

        this.recordUsedSuggestion(label);
        decorationState.fileHasLabeledComments = true;
    }

    onTrigger(
        cursor: EditorPosition,
        editor: Editor,
        file: TFile,
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

        return {
            start: startPos,
            end: cursor,
            query: editor
                .getRange(startPos, cursor)
                .substring(triggerPhrase.length),
        };
    }
}
