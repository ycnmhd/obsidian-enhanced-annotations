import { AnnotationCategory } from '../sidebar-outline/components/components/annotations-list/annotations-list.store';

export type Case = 'upper' | 'lower' | 'title';
export type Opacity = 80 | 60 | 40 | 20;
export type FontWeight = 'thin' | 'bold';
export type FontFamily = 'sans-serif' | 'serif' | 'monospace';

export type TagStyle = {
    fontSize?: number;
    fontWeight?: FontWeight;
    fontFamily?: FontFamily;
    opacity?: Opacity;
};

export type TagSettings = {
    style: TagStyle;
    enableStyle: boolean;
};

export type LabelStyle = {
    color?: string;
    italic?: boolean;
    underline?: boolean;
    fontSize?: number;
    case?: Case;
    fontWeight?: FontWeight;
    opacity?: Opacity;
    fontFamily?: FontFamily;
};
export type LabelSettings = {
    label: string;
    id: string;
    style: LabelStyle;
    enableStyle: boolean;
};
export type NotesNamingMode =
    | 'annotation'
    | 'label - annotation'
    | 'label/annotation';
export type CommentType = 'markdown' | 'html';
export type DefaultFolderMode =
    | 'vault'
    | 'current folder'
    | 'current folder/notes'
    | 'customFolder';
export type Settings = {
    editorSuggest: {
        enableAutoSuggest: boolean;
        triggerPhrase: string;
        commentType: CommentType;
    };
    decoration: {
        autoRegisterLabels: boolean;
        decorateCommentTags: boolean;
        styles: {
            labels: Record<string, LabelSettings>;
            tag: TagSettings;
        };
    };
    commands: {
        enableLabelCommands: boolean;
    };
    outline: {
        showSearchInput: boolean;
        fontSize: number;
        showLabelsFilter: boolean;
        hiddenLabels: string[];
        hiddenCategories: AnnotationCategory[];
    };
    tts: {
        volume: number;
        rate: number;
        voice?: string;
        pitch: number;
        focusAnnotationInEditor: boolean;
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
