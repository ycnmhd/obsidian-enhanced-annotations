import { derived, writable } from 'svelte/store';
import { searchTerm } from '../controls-bar/components/search-input/search-input.store';
import { LabelSettings } from '../../../../settings/settings-type';
import { ParsedComment } from '../../../../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';

export const labelSettings = writable<Record<string, LabelSettings>>({});
export type OutlineStore = {
    labels: {
        [name: string | number]: ParsedComment[];
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

export const hiddenLabels = writable<Set<string>>(new Set<string>());
// hiddenLabels may contain labels that are not be present in filtered comments
// filteredHiddenLabels should contain only hidden labels that are present in filtered coments
export const filteredHiddenLabels = derived(
    [hiddenLabels, filteredComments],
    ([hiddenLabels, filteredComments]) => {
        const existingLabels = new Set(Object.keys(filteredComments.labels));
        return new Set([...hiddenLabels].filter((l) => existingLabels.has(l)));
    },
);
export const visibleComments = derived(
    [filteredComments, hiddenLabels],
    ([filteredComments, hiddenLabels]) => {
        const allComments: ParsedComment[] = [];
        for (const [label, comments] of Object.entries(
            filteredComments.labels,
        )) {
            if (!hiddenLabels.has(label)) {
                allComments.push(...comments);
            }
        }
        return allComments.sort(
            (a, b) => a.range.from.line - b.range.from.line,
        );
    },
);

export const activeCommentIndex = writable(-1);
