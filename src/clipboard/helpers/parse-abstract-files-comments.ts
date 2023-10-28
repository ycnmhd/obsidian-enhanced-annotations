import { TAbstractFile, TFile, TFolder } from 'obsidian';
import CommentLabels from '../../main';
import {
    ParsedComment,
    parseMultiLineComments,
} from '../../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';

export const parseAbstractFilesComments = async (
    abstractFiles: TAbstractFile[],
    plugin: CommentLabels,
    content: Record<string, ParsedComment[]> = {},
) => {
    for (const abstractFile of abstractFiles) {
        if (abstractFile instanceof TFile) {
            const comments = parseMultiLineComments(
                await plugin.app.vault.read(abstractFile),
            );
            if (comments.length) content[abstractFile.path] = comments;
        } else if (abstractFile instanceof TFolder) {
            await parseAbstractFilesComments(
                abstractFile.children,
                plugin,
                content,
            );
        }
    }
    return content;
};
