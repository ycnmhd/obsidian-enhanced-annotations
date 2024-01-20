import { Editor } from 'obsidian';
import { CommentFormat } from '../../settings/settings-type';
import { AnnotationType } from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { wrapText } from './wrap-text';
import { cursorPosition } from './cursor-position';

export const wrapSelectedTextInAnAnnotation = ({
    selection,
    format,
    type,
    label = '',
    doc,
}: {
    doc: Editor;
    selection: string;
    format: CommentFormat;
    type?: AnnotationType;
    label?: string;
}) => {
    if (type)
        selection = wrapText({
            type,
            format: format,
            text: selection,
            label,
        });
    const cursor = doc.getCursor();
    doc.replaceSelection(selection);
    doc.setCursor({
        line: cursor.line,
        ch: cursor.ch + cursorPosition(selection, format, type),
    });
};
