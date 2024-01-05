import { Editor } from 'obsidian';
import { BlockId } from './insert-block-id';

export const updateLine = (
    line: string,
    fileBasename: string,
    blockId: string,
) => {
    line = line.trim();
    const blockIdIndex = line.lastIndexOf(blockId);
    const lineEndsWithBlockId = blockIdIndex + blockId.length === line.length;
    if (blockIdIndex > 0 && lineEndsWithBlockId) {
        return (
            line.substring(0, blockIdIndex) +
            `[[${fileBasename}|↗]] ${blockId}`
        );
    }

    return line;
};

export const insertLinkToNote = ({
    fileBasename,
    blockId,
    editor,
}: {
    fileBasename: string;
    blockId: BlockId;
    editor: Editor;
}) => {
    let lineText = editor.getLine(blockId.cursor.line);
    lineText = updateLine(lineText, fileBasename, blockId.blockId);
    editor.setLine(blockId.cursor.line, lineText);
};
