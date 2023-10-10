import { ParsedComment } from '../../editor-plugin/helpers/parse-comments';

export const commentsToString = (
    comments: ParsedComment[],
    includeLabel: boolean,
): string => {
    const result = [];

    for (const comment of comments) {
        const includedLabel = includeLabel ? `${comment.label}: ` : '';
        result.push(`- ${includedLabel}${comment.text.trim()}`);
    }

    return result.join('\n');
};
