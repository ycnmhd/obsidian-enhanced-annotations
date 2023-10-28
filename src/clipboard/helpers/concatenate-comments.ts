import { ParsedComment } from '../../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';

export const concatenateComments = (
    comments: Record<string, ParsedComment[]>,
) => {
    const keys = Object.keys(comments).sort();
    const concatenated: string[] = [];
    for (const key of keys) {
        const fileComments = comments[key].filter((c) => c.text);
        if (fileComments.length) {
            concatenated.push(
                `# ${key.replace(/\.md$/, '')}`,
                ...fileComments.map((c) => `- ${c.text}`),
                '',
            );
        }
    }
    return concatenated.join('\n');
};
