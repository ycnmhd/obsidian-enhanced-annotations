import { Plugin } from 'obsidian';
import { editorPlugin } from './editor-plugin/editor-plugin';
import { addInsertCommentCommands } from './commands/commands';
import { Settings } from './settings/settings-type';
import {
    COMMENTS_OUTLINE_VIEW_TYPE,
    CommentsOutlineView,
} from './outline/comments-outline';
import { SettingsTab } from './settings/settings-tab/settings-tab';
import { Store } from './helpers/store';
import { SettingsActions, settingsReducer } from './settings/settings-reducer';
import { CommentSuggest } from './editor-suggest/comment-suggest';
import { DEFAULT_SETTINGS } from './settings/default-settings';
import { subscribeToSettings } from './outline/comments-outline-store';

export const plugin: {
    current: CommentLabels;
} = {
    current: undefined as any,
};
export default class CommentLabels extends Plugin {
    settings: Store<Settings, SettingsActions>;

    async onload() {
        plugin.current = this;
        await this.loadSettings();
        this.registerEditorExtension([editorPlugin]);
        this.registerEditorSuggest(new CommentSuggest(this.app, this));
        addInsertCommentCommands(this);
        this.registerView(
            COMMENTS_OUTLINE_VIEW_TYPE,
            (leaf) => new CommentsOutlineView(leaf),
        );
        this.app.workspace.onLayoutReady(async () => {
            await this.activateView();
            subscribeToSettings();
            this.addSettingTab(new SettingsTab(this.app, this));
        });
    }

    onunload() {}

    async loadSettings() {
        const settings = await this.loadData();
        this.settings = new Store<Settings, SettingsActions>(
            settings || DEFAULT_SETTINGS,
            settingsReducer,
        );
        this.settings.subscribe(() => {
            this.saveSettings();
        });
    }

    async saveSettings() {
        await this.saveData(this.settings.getValue());
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
