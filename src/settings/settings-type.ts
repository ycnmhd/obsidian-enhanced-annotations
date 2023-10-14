import { POSSIBLE_FONT_SIZES } from '../comments-outline-view/comments-outline/components/controls-bar/controls-bar.store';

export type LabelStyle = {
    color?: string;
    italic?: boolean;
    bold?: boolean;
    underline?: boolean;
    fontSize?: number;
    case?: 'upper' | 'lower' | 'title' | 'unset';
};
export type LabelSettings = {
    label: string;
    id: string;
    style: LabelStyle;
    enableStyle: boolean;
};
export type NotesNamingMode = 'comment' | 'label - comment' | 'label/comment';
export type CommentType = 'markdown' | 'html';
export type DefaultFolderMode =
    | 'vault'
    | 'current folder'
    | 'current folder/notes'
    | 'customFolder';
export type Settings = {
    labels: Record<string, LabelSettings>;
    editorSuggest: {
        enableAutoSuggest: boolean;
        triggerPhrase: string;
        commentType: CommentType;
    };
    decoration: {
        autoRegisterLabels: boolean;
        decorateCommentTags: boolean;
    };
    commands: {
        enableLabelCommands: boolean;
    };
    outline: {
        showSearchInput: boolean;
        fontSize: (typeof POSSIBLE_FONT_SIZES)[number];
        showLabelsFilter: boolean;
        hiddenLabels: string[];
    };
    tts: {
        volume: number;
        rate: number;
        voice?: string;
        pitch: number;
    };
    notes: {
        defaultFolderMode: DefaultFolderMode;
        defaultFolder: string;
        notesNamingMode: NotesNamingMode;
        openNoteAfterCreation: boolean;
        insertLinkToNote: boolean;
        template: string;
    };
};
