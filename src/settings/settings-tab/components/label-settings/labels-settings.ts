import LabeledAnnotations from '../../../../main';
import { l } from '../../../../lang/lang';
import { Setting } from 'obsidian';
import { TagSettings } from './components/tag-settings';

type Props = {
    containerEl: HTMLElement;
    plugin: LabeledAnnotations;
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

    TagSettings({
        tag: plugin.settings.getValue().decoration.styles.tag,
        plugin,
        containerEl,
        render,
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
                .setValue(settings.decoration.autoRegisterLabels);
        });
};
