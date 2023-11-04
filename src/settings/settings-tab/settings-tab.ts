import { App, PluginSettingTab } from 'obsidian';
import LabeledAnnotations from '../../main';
import { AutoSuggestSettings } from './components/auto-suggest-settings';
import { TTSSettings } from './components/tts-settings';
import { NoteSettings } from './components/note-settings/note-settings';
import { LabelsSettings } from './components/label-settings/labels-settings';

export class SettingsTab extends PluginSettingTab {
    plugin: LabeledAnnotations;

    constructor(app: App, plugin: LabeledAnnotations) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display = (): void => {
        const { containerEl } = this;

        containerEl.empty();

        NoteSettings({
            containerEl: containerEl.createEl('div'),
            plugin: this.plugin,
        });
        AutoSuggestSettings({
            plugin: this.plugin,
            containerEl: containerEl.createEl('div'),
        });
        TTSSettings({
            plugin: this.plugin,
            containerEl: containerEl.createEl('div'),
        });
        LabelsSettings({
            plugin: this.plugin,
            containerEl: containerEl.createEl('div'),
        });
    };
}
