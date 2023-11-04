import LabeledAnnotations from '../../main';
import { Notice } from 'obsidian';
import { l } from '../../lang/lang';

export const writeFile = async ({
    fileContent,
    filePath,
    folderPath,
    openNoteAfterCreation,
    plugin,
}: {
    folderPath: string;
    filePath: string;
    fileContent: string;
    openNoteAfterCreation: boolean;
    plugin: LabeledAnnotations;
}) => {
    try {
        const maybeFolder = plugin.app.vault.getAbstractFileByPath(folderPath);
        if (!maybeFolder) await plugin.app.vault.createFolder(folderPath);
        const file = await plugin.app.vault.create(filePath, fileContent);
        if (openNoteAfterCreation) {
            const leaf = plugin.app.workspace.getLeaf(true);
            await leaf.openFile(file);
        }
    } catch (e) {
        new Notice(l.COMMANDS_COULD_NOT_CREATE_FILE + e.message);
        throw e;
    }
};
