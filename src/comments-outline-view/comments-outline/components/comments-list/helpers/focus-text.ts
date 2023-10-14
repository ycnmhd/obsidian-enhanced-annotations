import { ParsedComment } from '../../../../../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';
import { EditorRange, EditorRangeOrCaret } from 'obsidian';
import CommentLabels from '../../../../../main';

export const selectText = (comment: ParsedComment, plugin: CommentLabels) => {
    const view = plugin.outline.currentView;
    if (view) {
        const editor = view.editor;
        const selection: EditorRangeOrCaret = {
            from: comment.range.from,
            to: comment.range.to,
        };
        editor.setCursor({ line: comment.range.from.line - 1, ch: 0 }); // Move cursor to the beginning of the line
        editor.transaction({
            selection: selection,
        });

        editor.scrollIntoView(selection as EditorRange, true);
    }
};
