import { MarkdownView, View } from 'obsidian';
import CommentLabels from '../../../main';
import {
    debouncedUpdateOutline,
    updateOutline,
} from './helpers/update-comments-outline';
import { resetOutline } from './helpers/reset-outline';

export class OutlineUpdater {
    private clearTimeout: () => void;

    currentView: MarkdownView | null;

    constructor(private plugin: CommentLabels) {
        this.onLoad();
    }

    private immediateUpdate(view?: View | MarkdownView | null) {
        if (this.clearTimeout) this.clearTimeout();
        if (view && view instanceof MarkdownView) {
            updateOutline(view.editor);
            this.currentView = view;
        } else {
            resetOutline();
            this.currentView = null;
        }
    }

    private onLoad() {
        const app = this.plugin.app;
        this.plugin.registerEvent(
            app.workspace.on('editor-change', (editor, view) => {
                if (this.clearTimeout) this.clearTimeout();
                this.clearTimeout = debouncedUpdateOutline(editor);
                if (view instanceof MarkdownView) this.currentView = view;
            }),
        );

        this.plugin.registerEvent(
            app.workspace.on('file-open', (file) => {
                this.immediateUpdate(
                    this.plugin.app.workspace.getActiveViewOfType(MarkdownView),
                );
            }),
        );
    }
}
