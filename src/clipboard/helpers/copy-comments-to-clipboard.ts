import { Notice, TAbstractFile } from 'obsidian';
import CommentLabels from '../../main';
import { parseAbstractFilesComments } from './parse-abstract-files-comments';
import { pluralize } from '../../helpers/pluralize';
import { clipboard } from 'electron';
import { concatenateComments } from './concatenate-comments';

export const copyCommentsToClipboard = async (
    abstractFiles: TAbstractFile | TAbstractFile[],
    plugin: CommentLabels,
) => {
    const content = await parseAbstractFilesComments(
        Array.isArray(abstractFiles) ? abstractFiles : [abstractFiles],
        plugin,
    );
    const nOfFiles = Object.keys(content).length;
    const nOfComments = Object.values(content).flat().length;
    if (nOfComments) {
        new Notice(
            `Copied ${pluralize(
                nOfComments,
                'comment',
                'comments',
            )} from ${pluralize(nOfFiles, 'file', 'files')} to clipboard`,
        );
        clipboard.writeText(concatenateComments(content));
    } else {
        new Notice(`No comments found`);
    }
};
