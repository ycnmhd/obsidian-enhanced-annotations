import { Notice, Setting } from 'obsidian';
import { LabelSettings } from '../../settings-type';
import CommentLabels from '../../../main';

const rec = {
    upper: 'case-upper',
    lower: 'case-lower',
    title: 'case-sensitive',
    unset: 'case-upper',
};

const styleToggleButton = (button: HTMLElement, enabled?: boolean) => {
    button.setCssStyles({
        cursor: 'pointer',
    });
    if (enabled) {
        button.setCssStyles({
            color: 'var(--color-accent)',
            opacity: '100%',
        });
    } else {
        button.setCssStyles({
            color: 'var(--icon-color)',
            opacity: '30%',
        });
    }
};

type Props = {
    containerEl: HTMLElement;
    label: LabelSettings;
    plugin: CommentLabels;
    renderSettings: () => void;
};
export const LabelSettings = ({
    containerEl,
    label,
    plugin,
    renderSettings,
}: Props) => {
    const el = new Setting(containerEl);

    el.controlEl.innerHTML = '';
    el.addText((text) => {
        text.inputEl.pattern = '^\\w+$';
        text.inputEl.setCssStyles({
            marginRight: 'auto',
        });
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
                }
            });
    });
    el.controlEl.setCssStyles({
        width: '100%',
    });
    el.addColorPicker((component) => {
        component.setValue(label.style.color || '').onChange((value) => {
            plugin.settings.dispatch({
                payload: {
                    id: label.id,
                    color: value,
                },
                type: 'SET_COLOR',
            });
        });
    })
        .addExtraButton((button) => {
            button.setIcon('italic');
            styleToggleButton(button.extraSettingsEl, label.style.italic);
            button.onClick(() => {
                plugin.settings.dispatch({
                    payload: {
                        id: label.id,
                        italic: !label.style.italic,
                    },
                    type: 'SET_LABEL_ITALIC',
                });
                renderSettings();
            });
        })
        .addExtraButton((button) => {
            button.setIcon('bold');
            styleToggleButton(button.extraSettingsEl, label.style.bold);
            button.onClick(() => {
                plugin.settings.dispatch({
                    payload: {
                        id: label.id,
                        bold: !label.style.bold,
                    },
                    type: 'SET_LABEL_BOLD',
                });
                renderSettings();
            });
        })
        .addExtraButton((button) => {
            button.setIcon('underline');
            styleToggleButton(button.extraSettingsEl, label.style.underline);
            button.onClick(() => {
                plugin.settings.dispatch({
                    payload: {
                        id: label.id,
                        underline: !label.style.underline,
                    },
                    type: 'SET_LABEL_UNDERLINE',
                });
                renderSettings();
            });
        })
        .addExtraButton((button) => {
            button.setIcon(
                label.style.case ? rec[label.style.case] : 'case-upper',
            );
            styleToggleButton(
                button.extraSettingsEl,
                !(!label.style.case || label.style.case === 'unset'),
            );
            button.onClick(() => {
                plugin.settings.dispatch({
                    type: 'TOGGLE_LABEL_CASE',
                    payload: {
                        id: label.id,
                    },
                });
                renderSettings();
            });
        })
        .addDropdown((c) => {
            c.addOptions({
                default: 'default',
                '12': '12px',
                '16': '16px',
                '18': '18px',
                '20': '20px',
                '24': '24px',
                '32': '32px',
            });
            c.selectEl.setCssStyles({
                width: '50px',
            });
            c.onChange((value) => {
                plugin.settings.dispatch({
                    type: 'SET_LABEL_FONT_SIZE',
                    payload: { id: label.id, fontSize: value },
                });
                renderSettings();
            });
            c.setValue(String(label.style.fontSize));
        });
    el.addToggle((toggle) => {
        toggle
            .setValue(label.enableStyle)
            .setTooltip('Enable styles')
            .onChange((value) => {
                plugin.settings.dispatch({
                    payload: { id: label.id, enable: value },
                    type: 'ENABLE_LABEL_STYLES',
                });
            });
    }).addExtraButton((button) => {
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
