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
} from '../comments-outline-view/helpers/update-comments-outline';
import { Editor, TFile } from 'obsidian';
import { decorateComments } from './helpers/decorate-comments';

export const context: {
    currentEditor?: Editor;
    currentFile?: TFile;
    clearTimeout?: () => void;
} = {
    currentEditor: undefined as any,
    currentFile: undefined,
    clearTimeout: undefined,
};

class EditorPlugin implements PluginValue {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = decorateComments(view);
    }

    update(update: ViewUpdate) {
        const activeEditor = app.workspace.activeEditor;

        const shouldUpdate =
            !context.currentFile ||
            activeEditor?.file !== context.currentFile ||
            update.docChanged ||
            update.viewportChanged;
        const canUpdate = activeEditor?.file && activeEditor?.editor;
        if (shouldUpdate && canUpdate) {
            const editor = activeEditor?.editor as Editor;
            const file = activeEditor.file;
            context.currentEditor = editor;
            this.decorations = decorateComments(update.view);
            if (!context.currentFile || context.currentFile !== file) {
                context.currentFile = file;
                if (context.clearTimeout) context.clearTimeout();
                updateOutline(update.view);
            } else {
                context.clearTimeout = debouncedUpdateOutline(update.view);
            }
        }
    }

    destroy() {}
}

const pluginSpec: PluginSpec<EditorPlugin> = {
    decorations: (value: EditorPlugin) => value.decorations,
};

export const editorPlugin = ViewPlugin.fromClass(EditorPlugin, pluginSpec);
