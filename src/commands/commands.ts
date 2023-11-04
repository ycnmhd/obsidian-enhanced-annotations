import { insertAnnotation } from './helpers/insert-annotation';
import LabeledAnnotations from '../main';
import { Modifier } from 'obsidian';
import { l } from '../lang/lang';
import { slugify } from './helpers/slugify';
import { AnnotationCategory } from '../sidebar-outline/components/components/annotations-list/annotations-list.store';

const commands = [
    {
        name: l.COMMANDS_JUMP_TO_NEXT_LINE,
        key: 'F5',
        newLine: true,
    },
    {
        name: l.COMMANDS_INSERT_COMMENT,
        key: 'F6',
        type: 'comment' as AnnotationCategory,
    },
    {
        name: l.COMMANDS_INSERT_COMMENT_NEXT_LINE,
        key: 'F6',
        modifiers: ['Shift'] as Modifier[],
        type: 'comment' as AnnotationCategory,
        newLine: true,
    },
];
export const addInsertCommentCommands = (plugin: LabeledAnnotations) => {
    for (const { key, name, modifiers = [], type, newLine } of commands) {
        plugin.addCommand({
            id: slugify(name),
            callback: async () => {
                await insertAnnotation({ plugin, type, newLine });
            },
            name: name,
            hotkeys: [{ key, modifiers }],
        });
    }
};
