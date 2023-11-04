import { annotationsToText } from '../../../../../clipboard/helpers/annotations-to-text';
import { Notice } from 'obsidian';
import { filteredBySearchAndCategory } from '../../annotations-list/annotations-list.store';
import { l } from '../../../../../lang/lang';
import { Annotation } from '../../../../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { clipboard } from 'electron';

const state: { annotations: Annotation[] } = { annotations: undefined as any };

filteredBySearchAndCategory.subscribe((v) => {
    state.annotations = Object.values(v.labels)
        .flat()
        .sort((a, b) => a.position.from - b.position.from);
});

export const copyAnnotationsToClipboard = (e: MouseEvent) => {
    const text = annotationsToText(state.annotations, e.shiftKey);
    clipboard.writeText(text);
    new Notice(l.OUTLINE_NOTICE_COPIED_TO_CLIPBOARD);
};
