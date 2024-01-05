import {
    DecorationSet,
    EditorView,
    PluginSpec,
    PluginValue,
    ViewPlugin,
    ViewUpdate,
} from '@codemirror/view';
import { decorateAnnotations } from './helpers/decorate-annotations/decorate-annotations';
import { outlineAnnotation } from '../sidebar-outline/helpers/outline-updater/helpers/trigger-editor-update';
import { decorationState } from './helpers/decorate-annotations/decoration-state';

class EditorPlugin implements PluginValue {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = decorateAnnotations(view);
    }

    update(update: ViewUpdate) {
        if (
            decorationState.enabled &&
            (update.docChanged ||
                update.viewportChanged ||
                (update.transactions as any)?.[0]?.annotations?.[0] ===
                    outlineAnnotation)
        ) {
            this.decorations = decorateAnnotations(update.view);
        }
    }

    destroy() {}
}

const pluginSpec: PluginSpec<EditorPlugin> = {
    decorations: (value: EditorPlugin) => value.decorations,
};

export const editorPlugin = ViewPlugin.fromClass(EditorPlugin, pluginSpec);
