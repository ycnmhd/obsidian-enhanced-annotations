import { Annotation } from '../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { sanitizeFileName } from './sanitize-file-name';
import { Settings } from '../../settings/settings-type';

export const calculateFilePath = (
    annotation: Pick<Annotation, 'label' | 'text'>,
    settings: Settings['notes'],
    currentFolder: string,
) => {
    const sanitizedAnnotation = sanitizeFileName(annotation.text);
    const sanitizedLabel = sanitizeFileName(annotation.label);

    const folderParts = [];
    const nameParts = [];
    if (settings.defaultFolderMode === 'customFolder') {
        folderParts.push(settings.defaultFolder);
    } else if (settings.defaultFolderMode === 'current folder') {
        folderParts.push(currentFolder);
    } else if (settings.defaultFolderMode === 'current folder/notes') {
        folderParts.push(currentFolder, 'notes');
    }
    if (settings.notesNamingMode === 'label - annotation') {
        nameParts.push(`${sanitizedLabel} - ${sanitizedAnnotation}.md`);
    } else if (settings.notesNamingMode === 'label/annotation') {
        folderParts.push(sanitizedLabel);
        nameParts.push(`${sanitizedAnnotation}.md`);
    } else {
        nameParts.push(sanitizedAnnotation + '.md');
    }
    const folderPath = folderParts.filter((p) => p && p !== '/').join('/');
    const fileName = nameParts.join('/');
    return {
        filePath: `${folderPath}/${fileName}`,
        folderPath,
        fileBasename: fileName.replace(/\.md$/, ''),
    };
};
