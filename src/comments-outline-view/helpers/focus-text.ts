import { context } from '../../editor-plugin/editor-plugin';
import { ParsedComment } from '../../editor-plugin/helpers/parse-comments';
import { EditorRange, EditorRangeOrCaret } from 'obsidian';

type Props = {
    comment: ParsedComment;
};
export const selectText = ({ comment: { range } }: Props) => {
    const editor = context.currentEditor;
    if (editor) {
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
