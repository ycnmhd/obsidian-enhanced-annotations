import CommentLabels from '../main';
import { Menu, TAbstractFile } from 'obsidian';
import { l } from '../lang/lang';
import { copyCommentsToClipboard } from './helpers/copy-comments-to-clipboard';

export const fileMenuItems =
    (plugin: CommentLabels) =>
    async (menu: Menu, abstractFiles: TAbstractFile | TAbstractFile[]) => {
        menu.addItem((m) => {
            m.setTitle(l.OUTLINE_COPY_COMMENTS_TO_CLIPBOARD);
            m.setIcon('clipboard-copy');
            m.onClick(() => {
                copyCommentsToClipboard(abstractFiles, plugin);
            });
        });
    };
