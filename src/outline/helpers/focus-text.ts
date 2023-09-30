import { Comment } from './update-comments-outline';
import { context } from '../../editor-plugin/editor-plugin';

type Props = {
    position: Comment['position'];
};
export const selectText = ({ position: { from, to, line } }: Props) => {
    const editor = context.currentEditor;
    if (editor) {
        const selection = { from: { line, ch: from }, to: { line, ch: to } };
        editor.setCursor({ line, ch: 0 }); // Move cursor to the beginning of the line
        editor.transaction({
            selection: selection,
        });

        editor.scrollIntoView(selection, true);
    }
};
