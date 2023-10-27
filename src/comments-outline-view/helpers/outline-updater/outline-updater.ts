import { MarkdownView, TFile } from 'obsidian';
import CommentLabels from '../../../main';
import { updateOutline } from './helpers/update-comments-outline';
import { resetOutline } from './helpers/reset-outline';
// @ts-ignore
import W from 'src/editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments.worker.ts';

const getViewOfFile = (plugin: CommentLabels, file: TFile) => {
    return plugin.app.workspace
        .getLeavesOfType('markdown')
        .find((l) => l.view instanceof MarkdownView && l.view.file === file);
};

export class OutlineUpdater {
    timeout: ReturnType<typeof setTimeout>;
    private worker: Worker;
    private _view: MarkdownView | null;

    constructor(private plugin: CommentLabels) {
        this.onLoad();
    }

    get view(): MarkdownView | null {
        return this._view;
    }

    private updateOutline(view: MarkdownView | null, immediate = false) {
        clearTimeout(this.timeout);
        this._view = view;
        if (view instanceof MarkdownView) {
            if (immediate) {
                this.worker.postMessage(view.editor.getValue());
            } else {
                this.timeout = setTimeout(() => {
                    this.worker.postMessage(view.editor.getValue());
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
        this.worker = new W();
        this.worker.onmessage = (e) => {
            updateOutline(e.data, this.plugin);
        };
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
