import { insertComment } from './insert-comment';
import CommentLabels from '../main';
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
        name: 'Jump to the next line',
        key: 'F5',
        noComment: true,
        newLine: true,
    },
    {
        name: 'Insert a comment',
        key: 'F6',
    },
    {
        name: 'Insert a comment in a new line',
        key: 'F6',
        modifiers: ['Shift'] as Modifier[],
        newLine: true,
    },
];
export const addInsertCommentCommands = (plugin: CommentLabels) => {
    if (plugin.settings.getValue().commands.enableLabelCommands) {
        const labels = Object.values(plugin.settings.getValue().labels);

        for (const { label } of labels) {
            plugin.addCommand({
                id: 'insert' + label,
                callback: async () => {
                    await insertComment({ plugin, afterStart: `${label}: ` });
                },
                name: `Insert "${label}" comment`,
                hotkeys: [],
            });
        }
    }

    for (const { key, name, modifiers = [], noComment, newLine } of commands) {
        plugin.addCommand({
            id: slugify(name),
            callback: async () => {
                await insertComment({ plugin, noComment, newLine });
            },
            name: name,
            hotkeys: [{ key, modifiers }],
        });
    }
};
