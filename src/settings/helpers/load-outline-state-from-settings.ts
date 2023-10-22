import CommentLabels from '../../main';
import {
    fontSize,
    showLabelsFilter,
    showSearchInput,
} from '../../comments-outline-view/comments-outline/components/controls-bar/controls-bar.store';

import { hiddenLabels } from '../../comments-outline-view/comments-outline/components/comments-list/comments-list.store';

export const loadOutlineStateFromSettings = (plugin: CommentLabels) => {
    const settings = plugin.settings.getValue().outline;
    fontSize.set(settings.fontSize as any);
    showLabelsFilter.set(settings.showLabelsFilter);
    hiddenLabels.set(new Set(settings.hiddenLabels));
    showSearchInput.set(settings.showSearchInput);
};
