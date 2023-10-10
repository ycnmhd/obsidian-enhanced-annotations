import { ParsedComment } from '../editor-plugin/helpers/parse-comments';
import { sanitizeFileName } from './sanitize-file-name';
import { plugin } from '../main';
import { Notice } from 'obsidian';
import { l } from '../lang/lang';

type Props = {
    comment: Pick<ParsedComment, 'label' | 'text'>;
    currentFileName: string;
    blockId: string;
};
export const createNoteFile = async ({
    comment,
    currentFileName,
    blockId,
}: Props) => {
    const sanitizedComment = sanitizeFileName(comment.text);
    const sanitizedLabel = sanitizeFileName(comment.label);
    const fileContent = `![[${currentFileName}#${blockId}]]`;

    const settings = plugin.current.settings.getValue();

    const pathParts = [settings.notes.defaultFolder];
    if (settings.notes.notesNamingMode === 'label - comment') {
        pathParts.push(`${sanitizedLabel} - ${sanitizedComment}.md`);
    } else if (settings.notes.notesNamingMode === 'label/comment') {
        pathParts.push(sanitizedLabel, `${sanitizedComment}.md`);
    } else {
        pathParts.push(sanitizedComment + '.md');
    }
    const filePath = pathParts.join('/');

    const folderPath = filePath
        .split('/')
        .slice(0, pathParts.length - 1)
        .join('/');
    try {
        const maybeFolder =
            plugin.current.app.vault.getAbstractFileByPath(folderPath);
        if (!maybeFolder)
            await plugin.current.app.vault.createFolder(folderPath);
        const file = await plugin.current.app.vault.create(
            filePath,
            fileContent,
        );
        if (settings.notes.openNoteAfterCreation) {
            const leaf = plugin.current.app.workspace.getLeaf(true);
            await leaf.openFile(file);
        }
    } catch (e) {
        new Notice(l.COMMANDS_COULD_NOT_CREATE_FILE + e.message);
    }
};
