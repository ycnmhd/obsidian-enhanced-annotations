import { syntaxTree } from '@codemirror/language';
import { RangeSetBuilder } from '@codemirror/state';
import {
    Decoration,
    DecorationSet,
    EditorView,
    PluginSpec,
    PluginValue,
    ViewPlugin,
    ViewUpdate,
} from '@codemirror/view';
import { splitComment } from './split-comment';
import {
    debouncedUpdateOutline,
    updateOutline,
} from './update-comments-outline';
import { Editor, TFile } from 'obsidian';

export const context: {
    editor: Editor;
    currentFile?: TFile;
    currentCleanup?: () => void;
} = {
    editor: undefined as any,
    currentFile: undefined,
    currentCleanup: undefined,
};

class EditorPlugin implements PluginValue {
    decorations: DecorationSet;
    private state: {
        updateOutlineTimeout?: ReturnType<typeof setTimeout>;
    } = {};

    constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate) {
        const activeEditor = app.workspace.activeEditor;

        const shouldUpdate =
            !context.currentFile || update.docChanged || update.viewportChanged;
        const canUpdate = activeEditor?.file && activeEditor?.editor;
        if (shouldUpdate && canUpdate) {
            const editor = activeEditor?.editor as Editor;
            const file = activeEditor.file;
            context.editor = editor;
            this.decorations = this.buildDecorations(update.view);
            if (!context.currentFile || context.currentFile !== file) {
                context.currentFile = file;
                if (context.currentCleanup) context.currentCleanup();
                updateOutline(update.view);
            } else {
                context.currentCleanup = debouncedUpdateOutline(update.view);
            }
        }
    }

    destroy() {}

    buildDecorations(view: EditorView): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>();
        for (const { from, to } of view.visibleRanges) {
            syntaxTree(view.state).iterate({
                from,
                to,
                enter(node) {
                    if (node.type.name.startsWith('comment')) {
                        const originalCommentText = view.state.sliceDoc(
                            node.from,
                            node.to,
                        );
                        const split = splitComment(originalCommentText);
                        if (!split) return;
                        const [, , end] = split;
                        const group = end.length - 3;
                        const textDecoration = Decoration.mark({
                            class: 'comment-group-' + group,
                        });
                        builder.add(node.from, node.to, textDecoration);
                    }
                },
            });
        }

        return builder.finish();
    }
}

const pluginSpec: PluginSpec<EditorPlugin> = {
    decorations: (value: EditorPlugin) => value.decorations,
};

export const editorPlugin = ViewPlugin.fromClass(EditorPlugin, pluginSpec);
