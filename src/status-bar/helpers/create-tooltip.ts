import { Annotation } from '../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import { charactersCount } from './characters-count';
import { wordCount } from './word-count';
import { pluralize } from '../../helpers/pluralize';

export const createTooltip = async (
    annotations: Annotation[],
    text: string,
) => {
    const annotationsText = annotations
        .map((c) => (c.label || '') + ' ' + c.text)
        .join();
    const fileTextChars = await charactersCount(text);
    const annotationsTextChars = await charactersCount(annotationsText);

    const words = await wordCount(annotationsText);
    let tooltip = `${pluralize(words, 'word', 'words')} ${pluralize(
        annotationsTextChars,
        'character',
        'characters',
    )}`;
    if (fileTextChars > 0) {
        tooltip += ` (${Math.floor(
            (annotationsTextChars / fileTextChars) * 100,
        )}%)`;
    }
    return tooltip;
};
