import LabeledAnnotations from '../../main';
import { labelSettings } from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { decorationState } from '../../editor-plugin/helpers/decorate-annotations/decoration-state';

export const subscribeToSettings = (plugin: LabeledAnnotations) => {
    const settings = plugin.settings;
    const previousValue = {
        current: '',
    };
    settings.subscribe((value) => {
        const styles = value.decoration.styles;
        const stylesStr = JSON.stringify(styles);
        if (stylesStr !== previousValue.current) {
            previousValue.current = stylesStr;
            labelSettings.set(
                Object.fromEntries(
                    Object.values(styles.labels).map((label) => [
                        label.label,
                        label,
                    ]),
                ),
            );
            decorationState.setSettings(value.decoration.styles);
        }
    });
};
