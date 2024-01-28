import LabeledAnnotations from '../../../../main';
import { Setting } from 'obsidian';
import { FolderSuggest } from './helpers/folder-suggestions';
import { DefaultFolderMode, NotesNamingMode } from '../../../settings-type';
import { l } from '../../../../lang/lang';

import {
    noteTemplate,
    noteVariables,
} from '../../../../note-creation/create-note-file';

type Props = {
    containerEl: HTMLElement;
    plugin: LabeledAnnotations;
};
const options: Record<DefaultFolderMode, string> = {
    vault: 'vault folder',
    'current folder': 'current folder',
    'current folder/notes': 'current folder / notes',
    customFolder: 'folder specified below',
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
                'annotation-text': 'annotation text',
                'annotation-label/annotation-text':
                    'annotation label / annotation text',
                'annotation-label - annotation-text':
                    'annotation label - annotation text',
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
        .setName(l.SETTINGS_NOTE_TRUNCATE_FILE_NAME)
        .setDesc(l.SETTINGS_NOTE_TRUNCATE_FILE_NAME_DESC)
        .addToggle((c) => {
            c.setValue(noteSettings.truncateFileName);
            c.onChange((v) => {
                settings.dispatch({
                    type: 'TOGGLE_TRUNCATE_FILE_NAME',
                });
            });
        });

    new Setting(containerEl)
        .setName(l.SETTINGS_NOTE_CREATION_INSERT)
        .setDesc(l.SETTINGS_NOTE_CREATION_INSERT_DESC)
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
        .setDesc(l.SETTINGS_NOTE_CREATION_OPEN_DESC)
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
            l.SETTINGS_TEMPLATE_desc +
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
        })
        .addExtraButton((c) => {
            c.setIcon('reset');
            c.setTooltip('Reset');
            c.onClick(() => {
                settings.dispatch({
                    type: 'SET_NOTES_TEMPLATE',
                    payload: { template: noteTemplate },
                });
                render();
            });
        });
};
