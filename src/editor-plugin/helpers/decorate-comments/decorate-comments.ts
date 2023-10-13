import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';
import { parseMultiLineComments } from './helpers/parse-comments/parse-multi-line-comments';
import { Settings } from '../../../settings/settings-type';
import { generateLabelStyleString } from './helpers/generate-label-style-string';

let decorations: Record<string, Decoration> = {};

export const updateDecorations = (settings: Settings) => {
    const labels = settings.labels;
    decorations = Object.values(labels).reduce(
        (acc, val) => {
            if (val.enableStyle) {
                acc[val.label] = Decoration.mark({
                    attributes: {
                        style: generateLabelStyleString(val.style),
                    },
                });
            }
            return acc;
        },
        {} as Record<string, Decoration>,
    );
};

export const decorateComments = (view: EditorView) => {
    const builder = new RangeSetBuilder<Decoration>();

    for (const { from, to } of view.visibleRanges) {
        const lines = view.state.sliceDoc(from, to).split('\n');
        const line = view.state.doc.lineAt(from);
        const comments = parseMultiLineComments(lines, line.number, from);
        for (const comment of comments) {
            const decoration = decorations[comment.label];
            if (decoration) {
                builder.add(
                    comment.position.from,
                    comment.position.to,
                    decoration,
                );
            }
        }
    }

    return builder.finish();
};
