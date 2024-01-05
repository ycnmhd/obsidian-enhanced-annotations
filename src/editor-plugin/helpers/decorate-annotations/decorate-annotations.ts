import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';
import { parseAnnotations } from './helpers/parse-annotations/parse-annotations';
import { decorationState } from './decoration-state';

const defaultHighlightDecoration = Decoration.mark({
    class: 'cm-highlight-default',
});

export const decorateAnnotations = (view: EditorView) => {
    const builder = new RangeSetBuilder<Decoration>();

    for (const { from, to } of view.visibleRanges) {
        const line = view.state.doc.lineAt(from);
        const annotations = parseAnnotations(
            view.state.sliceDoc(from, to),
            line.number,
            from,
        );

        for (const annotation of annotations) {
            const decoration = decorationState.decorations[annotation.label];
            if (decoration) {
                if (decorationState.decorateTags && !annotation.isHighlight) {
                    builder.add(
                        annotation.position.from,
                        annotation.position.afterFrom,
                        decoration.tag,
                    );
                    builder.add(
                        annotation.position.afterFrom,
                        annotation.position.beforeTo,
                        decoration.comment,
                    );
                    builder.add(
                        annotation.position.beforeTo,
                        annotation.position.to,
                        decoration.tag,
                    );
                } else {
                    builder.add(
                        annotation.position.from,
                        annotation.position.to,
                        annotation.isHighlight
                            ? decoration.highlight
                            : decoration.comment,
                    );
                }
            } else if (annotation.isHighlight) {
                builder.add(
                    annotation.position.from,
                    annotation.position.to,
                    defaultHighlightDecoration,
                );
            }
        }
    }

    return builder.finish();
};
