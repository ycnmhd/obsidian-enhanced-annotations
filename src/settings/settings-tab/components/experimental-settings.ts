import LabeledAnnotations from '../../../main';
import { Setting } from 'obsidian';
import { l } from '../../../lang/lang';
import { settingsHeader } from '../../../status-bar/helpers/class-names';

type Props = {
    containerEl: HTMLElement;
    plugin: LabeledAnnotations;
};

export const ExperimentalSettings = ({ plugin, containerEl }: Props) => {
    const settings = plugin.settings.getValue();
    containerEl.empty();
    new Setting(containerEl)
        .setName(l.SETTINGS_EXPERIMENTAL)
        .setHeading()
        .settingEl.addClass(settingsHeader);

    new Setting(containerEl)
        .setName(l.SETTINGS_EXPERIMENTAL_INLINE_FOOTNOTES)
        .setDesc(l.SETTINGS_EXPERIMENTAL_INLINE_FOOTNOTES_DESC)
        .addToggle((toggle) => {
            console.log(toggle);
            toggle
                .onChange((value) =>
                    plugin.settings.dispatch({
                        payload: { enable: value },
                        type: 'ENABLE_INLINE_FOOTNOTES',
                    }),
                )
                .setValue(settings.experimental.inlineFootnotes);
        });
};
