import {
    outlineComments,
    OutlineStore,
} from '../../../comments-outline/components/comments-list/comments-list.store';
import { registerNewLabels } from './register-new-labels';
import { parseMultiLineComments } from '../../../../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';
import { Editor } from 'obsidian';
import CommentLabels from '../../../../main';
import { decorationState } from '../../../../editor-plugin/helpers/decorate-comments/decoration-state';

export const updateOutline = (editor: Editor, plugin: CommentLabels) => {
    const lines = editor.getValue().split('\n');
    const comments = parseMultiLineComments(lines);
    let fileHasLabeledComments = false;
    const labels = comments
        .sort((a, b) => a.label.localeCompare(b.label))
        .reduce(
            (acc, val) => {
                if (val.label) fileHasLabeledComments = true;
                else val.label = '/';
                if (val.text) {
                    if (!acc[val.label]) {
                        acc[val.label] = [];
                    }
                    acc[val.label].push(val);
                }
                return acc;
            },
            {} as OutlineStore['labels'],
        );

    outlineComments.set({ labels });
    registerNewLabels(comments, plugin);
    decorationState.fileHasLabeledComments = fileHasLabeledComments;
};
