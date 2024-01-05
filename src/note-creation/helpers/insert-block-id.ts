import { Editor, EditorPosition } from 'obsidian';
import { generateBlockId } from './generate-block-id';
import {
    Annotation,
    parseAnnotations,
} from '../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';

const findNextEmptyLine = ({
    cursor,
    editor,
}: {
    editor: Editor;
    cursor: EditorPosition;
}) => {
    for (let i = cursor.line + 1; i < editor.lineCount() - 1; i++) {
        const line = editor.getLine(i).trim();

        if (!line || parseAnnotations(line).length) {
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
    annotation: Annotation;
};
export type BlockId = { blockId: string; cursor: EditorPosition };
export const insertBlockId = ({
    cursor,
    editor,
    annotation,
}: Props): undefined | BlockId => {
    const idLineNumber = annotation.isHighlight
        ? cursor.line
        : findNextEmptyLine({ cursor, editor });
    if (annotation.isHighlight || idLineNumber > cursor.line) {
        const existingLine = editor.getLine(idLineNumber);
        const existingBlockId = getExistingBlockId(existingLine);
        if (existingBlockId) {
            return {
                blockId: existingBlockId,
                cursor: {
                    line: idLineNumber,
                    ch: existingLine.length,
                },
            };
        } else {
            const newBlockId = `^${generateBlockId()}`;
            const newLine = `${existingLine.trim()} ${newBlockId}`;
            editor.setLine(idLineNumber, newLine);
            return {
                blockId: newBlockId,
                cursor: {
                    line: idLineNumber,
                    ch: newLine.length,
                },
            };
        }
    }
};
