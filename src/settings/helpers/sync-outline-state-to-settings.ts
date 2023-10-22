import CommentLabels from '../../main';
import {
    fontSize,
    showLabelsFilter,
    showSearchInput,
} from '../../comments-outline-view/comments-outline/components/controls-bar/controls-bar.store';
import { hiddenLabels } from '../../comments-outline-view/comments-outline/components/comments-list/comments-list.store';
import { searchTerm } from '../../comments-outline-view/comments-outline/components/controls-bar/components/search-input/search-input.store';

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
