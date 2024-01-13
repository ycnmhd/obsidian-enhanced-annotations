import LabeledAnnotations from '../../main';
import { parseAnnotations } from '../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { AnnotationType } from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { wrapSelectedTextInAnAnnotation } from './wrap-selected-text-in-an-annotation';
import { insertNewAnnotationNextLine } from './insert-new-annotation-next-line';
import { insertAnnotationInCurrentLine } from './insert-annotation-in-current-line';

type Props = {
    plugin: LabeledAnnotations;
    label?: string;
    spaceAbove?: number;
    type?: AnnotationType;
};
export const insertAnnotation = ({
    plugin,
    spaceAbove,
    label = '',
    type,
}: Props) => {
    const editor = plugin.app.workspace.activeEditor?.editor;
    if (!editor) return;
    const format = plugin.settings.getValue().editorSuggest.commentFormat;
    const doc = editor.getDoc();
    const cursor = doc.getCursor();
    const selection = doc.getSelection();
    if (selection) {
        wrapSelectedTextInAnAnnotation({
            type,
            format,
            label,
            doc,
            selection,
        });
    } else {
        if (spaceAbove) {
            insertNewAnnotationNextLine({
                type,
                format,
                label,
                doc,
                spaceAbove,
            });
        } else {
            const line = doc.getLine(cursor.line).trim();
            const annotations = parseAnnotations(line, 0, 0, true);
            if (annotations.length) {
                const { label, isHighlight } = annotations[0];
                insertNewAnnotationNextLine({
                    doc,
                    format,
                    label,
                    type: isHighlight ? 'highlight' : 'comment',
                    spaceAbove: 1,
                });
            } else {
                insertAnnotationInCurrentLine({
                    doc,
                    format,
                    label,
                    type,
                });
            }
        }
    }
    if (type && label) plugin.idling.logActivity();
};
