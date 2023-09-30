import { derived, writable } from 'svelte/store';

import type { Comment } from './helpers/update-comments-outline';

export type OutlineStore = {
    groups: {
        [name: string | number]: Comment[];
    };
};
export const outlineComments = writable<OutlineStore>({ groups: {} });

export const outlineFilter = writable('');
export const filteredComments = derived(
    [outlineFilter, outlineComments],
    ([$term, $items]) => {
        const term = $term.toLowerCase();
        if (!term) return $items;
        const filteredDictionary = { groups: {} } as typeof $items;
        for (const [label, comments] of Object.entries($items.groups)) {
            const filteredComments = comments.filter((v) =>
                v.text.toLowerCase().includes(term),
            );
            if (filteredComments.length) {
                filteredDictionary.groups[label] = filteredComments;
            }
        }
        return filteredDictionary;
    },
);
