import { Editor } from 'obsidian';

export const triggerEditorUpdate = (editor: Editor) => {
    // todo: find a more conventional way to trigger an update
    editor.setLine(0, editor.getLine(0));
};
