import { Setting } from 'obsidian';
import CommentLabels from '../../../main';

type Props = {
    containerEl: HTMLElement;
    plugin: CommentLabels;
    renderSettings: () => void;
};
export const AddNewGroup = ({ renderSettings, plugin, containerEl }: Props) => {
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
            .setTooltip('Add group');
    });
};
