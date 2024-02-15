import EnhancedAnnotations from '../main';
import { l } from '../lang/lang';
import { slugify } from './helpers/slugify';
import { insertNewLine } from './helpers/insert-new-line';
import { insertAnnotation } from './helpers/insert-annotation';
import { Command } from 'obsidian';

export const addInsertCommentCommands = (plugin: EnhancedAnnotations) => {
    const commands: Array<Omit<Command, 'id'>> = [
        {
            name: l.ENABLE_DECORATION,
            editorCallback: () => {
                plugin.decorationSettings.enabled = true;
            },
        },
        {
            name: l.DISABLE_DECORATION,
            editorCallback: () => {
                plugin.decorationSettings.enabled = false;
            },
        },
        {
            name: l.COMMANDS_JUMP_TO_NEW_LINE,
            hotkeys: [{ key: 'F5', modifiers: [] }],
            editorCallback: async (editor) => {
                const doc = editor.getDoc();
                insertNewLine({ doc });
            },
        },
        {
            name: l.COMMANDS_INSERT_COMMENT,
            hotkeys: [{ key: 'F7', modifiers: [] }],
            editorCallback: async (editor) => {
                insertAnnotation({ editor, plugin, type: 'comment' });
            },
        },

        {
            name: l.COMMANDS_INSERT_COMMENT_AFTER_EMPTY_LINE,
            hotkeys: [{ key: 'F7', modifiers: ['Shift'] }],
            editorCallback: async (editor) => {
                insertAnnotation({
                    editor,
                    plugin,
                    type: 'comment',
                    emptyLines: 1,
                });
            },
        },
        {
            name: l.COMMANDS_INSERT_COMMENT_WITH_PREVIOUS_LABEL,

            hotkeys: [{ key: 'F6', modifiers: [] }],
            editorCallback: async (editor) => {
                const label = plugin.editorSuggest.useMostRecentSuggestion();
                insertAnnotation({ editor, plugin, type: 'comment', label });
            },
        },
        {
            name: l.COMMANDS_INSERT_COMMENT_WITH_PREVIOUS_LABEL_AFTER_EMPTY_LINE,
            hotkeys: [{ key: 'F6', modifiers: ['Shift'] }],
            editorCallback: async (editor) => {
                const label = plugin.editorSuggest.useMostRecentSuggestion();
                insertAnnotation({
                    editor,
                    plugin,
                    type: 'comment',
                    label,
                    emptyLines: 1,
                });
            },
        },
        {
            name: l.COMMANDS_INSERT_COMMENT_WITH_SECOND_PREVIOUS_LABEL,
            hotkeys: [{ key: 'F6', modifiers: ['Alt'] }],
            editorCallback: async (editor) => {
                const label =
                    plugin.editorSuggest.useSecondMostRecentSuggestion();
                insertAnnotation({ editor, plugin, type: 'comment', label });
            },
        },
        {
            name: l.COMMANDS_INSERT_COMMENT_WITH_SECOND_PREVIOUS_LABEL_AFTER_EMPTY_LINE,
            hotkeys: [{ key: 'F6', modifiers: ['Shift', 'Alt'] }],
            editorCallback: async (editor) => {
                const label =
                    plugin.editorSuggest.useSecondMostRecentSuggestion();
                insertAnnotation({
                    editor,
                    plugin,
                    type: 'comment',
                    label,
                    emptyLines: 1,
                });
            },
        },
    ];

    for (const { name, hotkeys, editorCallback } of commands) {
        plugin.addCommand({
            id: slugify(name),
            editorCallback,
            name: name,
            hotkeys: plugin.settings.getValue().commands.assignHotkeys
                ? hotkeys
                : undefined,
        });
    }
};
