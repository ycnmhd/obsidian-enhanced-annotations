import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import { parseComment } from './parse-comment';
import { plugin } from '../../main';
import { Label } from '../../settings/settings-type';

export const decorateComments = (view: EditorView) => {
    const builder = new RangeSetBuilder<Decoration>();
    const groups = plugin.current.settings.getValue().labels;
    const groupsByPattern = Object.values(groups).reduce(
        (acc, val) => {
            acc[val.pattern] = val;
            return acc;
        },
        {} as Record<string, Label>,
    );
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
                    const groupSettings = groupsByPattern[group];
                    if (groupSettings) {
                        const textDecoration = Decoration.mark({
                            attributes: {
                                style: `color: ${groupSettings.color}`,
                            },
                        });
                        builder.add(node.from, node.to, textDecoration);
                    }
                }
            },
        });
    }

    return builder.finish();
};
