import { plugin } from '../../main';
import { Notice } from 'obsidian';
import { l } from '../../lang/lang';

export const writeFile = async ({
    fileContent,
    filePath,
    folderPath,
    openNoteAfterCreation,
}: {
    folderPath: string;
    filePath: string;
    fileContent: string;
    openNoteAfterCreation: boolean;
}) => {
    try {
        const maybeFolder =
            plugin.current.app.vault.getAbstractFileByPath(folderPath);
        if (!maybeFolder)
            await plugin.current.app.vault.createFolder(folderPath);
        const file = await plugin.current.app.vault.create(
            filePath,
            fileContent,
        );
        if (openNoteAfterCreation) {
            const leaf = plugin.current.app.workspace.getLeaf(true);
            await leaf.openFile(file);
        }
    } catch (e) {
        new Notice(l.COMMANDS_COULD_NOT_CREATE_FILE + e.message);
        throw e;
    }
};
