import { writable } from 'svelte/store';

import type { Comment } from '../editor/update-comments-outline';

export type CommentsStore = {
    groups: {
        [name: string | number]: Comment[];
    };
};
export const commentsStore = writable<CommentsStore>({ groups: {} });
