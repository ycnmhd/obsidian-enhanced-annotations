import { fileAnnotations } from '../../../components/components/annotations-list/annotations-list.store';

export const resetOutline = () => {
    fileAnnotations.set({ labels: {} });
};
