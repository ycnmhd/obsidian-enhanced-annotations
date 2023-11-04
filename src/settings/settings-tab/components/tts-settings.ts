import { Setting } from 'obsidian';
import LabeledAnnotations from '../../../main';
import { DEFAULT_SETTINGS } from '../../default-settings';
import { l } from '../../../lang/lang';

type Props = {
    containerEl: HTMLElement;
    plugin: LabeledAnnotations;
};
export const TTSSettings = ({ plugin, containerEl }: Props) => {
    const render = () => {
        containerEl.empty();
        TTSSettings({
            plugin,
            containerEl,
        });
    };
    containerEl.createEl('h3', { text: l.SETTINGS_TTS_TITLE });
    new Setting(containerEl)
        .addDropdown((component) => {
            const voices = window.speechSynthesis
                .getVoices()
                .map((v) => [v.name, v.name]);
            component.addOptions(Object.fromEntries(voices));
            component.setValue(
                plugin.settings.getValue().tts.voice || voices[0][0],
            );
            component.onChange((v) => {
                plugin.settings.dispatch({
                    type: 'SET_TTS_VOICE',
                    payload: {
                        voice: v,
                    },
                });
            });
        })
        .setName(l.SETTINGS_TTS_VOICE);
    new Setting(containerEl)
        .setName(l.SETTINGS_TTS_VOLUME)
        .addSlider((component) =>
            component
                .setValue(plugin.settings.getValue().tts.volume * 100)
                .setDynamicTooltip()
                .setLimits(0, 100, 1)
                .onChange((value) => {
                    plugin.settings.dispatch({
                        type: 'SET_TTS_VOLUME',
                        payload: { volume: value / 100 },
                    });
                }),
        )
        .addExtraButton((button) => {
            button
                .setIcon('reset')
                .setTooltip(l.SETTINGS_TTS_RESTORE_DEFAULTS)
                .onClick(() => {
                    plugin.settings.dispatch({
                        type: 'SET_TTS_VOLUME',
                        payload: { volume: DEFAULT_SETTINGS().tts.volume },
                    });
                    render();
                });
        });

    new Setting(containerEl)
        .setName(l.SETTINGS_TTS_RATE)
        .addSlider((slider) => {
            slider
                .setValue(plugin.settings.getValue().tts.rate)
                .setDynamicTooltip()
                .setLimits(0.1, 10, 0.1)
                .onChange((value) => {
                    plugin.settings.dispatch({
                        type: 'SET_TTS_RATE',
                        payload: { rate: value },
                    });
                });
        })
        .addExtraButton((button) => {
            button
                .setIcon('reset')
                .setTooltip(l.SETTINGS_TTS_RESTORE_DEFAULTS)
                .onClick(() => {
                    plugin.settings.dispatch({
                        type: 'SET_TTS_RATE',
                        payload: { rate: DEFAULT_SETTINGS().tts.rate },
                    });
                    render();
                });
        });

    new Setting(containerEl)
        .setName(l.SETTINGS_TTS_PITCH)
        .addSlider((slider) => {
            slider
                .setValue(plugin.settings.getValue().tts.pitch)
                .setDynamicTooltip()
                .setLimits(0, 2, 0.1)
                .onChange((value) => {
                    plugin.settings.dispatch({
                        type: 'SET_TTS_PITCH',
                        payload: { pitch: value },
                    });
                });
        })
        .addExtraButton((button) => {
            button
                .setIcon('reset')
                .setTooltip(l.SETTINGS_TTS_RESTORE_DEFAULTS)
                .onClick(() => {
                    plugin.settings.dispatch({
                        type: 'SET_TTS_PITCH',
                        payload: { pitch: DEFAULT_SETTINGS().tts.pitch },
                    });
                    render();
                });
        });
    new Setting(containerEl)
        .addToggle((c) => {
            c.setValue(plugin.settings.getValue().tts.focusAnnotationInEditor);
            c.onChange((v) => {
                plugin.settings.dispatch({
                    type: 'SET_TTS_FOCUS_COMMENT_IN_EDITOR',
                    payload: { enable: v },
                });
            });
        })
        .setName(l.SETTINGS_TTS_FOCUS_ANNOTATION_IN_EDITOR);
};
