import { Notice, Setting } from 'obsidian';
import { Label } from '../../settings-type';
import CommentLabels from '../../../main';

type Props = {
    containerEl: HTMLElement;
    label: Label;
    plugin: CommentLabels;
    renderSettings: () => void;
};
export const GroupSettings = ({
    containerEl,
    label,
    plugin,
    renderSettings,
}: Props) => {
    const el = new Setting(containerEl)
        .setName(label.pattern)
        .addText((text) => {
            text.inputEl.pattern = '^\\w+$';
            text.setPlaceholder('pattern')
                .setValue(label.pattern)
                .onChange((value) => {
                    text.inputEl.checkValidity();
                    console.log(text.inputEl.validity);
                    if (text.inputEl.validity.patternMismatch) {
                        text.inputEl.reportValidity();
                        new Notice(`Only A-Za-z0-9_ are allowed`);
                    } else {
                        plugin.settings.dispatch({
                            payload: {
                                pattern: value,
                                id: label.id,
                            },
                            type: 'SET_PATTERN',
                        });
                        el.setName(value);
                    }
                });
        })
        .addColorPicker((component) => {
            component.setValue(label.color || '').onChange((value) => {
                plugin.settings.dispatch({
                    payload: {
                        id: label.id,
                        color: value,
                    },
                    type: 'SET_COLOR',
                });
            });
        })
        .addToggle((toggle) => {
            toggle
                .setValue(label.enableCommand)
                .setTooltip('Command to insert this label')
                .onChange((value) => {
                    plugin.settings.dispatch({
                        payload: { id: label.id, enable: value },
                        type: 'ENABLE_LABEL_COMMAND',
                    });
                });
        })
        .addExtraButton((button) => {
            button.setIcon('trash');
            button.onClick(() => {
                plugin.settings.dispatch({
                    payload: { id: label.id },
                    type: 'DELETE_GROUP',
                });
                renderSettings();
            });
        });
};
