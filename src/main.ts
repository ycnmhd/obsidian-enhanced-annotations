import { Plugin } from 'obsidian';
import { editorPlugin } from './editor/editor-plugin';
import { addInsertCommentCommands } from './commands/commands';
import { DEFAULT_SETTINGS, Settings } from './settings';
import {
    COMMENTS_OUTLINE_VIEW_TYPE,
    CommentsOutlineView,
} from './components/comments-outline';

export default class CommentGroups extends Plugin {
    settings: Settings;

    async onload() {
        this.registerEditorExtension([editorPlugin]);
        addInsertCommentCommands(this);
        this.registerView(
            COMMENTS_OUTLINE_VIEW_TYPE,
            (leaf) => new CommentsOutlineView(leaf),
        );
        await this.activateView();
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData(),
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async activateView() {
        this.app.workspace.detachLeavesOfType(COMMENTS_OUTLINE_VIEW_TYPE);

        await this.app.workspace.getRightLeaf(false).setViewState({
            type: COMMENTS_OUTLINE_VIEW_TYPE,
            active: true,
        });

        this.app.workspace.revealLeaf(
            this.app.workspace.getLeavesOfType(COMMENTS_OUTLINE_VIEW_TYPE)[0],
        );
    }
}
