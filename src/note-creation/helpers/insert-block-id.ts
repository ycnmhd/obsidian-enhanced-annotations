import { Editor, EditorPosition } from 'obsidian';
import { generateBlockId } from './generate-block-id';

const findNextEmptyLine = ({ cursor, editor }: Props) => {
    for (let i = cursor.line + 1; i < editor.lineCount() - 1; i++) {
        const line = editor.getLine(i);
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
export const insertBlockId = ({ cursor, editor }: Props) => {
    const idLineNumber = findNextEmptyLine({ cursor, editor });
    if (idLineNumber > cursor.line) {
        const idLineText = editor.getLine(idLineNumber);
        const existingBlockId = getExistingBlockId(idLineText);
        if (!existingBlockId) {
            const newCursor: EditorPosition = {
                line: idLineNumber,
                ch: idLineText.length,
            };

            const newBlockId = `^${generateBlockId()}`;
            editor.replaceRange(` ${newBlockId}`, newCursor);
            return newBlockId;
        } else {
            return existingBlockId;
        }
    }
};
