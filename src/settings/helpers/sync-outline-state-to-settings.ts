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
import { searchTerm } from '../../sidebar-outline/components/components/controls-bar/components/search-input.store';

export const syncOutlineStateToSettings = (plugin: LabeledAnnotations) => {
    const settings = plugin.settings;
    fontSize.subscribe((fontSize) => {
        settings.update((s) => ({
            ...s,
            outline: {
                ...s.outline,
                fontSize,
            },
        }));
    });
    showLabelsFilter.subscribe((showLabelsFilter) => {
        settings.update((s) => ({
            ...s,
            outline: {
                ...s.outline,
                showLabelsFilter,
            },
        }));
    });
    hiddenLabels.subscribe((hiddenLabels) => {
        settings.update((s) => ({
            ...s,
            outline: {
                ...s.outline,
                hiddenLabels: [...hiddenLabels],
            },
        }));
    });
    hiddenCategories.subscribe((newVal) => {
        settings.update((s) => ({
            ...s,
            outline: {
                ...s.outline,
                hiddenCategories: [...newVal],
            },
        }));
    });
    showSearchInput.subscribe((showSearchInput) => {
        settings.update((s) => ({
            ...s,
            outline: {
                ...s.outline,
                showSearchInput,
            },
        }));
    });
    searchTerm.subscribe((searchInputValue) => {
        settings.update((s) => ({
            ...s,
            outline: {
                ...s.outline,
                searchTerm: searchInputValue,
            },
        }));
    });
};
