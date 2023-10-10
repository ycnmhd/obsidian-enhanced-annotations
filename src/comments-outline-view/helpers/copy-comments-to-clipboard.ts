import { commentsToString } from './comments-to-text';
import { copyTextToClipboard } from '../../helpers/copy-text-to-clipboard';
import { Notice } from 'obsidian';
import { filteredComments } from '../comments-outline/components/comments-list/comments-list.store';
import { l } from '../../lang/lang';
import { ParsedComment } from '../../editor-plugin/helpers/parse-comments';

const state: { comments: ParsedComment[] } = { comments: undefined as any };

filteredComments.subscribe((v) => {
    state.comments = Object.values(v.labels)
        .flat()
        .sort((a, b) => a.position.from - b.position.from);
});
export const copyCommentsToClipboard = (e: MouseEvent) => {
    const text = commentsToString(state.comments, e.shiftKey);
    copyTextToClipboard(text);
    new Notice(l.OUTLINE_NOTICE_COPIED_TO_CLIPBOARD);
};
