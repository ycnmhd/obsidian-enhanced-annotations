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
    const labels = annotations
        .sort((a, b) => a.label.localeCompare(b.label))
        .reduce(
            (acc, val) => {
                if (val.text) {
                    const label = val.label || '/';
                    if (!acc[label]) {
                        acc[label] = [];
                    }
                    acc[label].push(val);
                }
                return acc;
            },
            {} as OutlineStore['labels'],
        );

    fileAnnotations.set({ labels });
    registerNewLabels(annotations, plugin);
};
