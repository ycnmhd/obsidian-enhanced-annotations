import { ItemView, WorkspaceLeaf } from 'obsidian';

import CommentsOutline from './comments-outline/comments-outline.svelte';
import { l } from '../lang/lang';
import CommentLabels from '../main';

export const COMMENTS_OUTLINE_VIEW_TYPE = 'comments-outline';

export class CommentsOutlineView extends ItemView {
    component: CommentsOutline | undefined;

    icon = 'message-square';

    constructor(
        leaf: WorkspaceLeaf,
        private plugin: CommentLabels,
    ) {
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
                plugin: this.plugin,
            },
        });
    }

    async onClose() {
        this.component?.$destroy();
    }
}
