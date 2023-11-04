import LabeledAnnotations from '../../../../main';
import { Annotation } from '../../../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';

export const registerNewLabels = (
    annotations: Annotation[],
    plugin: LabeledAnnotations,
) => {
    const settings = plugin.settings.getValue();
    if (!settings.decoration.autoRegisterLabels) return;
    const groups = new Set(annotations.map((c) => c.label));
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
