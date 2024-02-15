import { Annotation } from '../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { sanitizeFileName } from './sanitize-file-name';
import { Settings } from '../../settings/settings-type';
import { truncateString } from '../../helpers/string-utils';

export const getFileName = (
    annotation: Pick<Annotation, 'label' | 'text'>,
    settings: Settings['notes'],
    currentFolder: string,
    currentFileName: string,
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
    } else if (
        settings.defaultFolderMode === 'current folder/notes/<file-name>'
    ) {
        folderParts.push(currentFolder, 'notes', currentFileName);
    }
    if (settings.notesNamingMode === 'annotation-label - annotation-text') {
        nameParts.push(`${sanitizedLabel} - ${sanitizedAnnotation}`);
    } else if (
        settings.notesNamingMode === 'annotation-label/annotation-text'
    ) {
        folderParts.push(sanitizedLabel);
        nameParts.push(`${sanitizedAnnotation}`);
    } else {
        nameParts.push(sanitizedAnnotation);
    }
    const folderPath = folderParts.filter((p) => p && p !== '/').join('/');
    const fileBasename = truncateString(
        nameParts.join('/'),
        settings.truncateFileName ? 100 : 250,
    );
    return {
        filePath: `${folderPath}/${fileBasename}.md`,
        folderPath,
        fileBasename,
    };
};
