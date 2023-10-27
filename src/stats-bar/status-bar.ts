import { COMMENTS_OUTLINE_VIEW_TYPE } from '../comments-outline-view/comments-outline-view';
import CommentLabels from '../main';
import { outlineComments } from '../comments-outline-view/comments-outline/components/comments-list/comments-list.store';
import { script } from './word-count';

export class StatusBar {
    private element: HTMLElement;
    private worker: Worker;
    private state: {
        comments: number;
        words: number;
        chars: number;
    } = { comments: 0, words: 0, chars: 0 };

    constructor(private plugin: CommentLabels) {
        this.onLoad();
    }

    private onLoad = () => {
        this.element = this.plugin.addStatusBarItem();
        this.element.addClass('mod-clickable');
        this.element.onClickEvent(this.onClick);

        this.worker = new Worker(
            URL.createObjectURL(
                new Blob([script], {
                    type: 'text/javascript',
                }),
            ),
        );

        outlineComments.subscribe((v) => {
            const comments = Object.values(v.labels).flat();
            const text = comments.map((c) => c.text).join();
            this.state.comments = comments.length;
            this.state.chars = text.length;
            this.worker.postMessage(text);
        });
        this.worker.onmessage = (d) => {
            this.state.words = d.data;
            this.update();
        };
    };

    private update = () => {
        this.element.setText(`${this.state.comments} comments`);
        this.element.ariaLabel = `${this.state.words} words ${this.state.chars} characters`;
    };

    private onClick = () => {
        const leaf = this.plugin.app.workspace.getLeavesOfType(
            COMMENTS_OUTLINE_VIEW_TYPE,
        )[0];
        if (leaf) this.plugin.app.workspace.revealLeaf(leaf);
        else this.plugin.activateView();
    };
}
