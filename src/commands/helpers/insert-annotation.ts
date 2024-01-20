import { AnnotationType } from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { wrapText } from './wrap-text';
import { cursorPosition } from './cursor-position';
import { parseAnnotations } from '../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { wrapSelectedTextInAnAnnotation } from './wrap-selected-text-in-an-annotation';
import LabeledAnnotations from '../../main';

export const insertAnnotation = ({
    plugin,
    type,
    label,
    emptyLines = 0,
}: {
    label?: string;
    type?: AnnotationType;
    emptyLines?: number;
    plugin: LabeledAnnotations;
}) => {
    const editor = plugin.app.workspace.activeEditor?.editor;
    if (!editor) return;
    const format = plugin.settings.getValue().editorSuggest.commentFormat;
    const doc = editor.getDoc();
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
        const cursor = doc.getCursor();
        const currentLineText = doc.getLine(cursor.line);
        const currentLineAnnotation = parseAnnotations(
            currentLineText,
            0,
            0,
            true,
        )[0];

        let startingLine = 0;
        if (currentLineText.trim()) {
            startingLine = startingLine + 1;
        }

        const text = wrapText({
            text: '',
            label: label || currentLineAnnotation?.label,
            type:
                type ||
                (currentLineAnnotation
                    ? currentLineAnnotation.isHighlight
                        ? 'highlight'
                        : 'comment'
                    : undefined),
            format: format,
        });
        doc.replaceRange(''.padStart(emptyLines + startingLine, '\n') + text, {
            line: cursor.line,
            ch: currentLineText.length,
        });
        doc.setCursor({
            line: cursor.line + emptyLines + startingLine,
            ch: cursorPosition(text, format, type),
        });
    }
};
