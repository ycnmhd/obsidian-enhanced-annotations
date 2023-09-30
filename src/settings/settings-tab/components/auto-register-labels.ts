import { Setting } from 'obsidian';
import CommentLabels from '../../../main';

type Props = {
    containerEl: HTMLElement;
    plugin: CommentLabels;
};
export const AutoRegisterLabels = ({ plugin, containerEl }: Props) => {
    new Setting(containerEl)
        .setName('Auto-register new labels')
        .addToggle((component) => {
            component
                .onChange((value) =>
                    plugin.settings.dispatch({
                        payload: { enable: value },
                        type: 'ENABLE_AUTO_REGISTER_LABELS',
                    }),
                )
                .setValue(
                    plugin.settings.getValue().parsing.autoRegisterLabels,
                );
        });
};
