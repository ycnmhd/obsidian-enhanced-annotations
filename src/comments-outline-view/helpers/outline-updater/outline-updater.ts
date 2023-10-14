import { MarkdownView, TFile } from 'obsidian';
import CommentLabels from '../../../main';
import { updateOutline } from './helpers/update-comments-outline';
import { resetOutline } from './helpers/reset-outline';

const getViewOfFile = (plugin: CommentLabels, file: TFile) => {
    return plugin.app.workspace
        .getLeavesOfType('markdown')
        .find((l) => l.view instanceof MarkdownView && l.view.file === file);
};

export class OutlineUpdater {
    timeout: ReturnType<typeof setTimeout>;

    currentView?: MarkdownView | null;

    constructor(private plugin: CommentLabels) {
        this.onLoad();
    }

    private updateOutline(view?: MarkdownView | null, immediate = false) {
        clearTimeout(this.timeout);
        this.currentView = view;
        if (view instanceof MarkdownView) {
            if (immediate) {
                updateOutline(view.editor);
            } else {
                this.timeout = setTimeout(() => {
                    updateOutline(view.editor);
                }, 2000);
            }
        } else {
            resetOutline();
        }
    }

    private onFileOpen(file: TFile | null) {
        if (file) {
            const leaf = getViewOfFile(this.plugin, file);
            if (leaf) {
                this.updateOutline(leaf.view as MarkdownView, true);
            }
        }
    }

    private onLoad() {
        const app = this.plugin.app;
        this.plugin.registerEvent(
            app.workspace.on('editor-change', (editor, view) => {
                this.updateOutline(view as MarkdownView);
            }),
        );

        this.plugin.registerEvent(
            app.workspace.on('file-open', (file) => {
                this.onFileOpen(file);
            }),
        );

        this.plugin.app.workspace.onLayoutReady(() => {
            this.onFileOpen(this.plugin.app.workspace.getActiveFile());
        });

        setTimeout(() => {
            this.onFileOpen(this.plugin.app.workspace.getActiveFile());
        }, 1000);
    }
}
