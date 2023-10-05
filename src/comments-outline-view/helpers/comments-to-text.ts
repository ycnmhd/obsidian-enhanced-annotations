import { Comment } from './update-comments-outline';

export const commentsToString = (
    comments: Comment[],
    includeLabel: boolean,
): string => {
    const result = [];

    for (const comment of comments) {
        const includedLabel = includeLabel ? `${comment.label}: ` : '';
        result.push(`- ${includedLabel}${comment.text.trim()}`);
    }

    return result.join('\n');
};
