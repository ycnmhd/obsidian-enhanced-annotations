import { Editor } from 'obsidian';
import { CommentFormat } from '../../settings/settings-type';
import { AnnotationType } from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { wrapText } from './wrap-text';
import { cursorPosition } from './cursor-position';

export const insertNewAnnotationNextLine = ({
    doc,
    format,
    type,
    label,
    spaceAbove,
}: {
    doc: Editor;
    label: string;
    format: CommentFormat;
    type?: AnnotationType;
    spaceAbove: number;
}) => {
    const text = wrapText({
        text: '',
        label,
        type,
        format: format,
    });
    const cursor = doc.getCursor();
    const lineText = doc.getLine(cursor.line);
    doc.replaceRange(''.padStart(spaceAbove, '\n') + text, {
        line: cursor.line,
        ch: lineText.length,
    });
    doc.setCursor({
        line: cursor.line + 1,
        ch: cursorPosition(text, format, type) + spaceAbove - 1,
    });
};
