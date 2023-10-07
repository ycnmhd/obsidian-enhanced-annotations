import { commentsToString } from './comments-to-text';
import { copyTextToClipboard } from '../../helpers/copy-text-to-clipboard';
import { Notice } from 'obsidian';
import { Comment } from './update-comments-outline';
import { filteredComments } from '../comments-outline/components/comments-list/comments-list.store';
import { l } from '../../lang/lang';

const state: { comments: Comment[] } = { comments: undefined as any };

filteredComments.subscribe((v) => {
    state.comments = Object.values(v.labels).flat();
});
export const copyCommentsToClipboard = (e: MouseEvent) => {
    const text = commentsToString(state.comments, e.shiftKey);
    copyTextToClipboard(text);
    new Notice(l.OUTLINE_NOTICE_COPIED_TO_CLIPBOARD);
};
