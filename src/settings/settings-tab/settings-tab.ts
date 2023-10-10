import { App, PluginSettingTab } from 'obsidian';
import CommentLabels from '../../main';
import { AutoSuggestSettings } from './components/auto-suggest-settings';
import { TTSSettings } from './components/tts-settings';
import { NoteSettings } from './components/note-settings/note-settings';
import { LabelsSettings } from './components/label-settings/labels-settings';

export class SettingsTab extends PluginSettingTab {
    plugin: CommentLabels;

    constructor(app: App, plugin: CommentLabels) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display = (): void => {
        const { containerEl } = this;

        containerEl.empty();

        AutoSuggestSettings({
            plugin: this.plugin,
            containerEl,
        });
        TTSSettings({
            plugin: this.plugin,
            containerEl,
            renderSettings: this.display,
        });
        NoteSettings({ containerEl, plugin: this.plugin });
        LabelsSettings({
            renderSettings: this.display,
            plugin: this.plugin,
            containerEl,
        });
    };
}
