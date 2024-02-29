import { Setting } from 'obsidian';
import LabeledAnnotations from '../../../main';
import { l } from '../../../lang/lang';
import { CommentFormat } from '../../settings-type';
import { settingsHeader } from '../../../status-bar/helpers/class-names';

type Props = {
    containerEl: HTMLElement;
    plugin: LabeledAnnotations;
};
export const AutoSuggestSettings = ({ plugin, containerEl }: Props) => {
    new Setting(containerEl)
        .setName(l.SETTINGS_AUTO_SUGGEST_TITLE)
        .setHeading()
        .settingEl.addClass(settingsHeader);
    const settings = plugin.settings.getValue();
    new Setting(containerEl)
        .setName(l.SETTINGS_AUTO_SUGGEST_ENABLE)
        .setDesc(l.SETTINGS_AUTO_SUGGEST_ENABLE_DESC)
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
        .setDesc(l.SETTINGS_AUTO_SUGGEST_TRIGGER_PHRASE_DESC)
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
        .setName(l.SETTINGS_AUTO_SUGGEST_COMMENT_TYPE)
        .setDesc(l.SETTINGS_AUTO_SUGGEST_COMMENT_TYPE_DESC)
        .addDropdown((component) => {
            component.addOption('html', 'HTML');
            component.addOption('markdown', 'Obsidian');
            component
                .onChange((value) =>
                    plugin.settings.dispatch({
                        payload: { type: value as CommentFormat },
                        type: 'SET_AUTO_SUGGEST_COMMENT_TYPE',
                    }),
                )
                .setValue(settings.editorSuggest.commentFormat);
        });
};
