import { debounce } from '../../../../helpers/debounce';
import {
    outlineComments,
    OutlineStore,
} from '../../../comments-outline/components/comments-list/comments-list.store';
import { registerNewLabels } from './register-new-labels';
import { parseMultiLineComments } from '../../../../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';
import { Editor } from 'obsidian';

export const updateOutline = (editor: Editor) => {
    const lines = editor.getValue().split('\n');
    const comments = parseMultiLineComments(lines);

    const groups = comments.reduce(
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
    const sorted = Object.keys(groups)
        .sort()
        .reduce(
            (acc, key) => {
                if (groups[key].length > 0) {
                    acc[key] = groups[key];
                }
                return acc;
            },
            {} as OutlineStore['labels'],
        );

    outlineComments.set({ labels: sorted });
    registerNewLabels(Object.values(sorted).flat());
};

export const debouncedUpdateOutline = debounce(
    (view) => updateOutline(view),
    1000,
);
