import { TAbstractFile, TFile, TFolder } from 'obsidian';
import LabeledAnnotations from '../../main';
import {
    Annotation,
    parseAnnotations,
} from '../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';

export type ParsedAnnotations = {
    path: string;
    name: string;
    annotations: Pick<Annotation, 'label' | 'text' | 'isHighlight'>[];
};
export const parseAnnotationsFromFiles = async (
    abstractFiles: TAbstractFile[],
    plugin: LabeledAnnotations,
    content: Array<ParsedAnnotations> = [],
) => {
    for (const abstractFile of abstractFiles) {
        if (abstractFile instanceof TFile) {
            const annotations = parseAnnotations(
                await plugin.app.vault.read(abstractFile),
            );
            if (annotations.length)
                content.push({
                    annotations,
                    name: abstractFile.basename,
                    path: abstractFile.parent?.path as string,
                });
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
