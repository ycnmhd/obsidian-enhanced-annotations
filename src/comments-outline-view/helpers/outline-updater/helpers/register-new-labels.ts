import { plugin } from '../../../../main';
import { ParsedComment } from '../../../../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';

export const registerNewLabels = (comments: ParsedComment[]) => {
    const settings = plugin.current.settings.getValue();
    if (!settings.parsing.autoRegisterLabels) return;
    const groups = new Set(comments.map((c) => c.label));
    const existingGroups = new Set(
        Object.values(settings.labels).map((g) => g.label),
    );
    const newGroups = [...groups].filter((group) => !existingGroups.has(group));
    for (const group of newGroups) {
        plugin.current.settings.dispatch({
            type: 'NEW_GROUP',
            payload: {
                pattern: group,
            },
        });
    }
};
