import { Comment } from './update-comments-outline';
import { plugin } from '../../main';

export const registerNewLabels = (comments: Comment[]) => {
    const settings = plugin.current.settings.getValue();
    if (!settings.parsing.autoRegisterLabels) return;
    const groups = new Set(comments.map((c) => c.group));
    const existingGroups = new Set(
        Object.values(settings.groups).map((g) => g.pattern),
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
