import { insertComment } from './helpers/insert-comment';
import CommentLabels from '../main';
import { Modifier } from 'obsidian';
import { l } from '../lang/lang';
import { slugify } from './helpers/slugify';

const commands = [
    {
        name: l.COMMANDS_JUMP_TO_NEXT_LINE,
        key: 'F5',
        noComment: true,
        newLine: true,
    },
    {
        name: l.COMMANDS_INSERT_COMMENT,
        key: 'F6',
    },
    {
        name: l.COMMANDS_INSERT_COMMENT_NEXT_LINE,
        key: 'F6',
        modifiers: ['Shift'] as Modifier[],
        newLine: true,
    },
];
export const addInsertCommentCommands = (plugin: CommentLabels) => {
    /*if (plugin.settings.getValue().commands.enableLabelCommands) {
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
	}*/

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
