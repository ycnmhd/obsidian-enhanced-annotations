import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';
import { parseComments } from './parse-comments';
import { plugin } from '../../main';
import { LabelSettings } from '../../settings/settings-type';
import { generateLabelStyleString } from './helpers/generate-label-style-string';

export const decorateComments = (view: EditorView) => {
    const builder = new RangeSetBuilder<Decoration>();
    const labels = plugin.current.settings.getValue().labels;
    const labelsByPattern = Object.values(labels).reduce(
        (acc, val) => {
            acc[val.label] = val;
            return acc;
        },
        {} as Record<string, LabelSettings>,
    );
    for (const { from, to } of view.visibleRanges) {
        const lines = view.state.sliceDoc(from, to).split('\n');
        const line = view.state.doc.lineAt(from);
        const comments = parseComments(lines, line.number, from);
        for (const comment of comments) {
            const labelSettings = labelsByPattern[comment.label];
            if (labelSettings && labelSettings.enableStyle) {
                const textDecoration = Decoration.mark({
                    attributes: {
                        style: generateLabelStyleString(labelSettings.style),
                    },
                });
                builder.add(
                    comment.position.from,
                    comment.position.to,
                    textDecoration,
                );
            }
        }
    }

    return builder.finish();
};
