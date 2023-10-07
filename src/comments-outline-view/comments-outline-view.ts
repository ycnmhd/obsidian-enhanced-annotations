import { ItemView, WorkspaceLeaf } from 'obsidian';

import CommentsOutline from './comments-outline/comments-outline.svelte';
import { l } from '../lang/lang';

export const COMMENTS_OUTLINE_VIEW_TYPE = 'example-view';

export class CommentsOutlineView extends ItemView {
    component: CommentsOutline | undefined;

    icon = 'message-square';

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return COMMENTS_OUTLINE_VIEW_TYPE;
    }

    getDisplayText() {
        return l.PLUGIN_NAME;
    }

    async onOpen() {
        this.component = new CommentsOutline({
            target: this.contentEl,
            props: {
                variable: 1,
            },
        });
    }

    async onClose() {
        this.component?.$destroy();
    }
}
