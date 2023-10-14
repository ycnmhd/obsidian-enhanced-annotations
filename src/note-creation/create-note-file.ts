import { ParsedComment } from '../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';
import { Editor, EditorPosition } from 'obsidian';
import { insertBlockId } from './helpers/insert-block-id';
import { calculateFilePath } from './helpers/calculate-file-path';
import { writeFile } from './helpers/write-file';
import { insertLinkToNote } from './helpers/insert-link-to-note';
import CommentLabels from '../main';
import { calculateFileContent } from './calculate-file-content';

type Props = {
    comment: Pick<ParsedComment, 'label' | 'text'>;
    currentFileName: string;
    currentFileFolder: string;
    cursor: EditorPosition;
    editor: Editor;
    plugin: CommentLabels;
};

export const createNoteFile = async ({
    comment,
    currentFileName,
    currentFileFolder,
    cursor,
    editor,
    plugin,
}: Props) => {
    const blockId = insertBlockId({ cursor, editor });
    if (!blockId) return;
    const settings = plugin.settings.getValue();
    const fileContent = calculateFileContent({
        fileName: currentFileName,
        blockId,
        label: comment.label,
        template: settings.notes.template,
    });
    const { filePath, folderPath, fileName } = calculateFilePath(
        comment,
        settings.notes,
        currentFileFolder,
    );

    await writeFile({
        fileContent,
        filePath,
        folderPath,
        plugin,
        openNoteAfterCreation: settings.notes.openNoteAfterCreation,
    });
    if (settings.notes.insertLinkToNote)
        insertLinkToNote({ cursor, editor, fileName });
};
