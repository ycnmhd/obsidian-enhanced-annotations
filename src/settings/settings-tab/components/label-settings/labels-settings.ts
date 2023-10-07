import { AddNewLabel } from './components/add-new-label';
import CommentLabels from '../../../../main';
import { LabelSettings } from './components/label-settings';
import { l } from '../../../../lang/lang';

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
