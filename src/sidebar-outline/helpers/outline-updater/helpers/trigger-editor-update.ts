import { Editor } from 'obsidian';
import { EditorView } from '@codemirror/view';
import { Annotation } from '@codemirror/state';
import { debounce } from '../../../../helpers/debounce';

export const outlineAnnotation =
    Annotation.define<string>().of('outline update');

export const triggerEditorUpdate = (editor: Editor) => {
    // todo: find a more conventional way to trigger an update without causing a scroll
    const view = (editor as any).cm.docView.view as EditorView;
    const update = view.state.update({
        scrollIntoView: false,
        changes: [],
        annotations: outlineAnnotation,
    });
    view.dispatch(update);
};

export const debouncedTriggerEditorUpdate = debounce(triggerEditorUpdate, 5000);
