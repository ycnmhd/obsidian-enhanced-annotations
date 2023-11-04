import { Annotation } from '../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { annotationsToText } from './annotations-to-text';

export const concatenateAnnotations = (
    annotations: Record<string, Annotation[]>,
) => {
    const keys = Object.keys(annotations).sort();
    const concatenated: string[] = [];
    for (const key of keys) {
        const fileAnnotations = annotations[key].filter((c) => c.text);
        if (fileAnnotations.length) {
            concatenated.push(
                `# ${key.replace(/\.md$/, '')}`,
                annotationsToText(fileAnnotations, false),
                '',
            );
        }
    }
    return concatenated.join('\n');
};
