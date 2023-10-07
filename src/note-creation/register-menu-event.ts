import CommentLabels from '../main';
import { parseComment } from '../editor-plugin/helpers/parse-comment';
import { insertBlockId } from './insert-block-id';
import { createNoteFile } from './create-note-file';
import { l } from '../lang/lang';

export const registerMenuEvent = (plugin: CommentLabels) => {
    plugin.registerEvent(
        plugin.app.workspace.on('editor-menu', (menu, editor, view) => {
            const cursor = editor.getCursor();
            const line = editor.getLine(cursor.line);
            const comment = parseComment(line);
            if (comment) {
                const onClick = async () => {
                    const blockId = insertBlockId({ cursor, editor });
                    if (blockId) {
                        const currentFileName = view.file?.name as string;
                        await createNoteFile({
                            blockId,
                            currentFileName: currentFileName,
                            comment: {
                                label: comment[1],
                                text: comment[2],
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
