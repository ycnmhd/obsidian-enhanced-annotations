import LabeledAnnotations from '../../../../main';
import { l } from '../../../../lang/lang';
import { Setting } from 'obsidian';
import { TagSettings } from './components/tag-settings';
import { DefaultPalette } from '../../../settings-type';

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
        .addDropdown((component) => {
            const options: Record<DefaultPalette, string> = {
                bright: 'Bright',
                dull: 'Dull',
            };
            component.addOptions(options);
            component.setValue(
                plugin.settings.getValue().decoration.defaultPalette,
            );
            component.onChange((v) => {
                plugin.settings.dispatch({
                    type: 'SET_DEFAULT_PALETTE',
                    payload: {
                        palette: v as DefaultPalette,
                    },
                });
            });
        })
        .setName(l.SETTINGS_DEFAULT_PALETTE)
        .setDesc(l.SETTINGS_DEFAULT_PALETTE_DESC);

    new Setting(containerEl)
        .setName(l.SETTINGS_AUTO_SUGGEST_AUTO_REGISTER)
        .setDesc(l.SETTINGS_AUTO_SUGGEST_AUTO_REGISTER_DESC)
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
