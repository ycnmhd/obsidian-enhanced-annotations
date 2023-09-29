import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { parseComment } from '../../helpers/parse-comment';

export const decorateComments = (view: EditorView) => {
    const builder = new RangeSetBuilder<Decoration>();
    for (const { from, to } of view.visibleRanges) {
        syntaxTree(view.state).iterate({
            from,
            to,
            enter(node) {
                if (node.type.name.startsWith('comment')) {
                    const originalCommentText = view.state.sliceDoc(
                        node.from,
                        node.to,
                    );
                    const split = parseComment(originalCommentText);
                    if (!split) return;
                    const [, group] = split;
                    const textDecoration = Decoration.mark({
                        class: 'comment-group-' + group,
                    });
                    builder.add(node.from, node.to, textDecoration);
                }
            },
        });
    }

    return builder.finish();
};
