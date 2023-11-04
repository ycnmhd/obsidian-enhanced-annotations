import LabeledAnnotations from '../main';
import { Menu, TAbstractFile } from 'obsidian';
import { l } from '../lang/lang';
import { copyAnnotationsToClipboard } from './helpers/copy-annotations-to-clipboard';

export const fileMenuItems =
    (plugin: LabeledAnnotations) =>
    async (menu: Menu, abstractFiles: TAbstractFile | TAbstractFile[]) => {
        menu.addItem((m) => {
            m.setTitle(l.OUTLINE_COPY_ANNOTATIONS_TO_CLIPBOARD);
            m.setIcon('clipboard-copy');
            m.onClick(() => {
                copyAnnotationsToClipboard(abstractFiles, plugin);
            });
        });
    };
