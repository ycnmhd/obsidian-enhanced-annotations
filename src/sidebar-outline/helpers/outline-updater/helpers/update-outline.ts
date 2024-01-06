import {
    fileAnnotations,
    OutlineStore,
} from '../../../components/components/annotations-list/annotations-list.store';
import { registerNewLabels } from './register-new-labels';
import { Annotation } from '../../../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';
import LabeledAnnotations from '../../../../main';

export const updateOutline = (
    annotations: Annotation[],
    plugin: LabeledAnnotations,
) => {
    let fileHasLabeledAnnotations = false;
    const labels = annotations
        .sort((a, b) => a.label.localeCompare(b.label))
        .reduce(
            (acc, val) => {
                if (val.label) fileHasLabeledAnnotations = true;
                else val.label = '/';
                if (val.text) {
                    if (!acc[val.label]) {
                        acc[val.label] = [];
                    }
                    acc[val.label].push(val);
                }
                return acc;
            },
            {} as OutlineStore['labels'],
        );

    if (fileHasLabeledAnnotations) {
        plugin.idling.logActivity();
    }
    fileAnnotations.set({ labels });
    registerNewLabels(annotations, plugin);
};
