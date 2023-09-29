import { EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { splitComment } from './split-comment';
import { debounce } from '../helpers/debounce';
import { CommentsStore, commentsStore } from '../components/comments-store';

export type Comment = {
    group: number;
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
                const split = splitComment(originalCommentText);
                if (!split) return;
                const [, text, end] = split;
                const group = end.length - 3;
                comments.push({
                    text,
                    group,
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
            if (!acc[val.group]) {
                acc[val.group] = [];
            }
            acc[val.group].push(val);
            return acc;
        },
        {} as CommentsStore['groups'],
    );
    commentsStore.set({ groups });
};

export const debouncedUpdateOutline = debounce(
    (view) => updateOutline(view),
    2000,
);
