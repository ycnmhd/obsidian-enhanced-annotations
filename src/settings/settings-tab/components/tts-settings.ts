import { Setting } from 'obsidian';
import CommentLabels from '../../../main';
import { DEFAULT_SETTINGS } from '../../default-settings';

type Props = {
    containerEl: HTMLElement;
    plugin: CommentLabels;
    renderSettings: () => void;
};
export const TTSSettings = ({ plugin, containerEl, renderSettings }: Props) => {
    containerEl.createEl('h3', { text: 'TTS settings' });
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
        .setName('Voice');
    new Setting(containerEl)
        .setName('Volume')
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
                .setTooltip('restore default')
                .onClick(() => {
                    plugin.settings.dispatch({
                        type: 'SET_TTS_VOLUME',
                        payload: { volume: DEFAULT_SETTINGS().tts.volume },
                    });
                    renderSettings();
                });
        });

    new Setting(containerEl)
        .setName('Rate')
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
                .setTooltip('restore default')
                .onClick(() => {
                    plugin.settings.dispatch({
                        type: 'SET_TTS_RATE',
                        payload: { rate: DEFAULT_SETTINGS().tts.rate },
                    });
                    renderSettings();
                });
        });

    new Setting(containerEl)
        .setName('Pitch')
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
                .setTooltip('restore default')
                .onClick(() => {
                    plugin.settings.dispatch({
                        type: 'SET_TTS_PITCH',
                        payload: { pitch: DEFAULT_SETTINGS().tts.pitch },
                    });
                    renderSettings();
                });
        });
};
