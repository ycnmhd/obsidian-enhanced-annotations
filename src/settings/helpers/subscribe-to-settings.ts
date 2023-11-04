import LabeledAnnotations from '../../main';
import { labelSettings } from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { decorationState } from '../../editor-plugin/helpers/decorate-annotations/decoration-state';

export const subscribeToSettings = (plugin: LabeledAnnotations) => {
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
