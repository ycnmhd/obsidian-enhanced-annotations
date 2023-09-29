import {
    DecorationSet,
    EditorView,
    PluginSpec,
    PluginValue,
    ViewPlugin,
    ViewUpdate,
} from '@codemirror/view';
import {
    debouncedUpdateOutline,
    updateOutline,
} from './helpers/update-comments-outline';
import { Editor, TFile } from 'obsidian';
import { decorateComments } from './helpers/decorate-comments';

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
        this.decorations = decorateComments(view);
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
            this.decorations = decorateComments(update.view);
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
}

const pluginSpec: PluginSpec<EditorPlugin> = {
    decorations: (value: EditorPlugin) => value.decorations,
};

export const editorPlugin = ViewPlugin.fromClass(EditorPlugin, pluginSpec);
