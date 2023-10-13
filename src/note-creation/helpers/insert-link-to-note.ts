import { Editor, EditorPosition } from 'obsidian';

export const insertLinkToNote = ({
    fileName,
    cursor,
    editor,
}: {
    fileName: string;
    cursor: EditorPosition;
    editor: Editor;
}) => {
    const lineText = editor.getLine(cursor.line);
    if (!lineText.includes('|↗]]'))
        editor.replaceRange(` [[${fileName}|↗]]`, {
            line: cursor.line,
            ch: lineText.length,
        });
};
