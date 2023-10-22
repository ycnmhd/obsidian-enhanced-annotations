import { Editor } from 'obsidian';
import { BlockId } from './insert-block-id';

export const insertLinkToNote = ({
    fileBasename,
    blockId,
    editor,
}: {
    fileBasename: string;
    blockId: BlockId;
    editor: Editor;
}) => {
    const lineText = editor.getLine(blockId.cursor.line);
    if (!lineText.includes('|↗]]'))
        editor.replaceRange(` [[${fileBasename}|↗]] `, {
            line: blockId.cursor.line,
            ch: lineText.length - blockId.blockId.length,
        });
};
