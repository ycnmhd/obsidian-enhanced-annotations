import { ItemView, WorkspaceLeaf } from 'obsidian';

import SidebarOutline from './components/sidebar-outline.svelte';
import { l } from '../lang/lang';
import LabeledAnnotations from '../main';

export const SIDEBAR_OUTLINE_VIEW_TYPE = 'annotations-outline';

export class SidebarOutlineView extends ItemView {
    component: SidebarOutline | undefined;

    icon = 'message-square';

    constructor(
        leaf: WorkspaceLeaf,
        private plugin: LabeledAnnotations,
    ) {
        super(leaf);
    }

    getViewType() {
        return SIDEBAR_OUTLINE_VIEW_TYPE;
    }

    getDisplayText() {
        return l.PLUGIN_NAME;
    }

    async onOpen() {
        this.component = new SidebarOutline({
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
