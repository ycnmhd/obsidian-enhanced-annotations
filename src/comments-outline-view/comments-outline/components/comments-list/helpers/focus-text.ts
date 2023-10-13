import { ParsedComment } from '../../../../../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';
import { EditorRange, EditorRangeOrCaret } from 'obsidian';
import { plugin } from '../../../../../main';

type Props = {
    comment: ParsedComment;
};
export const selectText = ({ comment: { range } }: Props) => {
    const view = plugin.current.outline.currentView;
    if (view) {
        const editor = view.editor;
        const selection: EditorRangeOrCaret = {
            from: range.from,
            to: range.to,
        };
        editor.setCursor({ line: range.from.line - 1, ch: 0 }); // Move cursor to the beginning of the line
        editor.transaction({
            selection: selection,
        });

        editor.scrollIntoView(selection as EditorRange, true);
    }
};
