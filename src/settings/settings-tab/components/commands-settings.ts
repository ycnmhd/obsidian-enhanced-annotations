import { Setting } from 'obsidian';
import LabeledAnnotations from '../../../main';
import { l } from '../../../lang/lang';

type Props = {
    containerEl: HTMLElement;
    plugin: LabeledAnnotations;
};
export const CommandsSettings = ({ plugin, containerEl }: Props) => {
    containerEl.createEl('h3', { text: l.SETTINGS_COMMANDS_TITLE });
    const settings = plugin.settings.getValue();
    new Setting(containerEl)
        .setName(l.SETTINGS_COMMANDS_ASSIGN_HOTKEYS)
        .setDesc(l.SETTINGS_COMMANDS_ASSIGN_HOTKEYS_DESC)
        .addToggle((toggle) => {
            toggle.setValue(settings.commands.assignHotkeys).onChange((value) =>
                plugin.settings.dispatch({
                    type: 'TOGGLE_ASSIGN_HOTKEYS',
                }),
            );
        });
};
