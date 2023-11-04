import LabeledAnnotations from '../../main';
import {
    fontSize,
    showLabelsFilter,
    showSearchInput,
} from '../../sidebar-outline/components/components/controls-bar/controls-bar.store';

import {
    hiddenCategories,
    hiddenLabels,
} from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';

export const loadOutlineStateFromSettings = (plugin: LabeledAnnotations) => {
    const settings = plugin.settings.getValue().outline;
    fontSize.set(settings.fontSize as any);
    showLabelsFilter.set(settings.showLabelsFilter);
    hiddenLabels.set(new Set(settings.hiddenLabels));
    hiddenCategories.set(new Set(settings.hiddenCategories));
    showSearchInput.set(settings.showSearchInput);
};
