import { MarkdownView, TFile } from 'obsidian';
import LabeledAnnotations from '../../../main';
import { updateOutline } from './helpers/update-outline';
import { resetOutline } from './helpers/reset-outline';
// @ts-ignore
import W from 'src/editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations.worker.ts';
import { Store } from '../../../helpers/store';
import { WorkerPromise } from '../../../helpers/worker-promise';
import { Annotation } from '../../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';

const getViewOfFile = (plugin: LabeledAnnotations, file: TFile) => {
    return plugin.app.workspace
        .getLeavesOfType('markdown')
        .find((l) => l.view instanceof MarkdownView && l.view.file === file);
};

type OutlineState = {
    view: MarkdownView | null;
};

export class OutlineUpdater extends Store<OutlineState, never> {
    timeout: ReturnType<typeof setTimeout>;
    private worker: WorkerPromise<string, Annotation[]>;

    constructor(private plugin: LabeledAnnotations) {
        super({ view: null });
        this.onLoad();
    }

    private updateOutline(view: MarkdownView | null, immediate = false) {
        clearTimeout(this.timeout);
        this.set({ view });
        if (view instanceof MarkdownView) {
            if (immediate) {
                this.worker
                    .run(view.editor.getValue())
                    .then((d) => updateOutline(d, this.plugin));
            } else {
                this.timeout = setTimeout(() => {
                    this.worker
                        .run(view.editor.getValue())
                        .then((d) => updateOutline(d, this.plugin));
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
        const worker = new W();
        this.worker = new WorkerPromise(worker);

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
