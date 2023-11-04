import { Annotation } from '../../../../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { EditorRange, EditorRangeOrCaret } from 'obsidian';
import LabeledAnnotations from '../../../../../main';

export const selectText = (
    annotation: Annotation,
    plugin: LabeledAnnotations,
) => {
    const view = plugin.outline.view;
    if (view) {
        const editor = view.editor;
        const selection: EditorRangeOrCaret = {
            from: annotation.range.from,
            to: annotation.range.to,
        };
        editor.setCursor({ line: annotation.range.from.line - 1, ch: 0 }); // Move cursor to the beginning of the line
        editor.transaction({
            selection: selection,
        });

        editor.scrollIntoView(selection as EditorRange, true);
    }
};
