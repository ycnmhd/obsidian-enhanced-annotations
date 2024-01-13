import LabeledAnnotations from '../../main';
import {
    fontSize,
    showLabelsFilter,
    showSearchInput,
} from '../../sidebar-outline/components/components/controls-bar/controls-bar.store';
import {
    hiddenLabels,
    hiddenTypes,
} from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';

export const subscribeSettingsToOutlineState = (plugin: LabeledAnnotations) => {
    const settings = plugin.settings;
    fontSize.subscribe((fontSize) => {
        const value = settings.getValue();
        value.outline.fontSize = fontSize;
        settings.set(value);
    });
    showLabelsFilter.subscribe((showLabelsFilter) => {
        const value = settings.getValue();
        value.outline.showLabelsFilter = showLabelsFilter;
        settings.set(value);
    });
    hiddenLabels.subscribe((hiddenLabels) => {
        const value = settings.getValue();
        value.outline.hiddenLabels = [...hiddenLabels];
        settings.set(value);
    });
    hiddenTypes.subscribe((hiddenCategories) => {
        const value = settings.getValue();
        value.outline.hiddenTypes = [...hiddenCategories];
        settings.set(value);
    });
    showSearchInput.subscribe((showSearchInput) => {
        const value = settings.getValue();
        value.outline.showSearchInput = showSearchInput;
        settings.set(value);
    });
};
