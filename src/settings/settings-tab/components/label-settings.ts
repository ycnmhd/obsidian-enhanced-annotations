import { Notice, Setting } from 'obsidian';
import { Label } from '../../settings-type';
import CommentLabels from '../../../main';

type Props = {
    containerEl: HTMLElement;
    label: Label;
    plugin: CommentLabels;
    renderSettings: () => void;
};
export const LabelSettings = ({
    containerEl,
    label,
    plugin,
    renderSettings,
}: Props) => {
    const el = new Setting(containerEl)
        .setName(label.label)
        .addText((text) => {
            text.inputEl.pattern = '^\\w+$';
            text.setPlaceholder('pattern')
                .setValue(label.label)
                .onChange((value) => {
                    text.inputEl.checkValidity();
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
                .setValue(label.enableStyles)
                .setTooltip('Enable styles')
                .onChange((value) => {
                    plugin.settings.dispatch({
                        payload: { id: label.id, enable: value },
                        type: 'ENABLE_LABEL_STYLES',
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
