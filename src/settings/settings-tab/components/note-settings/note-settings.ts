import CommentLabels from '../../../../main';
import { Setting } from 'obsidian';
import { FolderSuggest } from './helpers/folder-suggestions';
import { NotesNamingMode } from '../../../settings-type';
import { l } from '../../../../lang/lang';

type Props = {
    containerEl: HTMLElement;
    plugin: CommentLabels;
};
export const NoteSettings = ({ containerEl, plugin }: Props) => {
    containerEl.createEl('h3', { text: l.SETTINGS_NOTE_CREATION_TITLE });

    const settings = plugin.settings;
    new Setting(containerEl)
        .setName(l.SETTINGS_NOTE_CREATION_FOLDER)
        .addSearch((cb) => {
            new FolderSuggest(plugin.app, cb.inputEl);
            cb.setPlaceholder(l.SETTINGS_NOTE_CREATION_FOLDER_PLACEHOLDER)
                .setValue(settings.getValue().notes.defaultFolder)
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
                comment: '[comment]',
                'label/comment': '[label]/[comment]',
                'label - comment': '[label] - [comment]',
            } as Record<NotesNamingMode, string>);
            c.setValue(settings.getValue().notes.notesNamingMode);
            c.onChange((v) => {
                settings.dispatch({
                    type: 'SET_NOTES_NAMING_MODE',
                    payload: { folder: v as NotesNamingMode },
                });
            });
        });
    new Setting(containerEl)
        .setName(l.SETTINGS_NOTE_CREATION_OPEN)
        .addToggle((c) => {
            c.setValue(settings.getValue().notes.openNoteAfterCreation);
            c.onChange((v) => {
                settings.dispatch({
                    type: 'SET_NOTES_OPEN_AFTER_CREATION',
                    payload: { open: v },
                });
            });
        });
};
