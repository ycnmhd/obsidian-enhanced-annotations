import LabeledAnnotations from '../main';
import { l } from '../lang/lang';
import { slugify } from './helpers/slugify';
import { insertNewLine } from './helpers/insert-new-line';
import { insertAnnotation } from './helpers/insert-annotation';
import { Hotkey } from 'obsidian';

export const addInsertCommentCommands = (plugin: LabeledAnnotations) => {
    const commands: Array<{
        name: string;
        hotkeys: Hotkey[];
        callback: () => Promise<void>;
    }> = [
        {
            name: l.COMMANDS_JUMP_NEXT_LINE,
            hotkeys: [{ key: 'F5', modifiers: [] }],
            callback: async () => {
                const editor = plugin.app.workspace.activeEditor?.editor;
                if (!editor) return;
                const doc = editor.getDoc();
                insertNewLine({ doc });
            },
        },
        {
            name: l.COMMANDS_INSERT_COMMENT,
            hotkeys: [{ key: 'F7', modifiers: [] }],
            callback: async () => {
                insertAnnotation({ plugin, type: 'comment' });
            },
        },

        {
            name: l.COMMANDS_INSERT_COMMENT_AFTER_EMPTY_LINE,
            hotkeys: [{ key: 'F7', modifiers: ['Shift'] }],
            callback: async () => {
                insertAnnotation({ plugin, type: 'comment', emptyLines: 1 });
            },
        },
        {
            name: l.COMMANDS_INSERT_COMMENT_WITH_PREVIOUS_LABEL,

            hotkeys: [{ key: 'F6', modifiers: [] }],
            callback: async () => {
                const label = plugin.editorSuggest.mostRecentSuggestion;
                insertAnnotation({ plugin, type: 'comment', label });
            },
        },
        {
            name: l.COMMANDS_INSERT_COMMENT_WITH_PREVIOUS_LABEL_AFTER_EMPTY_LINE,
            hotkeys: [{ key: 'F6', modifiers: ['Shift'] }],
            callback: async () => {
                const label = plugin.editorSuggest.mostRecentSuggestion;
                insertAnnotation({
                    plugin,
                    type: 'comment',
                    label,
                    emptyLines: 1,
                });
            },
        },
    ];

    for (const { name, hotkeys, callback } of commands) {
        plugin.addCommand({
            id: slugify(name),
            callback,
            name: name,
            hotkeys: plugin.settings.getValue().commands.assignHotkeys
                ? hotkeys
                : undefined,
        });
    }
};
