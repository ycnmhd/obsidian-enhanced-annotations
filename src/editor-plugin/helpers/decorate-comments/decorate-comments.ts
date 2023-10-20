import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';
import { parseMultiLineComments } from './helpers/parse-comments/parse-multi-line-comments';
import { Settings } from '../../../settings/settings-type';
import { generateLabelStyleString } from './helpers/generate-label-style-string';
import { enabledDecoration } from '../../../comments-outline-view/helpers/outline-updater/helpers/update-comments-outline';

let decorations: Record<string, { comment: Decoration; tag: Decoration }> = {};
let decorateCommentTags: boolean;

export const updateDecorations = (settings: Settings) => {
    const labels = settings.decoration.styles.labels;
    decorations = Object.values(labels).reduce(
        (acc, val) => {
            if (val.enableStyle) {
                acc[val.label] = {
                    comment: Decoration.mark({
                        attributes: {
                            style: generateLabelStyleString(val.style),
                        },
                    }),
                    tag: Decoration.mark({
                        attributes: {
                            style: generateLabelStyleString({
                                ...val.style,
                                ...settings.decoration.styles.tag.style,
                            }),
                        },
                    }),
                };
            }
            return acc;
        },
        {} as Record<string, { comment: Decoration; tag: Decoration }>,
    );
    decorateCommentTags = settings.decoration.styles.tag.enableStyle;
    if (!Object.keys(decorations).length) {
        enabledDecoration.current = true;
    }
};

export const decorateComments = (view: EditorView) => {
    const builder = new RangeSetBuilder<Decoration>();
    if (enabledDecoration.current)
        for (const { from, to } of view.visibleRanges) {
            const lines = view.state.sliceDoc(from, to).split('\n');
            const line = view.state.doc.lineAt(from);
            const comments = parseMultiLineComments(lines, line.number, from);
            for (const comment of comments) {
                const decoration = decorations[comment.label];
                if (decoration) {
                    if (decorateCommentTags) {
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
