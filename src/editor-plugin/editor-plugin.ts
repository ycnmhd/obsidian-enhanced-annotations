import {
    DecorationSet,
    EditorView,
    PluginSpec,
    PluginValue,
    ViewPlugin,
    ViewUpdate,
} from '@codemirror/view';
import { Editor, TFile } from 'obsidian';
import { decorateComments } from './helpers/decorate-comments';
import { plugin } from '../main';
import {
    debouncedUpdateOutline,
    updateOutline,
} from '../comments-outline-view/helpers/update-comments-outline';

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
        const activeEditor = plugin.current.app.workspace.activeEditor;

        const shouldUpdate =
            !context.currentFile ||
            context.currentFile !== activeEditor?.file ||
            update.docChanged ||
            update.viewportChanged;
        const canUpdate = activeEditor?.file && activeEditor?.editor;
        if (shouldUpdate && canUpdate) {
            this.decorations = decorateComments(update.view);
            const immediate =
                !context.currentFile ||
                context.currentFile !== activeEditor.file;
            context.currentEditor = activeEditor.editor;
            context.currentFile = activeEditor.file;
            if (context.clearTimeout) context.clearTimeout();
            if (immediate) {
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
