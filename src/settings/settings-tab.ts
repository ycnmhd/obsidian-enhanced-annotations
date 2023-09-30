import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import CommentGroups from '../main';

export class SettingsTab extends PluginSettingTab {
    plugin: CommentGroups;

    constructor(app: App, plugin: CommentGroups) {
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
        for (const group of Object.values(settings.groups)) {
            const el = new Setting(containerEl)
                .setName(group.pattern)
                .addText((text) => {
                    text.inputEl.pattern = '^\\w+$';
                    text.setPlaceholder('pattern')
                        .setValue(group.pattern)
                        .onChange((value) => {
                            text.inputEl.checkValidity();
                            console.log(text.inputEl.validity);
                            if (text.inputEl.validity.patternMismatch) {
                                text.inputEl.reportValidity();
                                new Notice(`Only A-Za-z0-9_ are allowed`);
                            } else {
                                this.plugin.settings.dispatch({
                                    payload: {
                                        pattern: value,
                                        id: group.id,
                                    },
                                    type: 'SET_PATTERN',
                                });
                                el.setName(value);
                            }
                        });
                })
                .addColorPicker((component) => {
                    component.setValue(group.color || '').onChange((value) => {
                        group.color = value;
                        this.plugin.settings.dispatch({
                            payload: {
                                id: group.id,
                                color: value,
                            },
                            type: 'SET_COLOR',
                        });
                    });
                })

                .addExtraButton((button) => {
                    button.setIcon('trash');
                    button.onClick(() => {
                        this.plugin.settings.dispatch({
                            payload: { id: group.id },
                            type: 'DELETE_GROUP',
                        });
                        this.display();
                    });
                });
        }
        new Setting(containerEl).addButton((button) => {
            button
                .setIcon('plus')
                .onClick(() => {
                    this.plugin.settings.dispatch({ type: 'NEW_GROUP' });
                    this.display();
                })
                .setTooltip('Add group');
        });
    }
}
