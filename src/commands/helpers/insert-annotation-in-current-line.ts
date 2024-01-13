import { Editor } from 'obsidian';
import { CommentFormat } from '../../settings/settings-type';
import { AnnotationType } from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { wrapText } from './wrap-text';
import { cursorPosition } from './cursor-position';

export const insertAnnotationInCurrentLine = ({
    doc,
    format,
    type,
    label,
}: {
    doc: Editor;
    label: string;
    format: CommentFormat;
    type?: AnnotationType;
}) => {
    const text = wrapText({
        text: '',
        label,
        type,
        format: format,
    });
    const cursor = doc.getCursor();
    doc.replaceRange(text, cursor);
    doc.setCursor({
        line: cursor.line,
        ch: cursor.ch + cursorPosition(text, format, type),
    });
};
