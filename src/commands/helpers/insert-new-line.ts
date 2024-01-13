import { Editor } from 'obsidian';

export const insertNewLine = ({ doc }: { doc: Editor }) => {
    const cursor = doc.getCursor();
    const lineText = doc.getLine(cursor.line);
    doc.replaceRange('\n', {
        line: cursor.line,
        ch: lineText.length,
    });
    doc.setCursor({
        line: cursor.line + 1,
        ch: 0,
    });
};
