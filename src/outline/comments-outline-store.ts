import { derived, writable } from 'svelte/store';

import type { Comment } from './helpers/update-comments-outline';
import { Label } from '../settings/settings-type';
import { plugin } from '../main';

export type OutlineStore = {
    labels: {
        [name: string | number]: Comment[];
    };
};
export const outlineComments = writable<OutlineStore>({ labels: {} });

export const outlineFilter = writable('');
export const displayMode = writable<'list' | 'tabs'>('list');
export const selectedLabel = writable('/');

export const POSSIBLE_FONT_SIZES = [10, 12, 14, 16, 18, 20, 22, 24] as const;
export const fontSize = writable<(typeof POSSIBLE_FONT_SIZES)[number]>(12);
export const labelSettings = writable<Record<string, Label>>({});

export const subscribeToSettings = () => {
    plugin.current.settings.subscribe(() => {
        const v = plugin.current.settings.getValue();
        labelSettings.set(
            Object.fromEntries(
                Object.values(v.labels).map((label) => [label.label, label]),
            ),
        );
    });
};

export const filteredComments = derived(
    [outlineFilter, outlineComments],
    ([$term, $items]) => {
        const term = $term.toLowerCase();
        if (!term) return $items;
        const filteredDictionary = { labels: {} } as typeof $items;
        for (const [label, comments] of Object.entries($items.labels)) {
            const filteredComments = comments.filter((v) =>
                v.text.toLowerCase().includes(term),
            );
            if (filteredComments.length) {
                filteredDictionary.labels[label] = filteredComments;
            }
        }
        return filteredDictionary as OutlineStore;
    },
);

export const safeSelectedLabel = derived(
    [filteredComments, selectedLabel],
    ([$filteredComments, $selectedLabel]) => {
        if (!$selectedLabel || !$filteredComments.labels[$selectedLabel]) {
            return Object.keys($filteredComments.labels)[0];
        }
        return $selectedLabel;
    },
);

export const selectTab = (tab: string) => {
    selectedLabel.set(tab);
};

export const visibleComments = derived(
    [filteredComments, safeSelectedLabel, displayMode],
    ([$filteredComments, $safeSelectedLabel, $displayMode]): Comment[] => {
        if ($displayMode === 'tabs') {
            return $filteredComments.labels[$safeSelectedLabel];
        } else {
            return Object.values($filteredComments.labels).flat();
        }
    },
);
