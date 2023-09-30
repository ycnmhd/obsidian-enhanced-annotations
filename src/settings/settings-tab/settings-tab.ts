import { App, PluginSettingTab, Setting } from 'obsidian';
import CommentLabels from '../../main';
import { AddNewGroup } from './components/add-new-group';
import { GroupSettings } from './components/group-settings';
import { AutoRegisterLabels } from './components/auto-register-labels';

export class SettingsTab extends PluginSettingTab {
    plugin: CommentLabels;

    constructor(app: App, plugin: CommentLabels) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const settings = this.plugin.settings.getValue();
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Enable comment auto-suggest')
            .addToggle((toggle) => {
                toggle
                    .onChange((value) =>
                        this.plugin.settings.dispatch({
                            payload: { enable: value },
                            type: 'ENABLE_AUTO_SUGGEST',
                        }),
                    )
                    .setValue(settings.editorSuggest.enableAutoSuggest);
            });
        new Setting(containerEl)
            .setName('Auto-suggest trigger phrase')
            .addText((component) => {
                component
                    .onChange((value) =>
                        this.plugin.settings.dispatch({
                            payload: { trigger: value },
                            type: 'SET_AUTO_SUGGEST_TRIGGER',
                        }),
                    )
                    .setValue(settings.editorSuggest.triggerPhrase)
                    .setPlaceholder('//');
            });
        AutoRegisterLabels({
            plugin: this.plugin,
            containerEl,
        });
        for (const label of Object.values(settings.labels)) {
            GroupSettings({
                renderSettings: this.display,
                plugin: this.plugin,
                label,
                containerEl,
            });
        }
        AddNewGroup({
            renderSettings: this.display,
            plugin: this.plugin,
            containerEl,
        });
    }
}
