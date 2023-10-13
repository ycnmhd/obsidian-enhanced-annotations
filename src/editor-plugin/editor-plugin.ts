import {
    DecorationSet,
    EditorView,
    PluginSpec,
    PluginValue,
    ViewPlugin,
    ViewUpdate,
} from '@codemirror/view';
import { decorateComments } from './helpers/decorate-comments/decorate-comments';

class EditorPlugin implements PluginValue {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = decorateComments(view);
    }

    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
            this.decorations = decorateComments(update.view);
        }
    }

    destroy() {}
}

const pluginSpec: PluginSpec<EditorPlugin> = {
    decorations: (value: EditorPlugin) => value.decorations,
};

export const editorPlugin = ViewPlugin.fromClass(EditorPlugin, pluginSpec);
