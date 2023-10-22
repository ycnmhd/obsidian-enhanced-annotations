import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';
import { parseMultiLineComments } from './helpers/parse-comments/parse-multi-line-comments';
import { decorationState } from './decoration-state';

export const decorateComments = (view: EditorView) => {
    const builder = new RangeSetBuilder<Decoration>();
    if (decorationState.enabled)
        for (const { from, to } of view.visibleRanges) {
            const lines = view.state.sliceDoc(from, to).split('\n');
            const line = view.state.doc.lineAt(from);
            const comments = parseMultiLineComments(lines, line.number, from);
            for (const comment of comments) {
                const decoration = decorationState.decorations[comment.label];
                if (decoration) {
                    if (decorationState.decorateTags) {
                        builder.add(
                            comment.position.from,
                            comment.position.afterFrom,
                            decoration.tag,
                        );
                        builder.add(
                            comment.position.afterFrom,
                            comment.position.beforeTo,
                            decoration.comment,
                        );
                        builder.add(
                            comment.position.beforeTo,
                            comment.position.to,
                            decoration.tag,
                        );
                    } else {
                        builder.add(
                            comment.position.from,
                            comment.position.to,
                            decoration.comment,
                        );
                    }
                }
            }
        }

    return builder.finish();
};
