import LabeledAnnotations from '../../main';
import { parseAnnotations } from '../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { AnnotationCategory } from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { CommentType } from '../../settings/settings-type';

const cursorPosition = (
    text: string,
    commentType: CommentType,
    type?: AnnotationCategory,
) => {
    return text.length - (type ? (commentType === 'html' ? 3 : 2) : 0);
};
const wrapText = ({
    text,
    type,
    commentType,
    label,
}: {
    label?: string;
    text: string;
    type?: AnnotationCategory;
    commentType: CommentType;
}) => {
    if (label) label = label + ': ';
    if (type === 'highlight') {
        return `==${label}${text}==`;
    } else if (type) {
        if (commentType === 'html') {
            return `<!--${label}${text}-->`;
        } else return `%%${label}${text}%%`;
    } else return text;
};

type Props = {
    plugin: LabeledAnnotations;
    label?: string;
    newLine?: boolean;
    type?: AnnotationCategory;
};
export const insertAnnotation = async ({
    plugin,
    newLine,
    label = '',
    type,
}: Props) => {
    const editor = plugin.app.workspace.activeEditor?.editor;
    if (!editor) return;
    const commentType = plugin.settings.getValue().editorSuggest.commentType;
    const doc = editor.getDoc();
    const cursor = doc.getCursor();
    const selection = doc.getSelection();
    if (selection) {
        // Wrap the selected text
        let text = selection;
        if (type) text = wrapText({ type, commentType, text, label });
        doc.replaceSelection(text);
        doc.setCursor({
            line: cursor.line,
            ch: cursor.ch + cursorPosition(text, commentType, type),
        });
    } else {
        // Insert an empty annotation at the current cursor position
        const text = wrapText({ text: '', label, type, commentType });
        if (newLine) {
            const lineText = doc.getLine(cursor.line);
            doc.replaceRange('\n' + text, {
                line: cursor.line,
                ch: lineText.length,
            });
            doc.setCursor({
                line: cursor.line + 1,
                ch: cursorPosition(text, commentType, type),
            });
        } else {
            const line = doc.getLine(cursor.line).trim();
            const annotations = parseAnnotations(line);
            if (annotations.length) {
                const { label, isHighlight } = annotations[0];
                await insertAnnotation({
                    plugin,
                    newLine: true,
                    label,
                    type: isHighlight ? 'highlight' : 'comment',
                });
            } else {
                doc.replaceRange(text, cursor);
                doc.setCursor({
                    line: cursor.line,
                    ch: cursor.ch + cursorPosition(text, commentType, type),
                });
            }
        }
    }
    if (type && label) plugin.idling.logActivity();
};
