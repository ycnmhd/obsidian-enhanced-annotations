import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, EditorView } from '@codemirror/view';
import { parseMultiLineComments } from './helpers/parse-comments/parse-multi-line-comments';
import { Settings } from '../../../settings/settings-type';
import { generateLabelStyleString } from './helpers/generate-label-style-string';
import { enabledDecoration } from '../../../comments-outline-view/helpers/outline-updater/helpers/update-comments-outline';

let decorations: Record<string, Decoration> = {};
let decorateCommentTags = false;

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
    decorateCommentTags = settings.decoration.decorateCommentTags;
};

const commentTagsDecoration = Decoration.mark({
    attributes: {
        style: 'opacity: 0.4; font-size: 12px',
    },
});

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
                    builder.add(
                        comment.position.from,
                        comment.position.to,
                        decoration,
                    );
                    if (decorateCommentTags) {
                        builder.add(
                            comment.position.from,
                            comment.position.afterFrom,
                            commentTagsDecoration,
                        );
                        builder.add(
                            comment.position.beforeTo,
                            comment.position.to,
                            commentTagsDecoration,
                        );
                    }
                }
            }
        }

    return builder.finish();
};
