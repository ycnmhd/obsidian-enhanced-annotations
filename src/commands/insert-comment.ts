import CommentLabels from '../main';

type Props = {
    plugin: CommentLabels;
    afterStart?: string;
    beforeEnd?: string;
    newLine?: boolean;
    noComment?: boolean;
};
export const insertComment = async ({
    plugin,
    newLine,
    noComment,
    beforeEnd = '',
    afterStart = '',
}: Props) => {
    const editor = plugin.app.workspace.activeEditor?.editor;
    if (editor) {
        const doc = editor.getDoc();
        const cursor = doc.getCursor();
        const selection = doc.getSelection();
        const commentStart = noComment ? '' : '<!--';
        const commentEnd = noComment ? '' : '-->';
        if (selection) {
            // Wrap the selected text in a comment
            const firstPart = `${commentStart}${afterStart}${selection}`;
            const secondPart = `${beforeEnd}${commentEnd}`;
            const text = firstPart + secondPart;
            doc.replaceSelection(text);
            doc.setCursor({
                line: cursor.line,
                ch: cursor.ch + firstPart.length,
            });
        } else {
            // Insert an empty comment at the current cursor position
            const firstPart = `${commentStart}${afterStart}`;
            const secondPart = `${beforeEnd}${commentEnd}`;
            const text = firstPart + secondPart;
            if (newLine) {
                const lineText = doc.getLine(cursor.line);
                doc.replaceRange('\n' + text, {
                    line: cursor.line,
                    ch: lineText.length,
                });
                doc.setCursor({
                    line: cursor.line + 1,
                    ch: firstPart.length,
                });
            } else {
                doc.replaceRange(text, cursor);
                doc.setCursor({
                    line: cursor.line,
                    ch: cursor.ch + firstPart.length,
                });
            }
        }
    }
};
