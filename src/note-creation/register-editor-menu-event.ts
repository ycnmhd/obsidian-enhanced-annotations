import CommentLabels from '../main';
import { createNoteFile } from './create-note-file';
import { l } from '../lang/lang';
import { parseMultiLineComments } from '../editor-plugin/helpers/decorate-comments/helpers/parse-comments/parse-multi-line-comments';

export const registerEditorMenuEvent = (plugin: CommentLabels) => {
    plugin.registerEvent(
        plugin.app.workspace.on('editor-menu', (menu, editor, view) => {
            const cursor = editor.getCursor();
            const line = editor.getLine(cursor.line);
            const comment = parseMultiLineComments([line])[0];
            if (comment) {
                const onClick = async () => {
                    const currentFileName = view.file?.basename as string;
                    const currentFileFolder = view.file?.parent?.path as string;
                    await createNoteFile({
                        cursor,
                        editor,
                        currentFileName: currentFileName,
                        currentFileFolder,
                        comment: {
                            label: comment.label,
                            text: comment.text,
                        },
                    });
                };
                menu.addItem((item) => {
                    item.setTitle(l.OUTLINE_EDITOR_CREATE_NOTE)
                        .setIcon('links-coming-in')
                        .onClick(() => onClick());
                });
            }
        }),
    );
};
