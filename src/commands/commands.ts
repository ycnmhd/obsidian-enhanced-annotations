import LabeledAnnotations from '../main';
import { l } from '../lang/lang';
import { slugify } from './helpers/slugify';
import { insertNewLine } from './helpers/insert-new-line';
import { insertAnnotation } from './helpers/insert-annotation';

export const addInsertCommentCommands = (plugin: LabeledAnnotations) => {
    jumpNextLine(plugin);
    insertComment(plugin);
    insertCommentAfterEmptyLine(plugin);
    insertCommentWithPreviousLabel(plugin);
    insertCommentWithPreviousLabelAfterEmptyLine(plugin);
};

const jumpNextLine = (plugin: LabeledAnnotations) => {
    plugin.addCommand({
        id: slugify(l.COMMANDS_JUMP_TO_NEXT_LINE),
        callback: async () => {
            const editor = plugin.app.workspace.activeEditor?.editor;
            if (!editor) return;
            const doc = editor.getDoc();
            insertNewLine({ doc });
        },
        name: l.COMMANDS_JUMP_TO_NEXT_LINE,
        hotkeys: [{ key: 'F5', modifiers: [] }],
    });
};

const insertComment = (plugin: LabeledAnnotations) => {
    plugin.addCommand({
        id: slugify(l.COMMANDS_INSERT_COMMENT),
        callback: async () => {
            insertAnnotation({ plugin, type: 'comment' });
        },
        name: l.COMMANDS_INSERT_COMMENT,
        hotkeys: [{ key: 'F6', modifiers: [] }],
    });
};

const insertCommentAfterEmptyLine = (plugin: LabeledAnnotations) => {
    plugin.addCommand({
        id: slugify(l.COMMANDS_INSERT_COMMENT_NEXT_LINE),
        callback: async () => {
            insertAnnotation({ plugin, type: 'comment', spaceAbove: 2 });
        },
        name: l.COMMANDS_INSERT_COMMENT_NEXT_LINE,
        hotkeys: [{ key: 'F6', modifiers: ['Shift'] }],
    });
};

const insertCommentWithPreviousLabel = (plugin: LabeledAnnotations) => {
    plugin.addCommand({
        id: slugify(l.COMMANDS_INSERT_COMMENT_WITH_PREVIOUS_LABEL),
        callback: async () => {
            const label = plugin.editorSuggest.mostRecentSuggestion;
            insertAnnotation({ plugin, type: 'comment', label });
        },
        name: l.COMMANDS_INSERT_COMMENT_WITH_PREVIOUS_LABEL,
        hotkeys: [{ key: 'F7', modifiers: [] }],
    });
};

const insertCommentWithPreviousLabelAfterEmptyLine = (
    plugin: LabeledAnnotations,
) => {
    plugin.addCommand({
        id: slugify(l.COMMANDS_INSERT_COMMENT_WITH_PREVIOUS_LABEL_NEXT_LINE),
        callback: async () => {
            const label = plugin.editorSuggest.mostRecentSuggestion;
            insertAnnotation({ plugin, type: 'comment', label, spaceAbove: 2 });
        },
        name: l.COMMANDS_INSERT_COMMENT_WITH_PREVIOUS_LABEL_NEXT_LINE,
        hotkeys: [{ key: 'F7', modifiers: ['Shift'] }],
    });
};
