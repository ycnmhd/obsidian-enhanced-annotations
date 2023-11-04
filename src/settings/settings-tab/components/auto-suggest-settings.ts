import { Setting } from 'obsidian';
import LabeledAnnotations from '../../../main';
import { l } from '../../../lang/lang';
import { CommentType } from '../../settings-type';

type Props = {
    containerEl: HTMLElement;
    plugin: LabeledAnnotations;
};
export const AutoSuggestSettings = ({ plugin, containerEl }: Props) => {
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
        .setName(l.SETTINGS_AUTO_SUGGEST_COMMENT_TYPE)
        .addDropdown((component) => {
            component.addOption('html', 'HTML');
            component.addOption('markdown', 'Markdown');
            component
                .onChange((value) =>
                    plugin.settings.dispatch({
                        payload: { type: value as CommentType },
                        type: 'SET_AUTO_SUGGEST_COMMENT_TYPE',
                    }),
                )
                .setValue(settings.editorSuggest.commentType);
        });
};
