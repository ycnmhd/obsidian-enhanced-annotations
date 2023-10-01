import { commentsToString } from './comments-to-text';
import { copyTextToClipboard } from '../../helpers/copy-text-to-clipboard';
import { Notice } from 'obsidian';
import { visibleComments } from '../comments-outline-store';
import { Comment } from './update-comments-outline';

const comments: { current: Comment[] } = { current: undefined as any };

visibleComments.subscribe((v) => {
    comments.current = v;
});
export const copyCommentsToClipboard = (e: MouseEvent) => {
    const text = commentsToString(comments.current, e.shiftKey);
    copyTextToClipboard(text);
    new Notice('Copied to clipboard');
};
