import { Setting } from 'obsidian';
import CommentLabels from '../../../main';
import { l } from '../../../lang/lang';

type Props = {
    containerEl: HTMLElement;
    plugin: CommentLabels;
};
export const GeneralSettings = ({ plugin, containerEl }: Props) => {
    containerEl.createEl('h3', { text: l.SETTINGS_AUTO_SUGGEST_TITLE });
    const settings = plugin.settings.getValue();
    new Setting(containerEl)
        .setName(l.SETTINGS_AUTO_SUGGEST_ENABLE)
        .addToggle((toggle) => {
            toggle
                .onChange((value) =>
                    plugin.settings.dispatch({
                        payload: { enable: value },
                        type: 'ENABLE_AUTO_SUGGEST',
                    }),
                )
                .setValue(settings.editorSuggest.enableAutoSuggest);
        });
    new Setting(containerEl)
        .setName(l.SETTINGS_AUTO_SUGGEST_TRIGGER_PHRASE)
        .addText((component) => {
            component
                .onChange((value) =>
                    plugin.settings.dispatch({
                        payload: { trigger: value },
                        type: 'SET_AUTO_SUGGEST_TRIGGER',
                    }),
                )
                .setValue(settings.editorSuggest.triggerPhrase)
                .setPlaceholder('//');
        });
    new Setting(containerEl)
        .setName(l.SETTINGS_AUTO_SUGGEST_AUTO_REGISTER)
        .addToggle((component) => {
            component
                .onChange((value) =>
                    plugin.settings.dispatch({
                        payload: { enable: value },
                        type: 'ENABLE_AUTO_REGISTER_LABELS',
                    }),
                )
                .setValue(settings.parsing.autoRegisterLabels);
        });
};
