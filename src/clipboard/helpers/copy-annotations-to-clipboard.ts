import { Notice, TAbstractFile } from 'obsidian';
import LabeledAnnotations from '../../main';
import { parseAnnotationsFromFiles } from './parse-annotations-from-files';
import { pluralize } from '../../helpers/pluralize';
import { annotationsToText } from './annotations-to-text';

export const copyAnnotationsToClipboard = async (
    abstractFiles: TAbstractFile | TAbstractFile[],
    plugin: LabeledAnnotations,
) => {
    const abstractFilesArray = Array.isArray(abstractFiles)
        ? abstractFiles
        : [abstractFiles];
    const root = abstractFilesArray[0].parent?.path as string;

    const unsortedAnnotations = await parseAnnotationsFromFiles(
        abstractFilesArray,
        plugin,
    );
    const sortedAnnotations = unsortedAnnotations.sort((a, b) =>
        a.folder.localeCompare(b.folder),
    );
    const nOfFiles = Object.keys(sortedAnnotations).length;
    const nOfAnnotations = sortedAnnotations
        .map((c) => c.annotations)
        .flat().length;
    if (nOfAnnotations) {
        new Notice(
            `Copied ${pluralize(
                nOfAnnotations,
                'annotation',
                'annotations',
            )} from ${pluralize(nOfFiles, 'file', 'files')} to clipboard`,
        );
        const templates = plugin.settings.getValue().clipboard.templates;
        await navigator.clipboard.writeText(
            annotationsToText(sortedAnnotations, templates, root),
        );
    } else {
        new Notice(`No annotations found`);
    }
};
