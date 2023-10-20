import CommentLabels from '../../../../main';
import { ParsedComment } from '../../../../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';

export const registerNewLabels = (
    comments: ParsedComment[],
    plugin: CommentLabels,
) => {
    const settings = plugin.settings.getValue();
    if (!settings.decoration.autoRegisterLabels) return;
    const groups = new Set(comments.map((c) => c.label));
    const existingGroups = new Set(
        Object.values(settings.decoration.styles.labels).map((g) => g.label),
    );
    const newGroups = [...groups].filter((group) => !existingGroups.has(group));
    for (const group of newGroups) {
        plugin.settings.dispatch({
            type: 'NEW_GROUP',
            payload: {
                pattern: group,
            },
        });
    }
};
