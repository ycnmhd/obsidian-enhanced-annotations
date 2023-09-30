import { EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { parseComment } from '../../editor-plugin/helpers/parse-comment';
import { outlineComments, OutlineStore } from '../comments-outline-store';
import { debounce } from '../../helpers/debounce';
import { registerNewLabels } from './register-new-labels';

export type Comment = {
    label: string;
    text: string;
    position: {
        from: number;
        to: number;
        line: number;
    };
};
export const updateOutline = (view: EditorView) => {
    const comments: Comment[] = [];
    syntaxTree(view.state).iterate({
        enter(node) {
            if (node.type.name.startsWith('comment')) {
                const line = view.state.doc.lineAt(node.from);
                const originalCommentText = view.state.sliceDoc(
                    node.from,
                    node.to,
                );
                const split = parseComment(originalCommentText);
                if (!split) return;
                const [, group, text] = split;
                if (text.trim())
                    comments.push({
                        text,
                        label: group,
                        position: {
                            from: node.from - line.from,
                            to: node.to - line.from,
                            line: line.number - 1,
                        },
                    });
            }
        },
    });

    const groups = comments.reduce(
        (acc, val) => {
            if (!acc[val.label]) {
                acc[val.label] = [];
            }
            acc[val.label].push(val);
            return acc;
        },
        { '/': [] } as OutlineStore['labels'],
    );
    registerNewLabels(comments);
    outlineComments.set({ labels: groups });
};

export const debouncedUpdateOutline = debounce(
    (view) => updateOutline(view),
    2000,
);
