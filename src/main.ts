import { Plugin } from 'obsidian';
import { editorPlugin } from './editor/editor-plugin';
import { addInsertCommentCommands } from './commands/commands';
import { DEFAULT_SETTINGS, Settings } from './settings';

export default class CommentGroups extends Plugin {
    settings: Settings;

    async onload() {
        this.registerEditorExtension([editorPlugin]);
        addInsertCommentCommands(this);
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
}
