import { Annotation } from '../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { Editor, EditorPosition, Notice } from 'obsidian';
import { insertBlockId } from './helpers/insert-block-id';
import { calculateFilePath } from './helpers/calculate-file-path';
import { writeFile } from './helpers/write-file';
import { insertLinkToNote } from './helpers/insert-link-to-note';
import LabeledAnnotations from '../main';
import { calculateFileContent } from './calculate-file-content';

type Props = {
    annotation: Annotation;
    currentFileName: string;
    currentFileFolder: string;
    cursor: EditorPosition;
    editor: Editor;
    plugin: LabeledAnnotations;
};

export const createNoteFile = async ({
    annotation,
    currentFileName,
    currentFileFolder,
    cursor,
    editor,
    plugin,
}: Props) => {
    const blockId = insertBlockId({ cursor, editor, annotation });
    if (!blockId) {
        new Notice('Could not create a block ID');
        return;
    }
    const settings = plugin.settings.getValue();
    const fileContent = calculateFileContent({
        fileName: currentFileName,
        blockId: blockId.blockId,
        label: annotation.label,
        template: settings.notes.template,
    });
    const { filePath, folderPath, fileBasename } = calculateFilePath(
        annotation,
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
        insertLinkToNote({ blockId, editor, fileBasename });
};
