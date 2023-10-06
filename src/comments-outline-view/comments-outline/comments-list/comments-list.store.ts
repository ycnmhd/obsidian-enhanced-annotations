import { derived, writable } from 'svelte/store';
import { searchTerm } from '../components/controls-bar/components/search-input/search-input.store';
import { LabelSettings } from '../../../settings/settings-type';
import { Comment } from '../../helpers/update-comments-outline';
import { hiddenLabels } from '../components/controls-bar/components/tabs-filter/tabs-filter.store';

export const labelSettings = writable<Record<string, LabelSettings>>({});
export type OutlineStore = {
    labels: {
        [name: string | number]: Comment[];
    };
};
export const outlineComments = writable<OutlineStore>({ labels: {} });
export const filteredComments = derived(
    [searchTerm, outlineComments],
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

export const visibleComments = derived(
    [filteredComments, hiddenLabels],
    ([filteredComments, hiddenLabels]) => {
        const allComments: Comment[] = [];
        for (const [label, comments] of Object.entries(
            filteredComments.labels,
        )) {
            if (!hiddenLabels.has(label)) {
                allComments.push(...comments);
            }
        }
        return allComments.sort((a, b) => a.position.line - b.position.line);
    },
);
