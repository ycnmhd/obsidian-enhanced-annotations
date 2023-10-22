import CommentLabels from '../../main';
import { labelSettings } from '../../comments-outline-view/comments-outline/components/comments-list/comments-list.store';
import { decorationState } from '../../editor-plugin/helpers/decorate-comments/decoration-state';

export const subscribeToSettings = (plugin: CommentLabels) => {
    const settings = plugin.settings;
    const previousValue = {
        current: undefined,
    };
    settings.subscribe((value) => {
        const labels = value.decoration.styles.labels;
        if (labels !== previousValue.current) {
            previousValue.current = labels as any;
            labelSettings.set(
                Object.fromEntries(
                    Object.values(labels).map((label) => [label.label, label]),
                ),
            );
        }
        decorationState.setSettings(value.decoration.styles);
    });
};
