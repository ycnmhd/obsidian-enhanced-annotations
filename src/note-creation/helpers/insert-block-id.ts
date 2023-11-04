import { Editor, EditorPosition } from 'obsidian';
import { generateBlockId } from './generate-block-id';

const findNextEmptyLine = ({ cursor, editor }: Props) => {
    for (let i = cursor.line + 1; i < editor.lineCount() - 1; i++) {
        const line = editor.getLine(i).trim();
        if (!line) {
            return i - 1;
        }
    }
    return editor.lineCount() - 1;
};

const getExistingBlockId = (line: string) => {
    line = line.trim();
    return /\s+(\^[a-zA-Z0-9]{4,})$/.exec(line)?.[1];
};

type Props = {
    editor: Editor;
    cursor: EditorPosition;
};
export type BlockId = { blockId: string; cursor: EditorPosition };
export const insertBlockId = ({
    cursor,
    editor,
}: Props): undefined | BlockId => {
    const idLineNumber = findNextEmptyLine({ cursor, editor });
    if (idLineNumber > cursor.line) {
        const idLineText = editor.getLine(idLineNumber);
        const existingBlockId = getExistingBlockId(idLineText);
        const blockIdCursor: EditorPosition = {
            line: idLineNumber,
            ch: idLineText.length,
        };
        if (!existingBlockId) {
            const newBlockId = `^${generateBlockId()}`;
            editor.replaceRange(` ${newBlockId}`, blockIdCursor);
            return {
                blockId: newBlockId,
                cursor: blockIdCursor,
            };
        } else {
            return { blockId: existingBlockId, cursor: blockIdCursor };
        }
    }
};
