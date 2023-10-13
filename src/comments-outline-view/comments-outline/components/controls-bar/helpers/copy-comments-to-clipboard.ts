import { commentsToString } from './comments-to-text';
import { Notice } from 'obsidian';
import { filteredComments } from '../../comments-list/comments-list.store';
import { l } from '../../../../../lang/lang';
import { ParsedComment } from '../../../../../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';
import { clipboard } from 'electron';

const state: { comments: ParsedComment[] } = { comments: undefined as any };

filteredComments.subscribe((v) => {
    state.comments = Object.values(v.labels)
        .flat()
        .sort((a, b) => a.position.from - b.position.from);
});

export const copyCommentsToClipboard = (e: MouseEvent) => {
    const text = commentsToString(state.comments, e.shiftKey);
    clipboard.writeText(text);
    new Notice(l.OUTLINE_NOTICE_COPIED_TO_CLIPBOARD);
};
