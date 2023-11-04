import LabeledAnnotations from '../../../../main';
import { Setting } from 'obsidian';
import { FolderSuggest } from './helpers/folder-suggestions';
import { DefaultFolderMode, NotesNamingMode } from '../../../settings-type';
import { l } from '../../../../lang/lang';
import { noteVariables } from '../../../../note-creation/calculate-file-content';

type Props = {
    containerEl: HTMLElement;
    plugin: LabeledAnnotations;
};
const options: Record<DefaultFolderMode, string> = {
    vault: 'Vault folder',
    'current folder': 'Current folder',
    'current folder/notes': 'Current folder / Notes',
    customFolder: 'Folder specified below',
};
export const NoteSettings = ({ containerEl, plugin }: Props) => {
    const render = () => {
        containerEl.empty();
        NoteSettings({
            containerEl,
            plugin,
        });
    };
    containerEl.createEl('h3', { text: l.SETTINGS_NOTE_CREATION_TITLE });

    const settings = plugin.settings;

    const noteSettings = settings.getValue().notes;
    new Setting(containerEl)
        .addDropdown((c) => {
            c.addOptions(options);
            c.onChange((v) => {
                settings.dispatch({
                    type: 'SET_NOTES_FOLDER_MODE',
                    payload: { mode: v as DefaultFolderMode },
                });
                render();
            });
            c.setValue(noteSettings.defaultFolderMode);
        })
        .setName(l.SETTINGS_NOTE_CREATION_FOLDER_MODE);

    if (noteSettings.defaultFolderMode === 'customFolder')
        new Setting(containerEl)
            .setName(l.SETTINGS_NOTE_CREATION_FOLDER)
            .addSearch((cb) => {
                new FolderSuggest(plugin.app, cb.inputEl);
                cb.setPlaceholder(l.SETTINGS_NOTE_CREATION_FOLDER_PLACEHOLDER)
                    .setValue(noteSettings.defaultFolder)
                    .onChange((e) => {
                        if (e) {
                            settings.dispatch({
                                type: 'SET_NOTES_FOLDER',
                                payload: { folder: e },
                            });
                        }
                    });
            });

    new Setting(containerEl)
        .setName(l.SETTINGS_NOTE_CREATION_NAME)
        .addDropdown((c) => {
            c.addOptions({
                annotation: 'annotation',
                'label/annotation': 'label / annotation',
                'label - annotation': 'label - annotation',
            } as Record<NotesNamingMode, string>);
            c.setValue(noteSettings.notesNamingMode);
            c.onChange((v) => {
                settings.dispatch({
                    type: 'SET_NOTES_NAMING_MODE',
                    payload: { folder: v as NotesNamingMode },
                });
            });
        });

    new Setting(containerEl)
        .setName(l.SETTINGS_NOTE_CREATION_INSERT)
        .addToggle((c) => {
            c.setValue(noteSettings.insertLinkToNote);
            c.onChange((v) => {
                settings.dispatch({
                    type: 'SET_NOTES_INSERT_LINK_TO_NOTE',
                    payload: { insert: v },
                });
            });
        });
    new Setting(containerEl)
        .setName(l.SETTINGS_NOTE_CREATION_OPEN)
        .addToggle((c) => {
            c.setValue(noteSettings.openNoteAfterCreation);
            c.onChange((v) => {
                settings.dispatch({
                    type: 'SET_NOTES_OPEN_AFTER_CREATION',
                    payload: { open: v },
                });
            });
        });
    new Setting(containerEl)
        .setName(l.SETTINGS_NOTE_CREATION_TEMPLATE)
        .setDesc(
            l.SETTINGS_NOTE_CREATION_TEMPLATE_desc +
                noteVariables.map((v) => `{{${v}}}`).join(', '),
        )
        .addTextArea((c) => {
            c.setPlaceholder('{{content}}');
            c.setValue(noteSettings.template);
            c.onChange((v) => {
                settings.dispatch({
                    type: 'SET_NOTES_TEMPLATE',
                    payload: { template: v },
                });
            });
        });
};
