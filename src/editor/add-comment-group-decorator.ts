import { Decoration, EditorView } from '@codemirror/view';
import { SyntaxNodeRef } from '@lezer/common';
import { RangeSetBuilder } from '@codemirror/state';

export const addCommentGroupDecorator = ({
    node,
    view,
    builder,
}: {
    node: SyntaxNodeRef;
    view: EditorView;
    builder: RangeSetBuilder<Decoration>;
}) => {
    let commentText = view.state.sliceDoc(node.from, node.to);
    const emptyComment = /^<!(-{4,})>$/g.exec(commentText);
    if (emptyComment) {
        const hyphens = emptyComment[1];
        commentText = hyphens.substring(hyphens.length / 2) + '>';
    }
    const closingEnd = /(-+)>$/g.exec(commentText);
    if (closingEnd && closingEnd[1]) {
        const hyphens = closingEnd[1];
        const group = hyphens.length - 2;
        if (!isNaN(group)) {
            const decoration = Decoration.mark({
                class: 'comment-group-' + group,
            });
            builder.add(node.from, node.to, decoration);
        }
    }
};
