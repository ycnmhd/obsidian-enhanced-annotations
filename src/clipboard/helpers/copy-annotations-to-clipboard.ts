import { Notice, TAbstractFile } from 'obsidian';
import LabeledAnnotations from '../../main';
import { parseAnnotationsFromFiles } from './parse-annotations-from-files';
import { pluralize } from '../../helpers/pluralize';
import { clipboard } from 'electron';
import { concatenateAnnotations } from './concatenate-annotations';

export const copyAnnotationsToClipboard = async (
    abstractFiles: TAbstractFile | TAbstractFile[],
    plugin: LabeledAnnotations,
) => {
    const content = await parseAnnotationsFromFiles(
        Array.isArray(abstractFiles) ? abstractFiles : [abstractFiles],
        plugin,
    );
    const nOfFiles = Object.keys(content).length;
    const nOfAnnotations = Object.values(content).flat().length;
    if (nOfAnnotations) {
        new Notice(
            `Copied ${pluralize(
                nOfAnnotations,
                'annotation',
                'annotations',
            )} from ${pluralize(nOfFiles, 'file', 'files')} to clipboard`,
        );
        clipboard.writeText(concatenateAnnotations(content));
    } else {
        new Notice(`No annotations found`);
    }
};
