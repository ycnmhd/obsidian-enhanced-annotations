import { Notice, Setting } from 'obsidian';
import {
    FontFamily,
    FontWeight,
    LabelSettings as TLabelSettings,
    Opacity,
} from '../../../../settings-type';
import CommentLabels from '../../../../../main';
import { l } from '../../../../../lang/lang';
import { TextSVG } from './text-svg';
import { MultiOptionExtraButton } from './multi-option-extra-button';

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
    label: TLabelSettings;
    plugin: CommentLabels;
    render: () => void;
};
export const LabelSettings = ({
    containerEl,
    label,
    plugin,
    render,
}: Props) => {
    const el = new Setting(containerEl);

    el.controlEl.innerHTML = '';
    el.addText((text) => {
        text.inputEl.pattern = '^\\w+$';
        text.inputEl.setCssStyles({
            marginRight: 'auto',
        });
        text.setPlaceholder(l.SETTINGS_LABELS_STYLES_NAME_PLACE_HOLDER)
            .setValue(label.label)
            .onChange((value) => {
                text.inputEl.checkValidity();
                if (text.inputEl.validity.patternMismatch) {
                    text.inputEl.reportValidity();
                    new Notice(l.SETTINGS_LABELS_STYLES_LABEL_INVALID);
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
                render();
            });
            button.setTooltip('Underline');
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
                render();
            });
            button.setTooltip('Italic');
        })
        .addExtraButton((button) => {
            MultiOptionExtraButton({
                name: 'Font weight',
                options: [
                    {
                        value: 'thin' as FontWeight,
                        iconContent: TextSVG('B', { fontWeight: 400 }),
                        iconType: 'svg-html',
                    },
                    {
                        value: 'bold' as FontWeight,
                        iconContent: TextSVG('B', { fontWeight: 600 }),
                        iconType: 'svg-html',
                    },
                ],
                button,
                value: label.style.fontWeight,
                onChange: (value) => {
                    plugin.settings.dispatch({
                        payload: {
                            id: label.id,
                            weight: value,
                        },
                        type: 'SET_LABEL_FONT_WEIGHT',
                    });
                },
            });
        })
        .addExtraButton((button) => {
            MultiOptionExtraButton({
                name: 'Font family',
                options: (
                    ['sans-serif', 'serif', 'monospace'] as FontFamily[]
                ).map((f) => ({
                    value: f as FontFamily,
                    iconContent: TextSVG('F', {
                        fontFamily: f as FontFamily,
                    }),
                    iconType: 'svg-html',
                })),
                value: label.style.fontFamily,
                button,
                onChange: (value) => {
                    plugin.settings.dispatch({
                        payload: {
                            id: label.id,
                            family: value,
                        },
                        type: 'SET_LABEL_FONT_FAMILY',
                    });
                },
            });
        })

        .addExtraButton((button) => {
            MultiOptionExtraButton({
                button,
                options: [
                    {
                        iconType: 'svg-name',
                        iconContent: 'case-sensitive',
                        value: 'title',
                    },
                    {
                        iconType: 'svg-name',
                        iconContent: 'case-upper',
                        value: 'upper',
                    },
                    {
                        iconType: 'svg-name',
                        iconContent: 'case-lower',
                        value: 'lower',
                    },
                ],
                value: label.style.case,
                name: 'Case',
                onChange: (value) =>
                    plugin.settings.dispatch({
                        type: 'SET_LABEL_CASE',
                        payload: {
                            id: label.id,
                            case: value,
                        },
                    }),
            });
        })
        .addExtraButton((button) => {
            MultiOptionExtraButton({
                button,
                onChange: (value) =>
                    plugin.settings.dispatch({
                        type: 'SET_LABEL_FONT_SIZE',
                        payload: { id: label.id, fontSize: value },
                    }),
                options: [12, 16, 20, 24, 32].map((n) => ({
                    name: n + 'px',
                    value: n,
                    iconContent: TextSVG(String(n)),
                    iconType: 'svg-html',
                })),
                value: label.style.fontSize,
                name: 'Font size',
            });
        })
        .addExtraButton((button) => {
            MultiOptionExtraButton({
                button,
                onChange: (value) =>
                    plugin.settings.dispatch({
                        type: 'SET_LABEL_FONT_OPACITY',
                        payload: { id: label.id, opacity: value as Opacity },
                    }),
                options: ([80, 60, 40, 20] as Opacity[]).map((n) => ({
                    name: n + '%',
                    value: n,
                    iconContent: TextSVG(String(n)),
                    iconType: 'svg-html',
                })),
                value: label.style.opacity,
                name: 'Text opacity',
            });
        });

    el.addToggle((toggle) => {
        toggle
            .setValue(label.enableStyle)
            .setTooltip(l.SETTINGS_LABELS_STYLES_ENABLE_STYLE)
            .onChange((value) => {
                plugin.settings.dispatch({
                    payload: { id: label.id, enable: value },
                    type: 'ENABLE_LABEL_STYLES',
                });
            });
    }).addExtraButton((button) => {
        button.setIcon('trash');
        button
            .onClick(() => {
                plugin.settings.dispatch({
                    payload: { id: label.id },
                    type: 'DELETE_GROUP',
                });
                render();
            })
            .setTooltip(l.SETTINGS_LABELS_STYLES_DELETE_STYLE);
    });
};
