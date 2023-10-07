import { Setting } from 'obsidian';
import CommentLabels from '../../../../../main';
import { l } from '../../../../../lang/lang';

type Props = {
    containerEl: HTMLElement;
    plugin: CommentLabels;
    renderSettings: () => void;
};
export const AddNewLabel = ({ renderSettings, plugin, containerEl }: Props) => {
    new Setting(containerEl).addButton((button) => {
        button
            .setIcon('plus')
            .onClick(() => {
                plugin.settings.dispatch({
                    type: 'NEW_GROUP',
                    payload: { pattern: '' },
                });
                renderSettings();
            })
            .setTooltip(l.SETTINGS_LABELS_STYLES_NEW);
    });
};
