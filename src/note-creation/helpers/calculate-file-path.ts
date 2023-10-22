import { ParsedComment } from '../../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';
import { sanitizeFileName } from './sanitize-file-name';
import { Settings } from '../../settings/settings-type';

export const calculateFilePath = (
    comment: Pick<ParsedComment, 'label' | 'text'>,
    settings: Settings['notes'],
    currentFolder: string,
) => {
    const sanitizedComment = sanitizeFileName(comment.text);
    const sanitizedLabel = sanitizeFileName(comment.label);

    const folderParts = [];
    const nameParts = [];
    if (settings.defaultFolderMode === 'customFolder') {
        folderParts.push(settings.defaultFolder);
    } else if (settings.defaultFolderMode === 'current folder') {
        folderParts.push(currentFolder);
    } else if (settings.defaultFolderMode === 'current folder/notes') {
        folderParts.push(currentFolder, 'notes');
    }
    if (settings.notesNamingMode === 'label - comment') {
        nameParts.push(`${sanitizedLabel} - ${sanitizedComment}.md`);
    } else if (settings.notesNamingMode === 'label/comment') {
        folderParts.push(sanitizedLabel);
        nameParts.push(`${sanitizedComment}.md`);
    } else {
        nameParts.push(sanitizedComment + '.md');
    }
    const folderPath = folderParts.filter((p) => p && p !== '/').join('/');
    const fileName = nameParts.join('/');
    return {
        filePath: `${folderPath}/${fileName}`,
        folderPath,
        fileBasename: fileName.replace(/\.md$/, ''),
    };
};
