import { Editor } from 'obsidian';
import { EditorView } from '@codemirror/view';
import { Annotation } from '@codemirror/state';

export const outlineAnnotation =
    Annotation.define<string>().of('outline update');

type EditorType = Editor & { cm: { docView: { view: EditorView } } };

export const triggerEditorUpdate = (editor: Editor) => {
    // todo: find a more conventional way to trigger an update without causing a scroll
    const view = (editor as EditorType).cm.docView.view as EditorView;
    const update = view.state.update({
        scrollIntoView: false,
        changes: [],
        annotations: outlineAnnotation,
    });
    view.dispatch(update);
};
