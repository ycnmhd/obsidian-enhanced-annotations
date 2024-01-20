import LabeledAnnotations from '../../main';
import {
    controls,
    fontSize,
} from '../../sidebar-outline/components/components/controls-bar/controls-bar.store';
import {
    hiddenLabels,
    hiddenTypes,
} from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';

export const subscribeSettingsToOutlineState = (plugin: LabeledAnnotations) => {
    const settings = plugin.settings;
    const unsubs: Set<() => void> = new Set();
    unsubs.add(
        fontSize.subscribe((fontSize) => {
            const value = settings.getValue();
            value.outline.fontSize = fontSize;
            settings.set(value);
        }),
    );
    unsubs.add(
        controls.subscribe((controls) => {
            const value = settings.getValue();
            value.outline.showSearchInput = controls.showSearchInput;
            value.outline.showLabelsFilter = controls.showLabelsFilter;
            settings.set(value);
        }),
    );
    unsubs.add(
        hiddenLabels.subscribe((hiddenLabels) => {
            const value = settings.getValue();
            value.outline.hiddenLabels = [...hiddenLabels];
            settings.set(value);
        }),
    );
    unsubs.add(
        hiddenTypes.subscribe((hiddenCategories) => {
            const value = settings.getValue();
            value.outline.hiddenTypes = [...hiddenCategories];
            settings.set(value);
        }),
    );
    return unsubs;
};
