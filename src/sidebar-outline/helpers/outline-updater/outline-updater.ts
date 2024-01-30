import { MarkdownView, View, WorkspaceItem } from 'obsidian';
import LabeledAnnotations from '../../../main';
import { updateOutline } from './helpers/update-outline';
import { resetOutline } from './helpers/reset-outline';
// @ts-ignore
import W from 'src/editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations.worker.ts';
import { Store } from '../../../helpers/store';
import { WorkerPromise } from '../../../helpers/worker-promise';
import { Annotation } from '../../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';

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

    private updateOutline(view?: View | null, immediate = false) {
        clearTimeout(this.timeout);
        if (view instanceof MarkdownView) {
            this.set({ view });
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
            this.set({ view: null });
            resetOutline();
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
            app.workspace.on('active-leaf-change', (leaf) => {
                const side = (
                    leaf?.getRoot() as WorkspaceItem & { side?: string }
                )?.side;
                if (!side) this.updateOutline(leaf?.view, true);
            }),
        );

        const onStart = () => {
            this.updateOutline(
                this.plugin.app.workspace.getActiveViewOfType(MarkdownView),
            );
        };
        this.plugin.app.workspace.onLayoutReady(onStart);
        setTimeout(onStart, 1000);
    }
}
