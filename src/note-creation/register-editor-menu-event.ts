import LabeledAnnotations from '../main';
import { createNoteFile } from './create-note-file';
import { l } from '../lang/lang';
import { parseAnnotations } from '../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';

export const registerEditorMenuEvent = (plugin: LabeledAnnotations) => {
    plugin.registerEvent(
        plugin.app.workspace.on('editor-menu', (menu, editor, view) => {
            const cursor = editor.getCursor();
            const line = editor.getLine(cursor.line);
            const annotation = parseAnnotations(line)[0];
            if (annotation) {
                const onClick = async () => {
                    const currentFileName = view.file?.basename as string;
                    const currentFileFolder = view.file?.parent?.path as string;
                    await createNoteFile({
                        plugin,
                        cursor,
                        editor,
                        currentFileName: currentFileName,
                        currentFileFolder,
                        annotation: {
                            label: annotation.label,
                            text: annotation.text,
                        },
                    });
                };
                menu.addItem((item) => {
                    item.setTitle(
                        annotation.isHighlight
                            ? l.OUTLINE_EDITOR_CREATE_NOTE_FROM_HIGHLIGHT
                            : l.OUTLINE_EDITOR_CREATE_NOTE_FROM_COMMENT,
                    )
                        .setIcon('links-coming-in')
                        .onClick(() => onClick());
                });
            }
        }),
    );
};
