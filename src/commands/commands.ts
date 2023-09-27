import { insertComment } from './insert-comment';
import CommentGroups from '../main';
import { Modifier } from 'obsidian';

const slugify = (inputString: string) => {
    return inputString
        .toLowerCase() // Convert to lowercase
        .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric characters with hyphens
        .replace(/-+/g, '-') // Replace consecutive hyphens with a single hyphen
        .replace(/^-|-$/g, ''); // Remove leading and trailing hyphens
};

const commands = [
    {
        name: 'Insert group 1 comment',
        key: 'F5',
        beforeEnd: '',
    },
    {
        name: 'Insert group 2 comment',
        key: 'F6',
        beforeEnd: '-',
    },
    {
        name: 'Insert group 3 comment',
        key: 'F7',
        beforeEnd: '--',
    },
    {
        name: 'Insert group 4 comment',
        key: 'F8',
        beforeEnd: '---',
    },
    {
        name: 'Insert group 1 comment below',
        key: 'F5',
        beforeEnd: '',
        modifiers: ['Shift'],
    },
    {
        name: 'Insert group 2 comment below',
        key: 'F6',
        beforeEnd: '-',
        modifiers: ['Shift'],
    },
    {
        name: 'Insert group 3 comment below',
        key: 'F7',
        beforeEnd: '--',
        modifiers: ['Shift'],
    },
    {
        name: 'Insert group 4 comment below',
        key: 'F8',
        beforeEnd: '---',
        modifiers: ['Shift'],
    },
];
export const addInsertCommentCommands = (plugin: CommentGroups) => {
    for (const { beforeEnd, name, key, modifiers = [] } of commands) {
        plugin.addCommand({
            id: slugify(name),
            callback: async () => {
                await insertComment(
                    plugin,
                    beforeEnd,
                    beforeEnd,
                    modifiers[0] === 'Shift',
                );
            },
            name,
            hotkeys: [
                {
                    key,
                    modifiers: modifiers as Modifier[],
                },
            ],
        });
    }
};
