import { Annotation } from '../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';

export const annotationsToText = (
    annotations: Annotation[],
    includeLabel: boolean,
): string => {
    const result = [];

    for (const annotation of annotations) {
        const includedLabel = includeLabel ? `${annotation.label}: ` : '';
        let text = `${includedLabel}${annotation.text.trim()}`;
        if (annotation.isHighlight) text = `_${text}_`;
        result.push(`- ${text}`);
    }

    return result.join('\n');
};
