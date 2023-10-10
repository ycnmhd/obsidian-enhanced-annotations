import { AddNewLabel } from './components/add-new-label';
import CommentLabels from '../../../../main';
import { LabelSettings } from './components/label-settings';
import { l } from '../../../../lang/lang';
import { Setting } from 'obsidian';

type Props = {
    containerEl: HTMLElement;
    plugin: CommentLabels;
    renderSettings: () => void;
};
export const LabelsSettings = ({
    renderSettings,
    plugin,
    containerEl,
}: Props) => {
    containerEl.createEl('h3', { text: l.SETTINGS_LABELS_STYLES_TITLE });
    const settings = plugin.settings.getValue();
    new Setting(containerEl)
        .setName(l.SETTINGS_AUTO_SUGGEST_AUTO_REGISTER)
        .addToggle((component) => {
            component
                .onChange((value) =>
                    plugin.settings.dispatch({
                        payload: { enable: value },
                        type: 'ENABLE_AUTO_REGISTER_LABELS',
                    }),
                )
                .setValue(settings.parsing.autoRegisterLabels);
        });
    for (const label of Object.values(plugin.settings.getValue().labels)) {
        LabelSettings({
            renderSettings,
            plugin,
            label,
            containerEl,
        });
    }
    AddNewLabel({
        renderSettings,
        plugin,
        containerEl,
    });
};
