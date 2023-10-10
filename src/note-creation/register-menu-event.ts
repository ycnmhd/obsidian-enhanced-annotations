import CommentLabels from '../main';
import { insertBlockId } from './insert-block-id';
import { createNoteFile } from './create-note-file';
import { l } from '../lang/lang';
import { parseComments } from '../editor-plugin/helpers/parse-comments';

export const registerMenuEvent = (plugin: CommentLabels) => {
    plugin.registerEvent(
        plugin.app.workspace.on('editor-menu', (menu, editor, view) => {
            const cursor = editor.getCursor();
            const line = editor.getLine(cursor.line);
            const comment = parseComments([line])[0];
            if (comment) {
                const onClick = async () => {
                    const blockId = insertBlockId({ cursor, editor });
                    if (blockId) {
                        const currentFileName = view.file?.basename as string;
                        await createNoteFile({
                            blockId,
                            currentFileName: currentFileName,
                            comment: {
                                label: comment.label,
                                text: comment.text,
                            },
                        });
                    }
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
