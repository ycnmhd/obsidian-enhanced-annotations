import { Setting } from 'obsidian';
import CommentLabels from '../../../../../main';
import { l } from '../../../../../lang/lang';

type Props = {
    containerEl: HTMLElement;
    plugin: CommentLabels;
    render: () => void;
};
export const AddNewLabel = ({ render, plugin, containerEl }: Props) => {
    new Setting(containerEl).addButton((button) => {
        button
            .setIcon('plus')
            .setButtonText(l.SETTINGS_LABELS_STYLES_NEW)
            .onClick(() => {
                plugin.settings.dispatch({
                    type: 'NEW_GROUP',
                    payload: { pattern: '' },
                });
                render();
            });
    });
};
