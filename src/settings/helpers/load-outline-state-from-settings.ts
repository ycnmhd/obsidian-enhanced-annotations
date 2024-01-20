import LabeledAnnotations from '../../main';
import {
    controls,
    fontSize,
    pluginIdle,
} from '../../sidebar-outline/components/components/controls-bar/controls-bar.store';

import {
    hiddenLabels,
    hiddenTypes,
} from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { pluginIsIdle } from '../settings-selectors';

export const loadOutlineStateFromSettings = (plugin: LabeledAnnotations) => {
    const settings = plugin.settings.getValue();
    const outlineSettings = settings.outline;
    fontSize.set(outlineSettings.fontSize as any);
    controls.update((v) => ({
        ...v,
        showLabelsFilter: settings.outline.showLabelsFilter,
        showSearchInput: settings.outline.showSearchInput,
    }));
    hiddenLabels.set(new Set(outlineSettings.hiddenLabels));
    hiddenTypes.set(new Set(outlineSettings.hiddenTypes));
    pluginIdle.set(pluginIsIdle(settings));
};
