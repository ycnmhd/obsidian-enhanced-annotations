import { EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { parseComment } from '../../helpers/parse-comment';
import { CommentsStore, commentsStore } from '../../components/comments-store';
import { debounce } from '../../helpers/debounce';

export type Comment = {
    group: string;
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
        { '/': [] } as CommentsStore['groups'],
    );
    commentsStore.set({ groups });
};

export const debouncedUpdateOutline = debounce(
    (view) => updateOutline(view),
    2000,
);
