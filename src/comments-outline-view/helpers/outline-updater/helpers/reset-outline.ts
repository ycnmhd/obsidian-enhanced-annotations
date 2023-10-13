import { outlineComments } from '../../../comments-outline/components/comments-list/comments-list.store';

export const resetOutline = () => {
    outlineComments.set({ labels: {} });
};
