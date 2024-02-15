import { Annotation } from '../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { Editor, EditorPosition, Notice } from 'obsidian';
import { insertBlockId } from './helpers/insert-block-id';
import { getFileName } from './helpers/get-file-name';
import { writeFile } from './helpers/write-file';
import { insertLinkToNote } from './helpers/insert-link-to-note';
import LabeledAnnotations from '../main';
import { applyVariablesToTemplate } from '../clipboard/helpers/apply-variables-to-template';
import { formattedDate, formattedTime, timeTag } from '../helpers/date-utils';

export const noteTemplate = `{{block_link}}`;

export const noteVariables = [
    'block_link',
    'annotation_text',
    'annotation_label',
    'date',
    'time',
    'time_tag',
] as const;
type NoteVariables = (typeof noteVariables)[number];

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

    const variables: Record<NoteVariables, string> = {
        block_link: `![[${currentFileName}#${blockId.blockId}]]`,
        annotation_label: annotation.label,
        annotation_text: annotation.text,
        time_tag: timeTag(),
        date: formattedDate(),
        time: formattedTime(),
    };
    const fileContent = applyVariablesToTemplate({
        template: settings.notes.template,
        variables: variables,
    });

    const { filePath, folderPath, fileBasename } = getFileName(
        annotation,
        settings.notes,
        currentFileFolder,
        currentFileName,
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
