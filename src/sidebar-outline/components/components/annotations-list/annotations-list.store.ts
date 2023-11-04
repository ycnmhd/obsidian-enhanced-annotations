import { derived, writable } from 'svelte/store';
import { searchTerm } from '../controls-bar/components/search-input.store';
import { LabelSettings } from '../../../../settings/settings-type';
import { Annotation } from '../../../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';

export const labelSettings = writable<Record<string, LabelSettings>>({});
export type OutlineStore = {
    labels: {
        [name: string | number]: Annotation[];
    };
};
export const fileAnnotations = writable<OutlineStore>({ labels: {} });

export type AnnotationCategory = 'comment' | 'highlight';
export const hiddenCategories = writable<Set<AnnotationCategory>>(new Set());

export const hiddenLabels = writable<Set<string>>(new Set<string>());

export const activeAnnotationIndex = writable(-1);

export const filteredBySearch = derived(
    [searchTerm, fileAnnotations],
    ([$term, $items]) => {
        const term = $term.toLowerCase();
        if (!term) return $items;
        const filteredDictionary = { labels: {} } as typeof $items;
        for (const [label, annotations] of Object.entries($items.labels)) {
            const filteredAnnotations = annotations.filter((v) => {
                return v.text.toLowerCase().includes(term);
            });
            if (filteredAnnotations.length) {
                filteredDictionary.labels[label] = filteredAnnotations;
            }
        }
        return filteredDictionary as OutlineStore;
    },
);
export const filteredBySearchAndCategory = derived(
    [filteredBySearch, hiddenCategories],
    ([$items, categories]) => {
        if (!categories.size) return $items;
        const filteredDictionary = { labels: {} } as typeof $items;
        for (const [label, annotations] of Object.entries($items.labels)) {
            const filteredAnnotations = annotations.filter((v) => {
                return !categories.has(v.isHighlight ? 'highlight' : 'comment');
            });
            if (filteredAnnotations.length) {
                filteredDictionary.labels[label] = filteredAnnotations;
            }
        }
        return filteredDictionary as OutlineStore;
    },
);

export const filteredBySearchAndCategoryAndLabel = derived(
    [filteredBySearchAndCategory, hiddenLabels],
    ([filteredAnnotations, hiddenLabels]) => {
        const visibleAnnotations: Annotation[] = [];
        for (const [label, annotations] of Object.entries(
            filteredAnnotations.labels,
        )) {
            if (!hiddenLabels.has(label)) {
                visibleAnnotations.push(...annotations);
            }
        }
        return visibleAnnotations.sort(
            (a, b) => a.range.from.line - b.range.from.line,
        );
    },
);

export const filteredHiddenLabels = derived(
    [hiddenLabels, filteredBySearchAndCategory],
    ([hiddenLabels, filteredAnnotations]) => {
        const existingLabels = new Set(Object.keys(filteredAnnotations.labels));
        return new Set([...hiddenLabels].filter((l) => existingLabels.has(l)));
    },
);
export const filteredHiddenCategories = derived(
    [hiddenCategories, filteredBySearch],
    ([hiddenCategories, filteredAnnotations]) => {
        const existing = new Set() as typeof hiddenCategories;
        const annotations = Object.values(filteredAnnotations.labels).flat();
        if (annotations.find((c) => !c.isHighlight)) existing.add('comment');
        if (annotations.find((c) => c.isHighlight)) existing.add('highlight');
        return new Set([...hiddenCategories].filter((l) => existing.has(l)));
    },
);
