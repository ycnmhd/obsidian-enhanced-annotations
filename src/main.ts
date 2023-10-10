import { Plugin } from 'obsidian';
import { editorPlugin } from './editor-plugin/editor-plugin';
import { addInsertCommentCommands } from './commands/commands';
import { Settings } from './settings/settings-type';
import {
    COMMENTS_OUTLINE_VIEW_TYPE,
    CommentsOutlineView,
} from './comments-outline-view/comments-outline-view';
import { SettingsTab } from './settings/settings-tab/settings-tab';
import { Store } from './helpers/store';
import { SettingsActions, settingsReducer } from './settings/settings-reducer';
import { CommentSuggest } from './editor-suggest/comment-suggest';
import { DEFAULT_SETTINGS } from './settings/default-settings';
import {
    loadOutlineStateFromSettings,
    subscribeToSettings,
    syncOutlineStateToSettings,
} from './settings/helpers/sync-settings-with-outline-ui';
import { tts } from './comments-outline-view/comments-outline/components/controls-bar/helpers/tts';
import { mergeDeep } from './settings/helpers/merge-objects';
import { registerMenuEvent } from './note-creation/register-menu-event';

export const plugin: {
    current: CommentLabels;
} = {
    current: undefined as any,
};
export default class CommentLabels extends Plugin {
    settings: Store<Settings, SettingsActions>;

    async onload() {
        plugin.current = this;
        tts.setPlugin = this;
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
            loadOutlineStateFromSettings(this);
            subscribeToSettings(this);
            syncOutlineStateToSettings(this);
            this.addSettingTab(new SettingsTab(this.app, this));
            registerMenuEvent(this);
        });
    }

    onunload() {}

    async loadSettings() {
        const settings = (await this.loadData()) || {};
        this.settings = new Store<Settings, SettingsActions>(
            mergeDeep(settings, DEFAULT_SETTINGS()),
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
