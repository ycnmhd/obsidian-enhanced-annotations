import CommentLabels from '../../main';
import { labelSettings } from '../../comments-outline-view/comments-outline/components/comments-list/comments-list.store';
import {
    fontSize,
    showLabelsFilter,
    showSearchInput,
} from '../../comments-outline-view/comments-outline/components/controls-bar/controls-bar.store';
import { hiddenLabels } from '../../comments-outline-view/comments-outline/components/controls-bar/components/tabs-filter/tabs-filter.store';
import { searchTerm } from '../../comments-outline-view/comments-outline/components/controls-bar/components/search-input/search-input.store';

export const subscribeToSettings = (plugin: CommentLabels) => {
    // settings to stores
    const settings = plugin.settings;
    const previousValue = {
        current: undefined,
    };
    settings.subscribe(() => {
        const value = settings.getValue();

        const labels = value.labels;
        if (labels !== previousValue.current) {
            previousValue.current = labels as any;
            labelSettings.set(
                Object.fromEntries(
                    Object.values(labels).map((label) => [label.label, label]),
                ),
            );
        }
    });
};

export const loadOutlineStateFromSettings = (plugin: CommentLabels) => {
    const settings = plugin.settings.getValue().outline;
    fontSize.set(settings.fontSize);
    showLabelsFilter.set(settings.showLabelsFilter);
    hiddenLabels.set(new Set(settings.hiddenLabels));
    showSearchInput.set(settings.showSearchInput);
};

export const syncOutlineStateToSettings = (plugin: CommentLabels) => {
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
