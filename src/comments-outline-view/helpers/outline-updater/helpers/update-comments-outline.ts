import {
    outlineComments,
    OutlineStore,
} from '../../../comments-outline/components/comments-list/comments-list.store';
import { registerNewLabels } from './register-new-labels';
import { parseMultiLineComments } from '../../../../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';
import { Editor } from 'obsidian';
import { triggerEditorUpdate } from './trigger-editor-update';
import CommentLabels from '../../../../main';

export const enabledDecoration = {
    current: false,
};
export const updateOutline = (editor: Editor, plugin: CommentLabels) => {
    const lines = editor.getValue().split('\n');
    const comments = parseMultiLineComments(lines);
    const labels = comments
        .sort((a, b) => a.label.localeCompare(b.label))
        .reduce(
            (acc, val) => {
                if (!val.label) val.label = '/';
                if (!acc[val.label]) {
                    acc[val.label] = [];
                }
                acc[val.label].push(val);
                return acc;
            },
            { '/': [] } as OutlineStore['labels'],
        );

    outlineComments.set({ labels });
    registerNewLabels(comments, plugin);
    const labeledComment = !!comments.find((c) => c.label);
    const wasDisabled = !enabledDecoration.current;
    enabledDecoration.current = labeledComment;
    if (labeledComment && wasDisabled) {
        triggerEditorUpdate(editor);
    }
};
