import { AddNewLabel } from './components/add-new-label';
import CommentLabels from '../../../../main';
import { LabelSettings } from './components/label-settings';
import { l } from '../../../../lang/lang';
import { Setting } from 'obsidian';

type Props = {
    containerEl: HTMLElement;
    plugin: CommentLabels;
};
export const LabelsSettings = ({ plugin, containerEl }: Props) => {
    containerEl.createEl('h3', { text: l.SETTINGS_LABELS_STYLES_TITLE });
    const settings = plugin.settings.getValue();
    const render = () => {
        containerEl.empty();
        LabelsSettings({
            plugin,
            containerEl,
        });
    };
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
                .setValue(settings.decoration.autoRegisterLabels);
        });
    new Setting(containerEl)
        .setName(l.SETTINGS_DECORATE_COMMENT_TAGS)
        .addToggle((component) => {
            component
                .onChange((value) =>
                    plugin.settings.dispatch({
                        payload: { enable: value },
                        type: 'ENABLE_DECORATE_COMMENT_TAGS',
                    }),
                )
                .setValue(settings.decoration.decorateCommentTags);
        });
    for (const label of Object.values(plugin.settings.getValue().labels)) {
        LabelSettings({
            render,
            plugin,
            label,
            containerEl,
        });
    }
    AddNewLabel({
        render,
        plugin,
        containerEl,
    });
};
