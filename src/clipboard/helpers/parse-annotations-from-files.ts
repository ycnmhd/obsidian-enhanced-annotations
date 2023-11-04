import { TAbstractFile, TFile, TFolder } from 'obsidian';
import LabeledAnnotations from '../../main';
import {
    Annotation,
    parseAnnotations,
} from '../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';

export const parseAnnotationsFromFiles = async (
    abstractFiles: TAbstractFile[],
    plugin: LabeledAnnotations,
    content: Record<string, Annotation[]> = {},
) => {
    for (const abstractFile of abstractFiles) {
        if (abstractFile instanceof TFile) {
            const annotations = parseAnnotations(
                await plugin.app.vault.read(abstractFile),
            );
            if (annotations.length) content[abstractFile.path] = annotations;
        } else if (abstractFile instanceof TFolder) {
            await parseAnnotationsFromFiles(
                abstractFile.children,
                plugin,
                content,
            );
        }
    }
    return content;
};
