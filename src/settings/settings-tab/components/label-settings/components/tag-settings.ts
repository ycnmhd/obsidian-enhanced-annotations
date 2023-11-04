import { Setting } from 'obsidian';
import {
    FontFamily,
    FontWeight,
    Opacity,
    TagSettings as TTagSettings,
} from '../../../../settings-type';
import LabeledAnnotations from '../../../../../main';
import { l } from '../../../../../lang/lang';
import { TextSVG } from './text-svg';
import { MultiOptionExtraButton } from './multi-option-extra-button';

type Props = {
    containerEl: HTMLElement;
    tag: TTagSettings;
    plugin: LabeledAnnotations;
    render: () => void;
};
export const TagSettings = ({ containerEl, tag, plugin, render }: Props) => {
    const el = new Setting(containerEl);

    const style = tag.style;
    el.controlEl.innerHTML = '';

    el.setName(l.TAG_STYLE);
    el.addExtraButton((button) => {
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
            value: style.fontWeight,
            onChange: (value) => {
                plugin.settings.dispatch({
                    payload: {
                        weight: value,
                    },
                    type: 'SET_TAG_FONT_WEIGHT',
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
                value: style.fontFamily,
                button,
                onChange: (value) => {
                    plugin.settings.dispatch({
                        payload: {
                            family: value,
                        },
                        type: 'SET_TAG_FONT_FAMILY',
                    });
                },
            });
        })

        .addExtraButton((button) => {
            MultiOptionExtraButton({
                button,
                onChange: (value) =>
                    plugin.settings.dispatch({
                        type: 'SET_TAG_FONT_SIZE',
                        payload: { fontSize: value },
                    }),
                options: [10, 12, 16, 20, 24, 32].map((n) => ({
                    name: n + 'px',
                    value: n,
                    iconContent: TextSVG(String(n)),
                    iconType: 'svg-html',
                })),
                value: style.fontSize,
                name: 'Font size',
            });
        })
        .addExtraButton((button) => {
            MultiOptionExtraButton({
                button,
                onChange: (value) =>
                    plugin.settings.dispatch({
                        type: 'SET_TAG_OPACITY',
                        payload: { opacity: value as Opacity },
                    }),
                options: ([80, 60, 40, 20] as Opacity[]).map((n) => ({
                    name: n + '%',
                    value: n,
                    iconContent: TextSVG(String(n)),
                    iconType: 'svg-html',
                })),
                value: style.opacity,
                name: 'Text opacity',
            });
        });

    el.addToggle((toggle) => {
        toggle
            .setValue(tag.enableStyle)
            .setTooltip(l.SETTINGS_LABELS_STYLES_ENABLE_STYLE)
            .onChange((value) => {
                plugin.settings.dispatch({
                    payload: { enable: value },
                    type: 'ENABLE_TAG_STYLES',
                });
            });
    });
};
