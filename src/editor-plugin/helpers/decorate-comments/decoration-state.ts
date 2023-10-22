import { Decoration } from '@codemirror/view';
import { Settings } from '../../../settings/settings-type';
import { generateLabelStyleString } from './helpers/generate-label-style-string';
import CommentLabels from '../../../main';
import {
    debouncedTriggerEditorUpdate,
    triggerEditorUpdate,
} from '../../../comments-outline-view/helpers/outline-updater/helpers/trigger-editor-update';

export class DecorationState {
    private _decorations: Record<
        string,
        { comment: Decoration; tag: Decoration }
    >;
    private _decorateTags: boolean;
    private _fileHasLabeledComments: boolean;
    private _userHasLabels: boolean;
    private _plugin: CommentLabels;

    set plugin(value: CommentLabels) {
        this._plugin = value;
    }

    get enabled() {
        return this._fileHasLabeledComments && this._userHasLabels;
    }

    get decorateTags() {
        return this._decorateTags;
    }

    set fileHasLabeledComments(fileHasLabeledComments: boolean) {
        const wasDisabled = !this.enabled;
        this._fileHasLabeledComments = fileHasLabeledComments;
        if (wasDisabled && this.enabled) {
            const editor = this._plugin.outline.view?.editor;
            if (editor) {
                triggerEditorUpdate(editor);
            }
        }
    }

    set userHasLabels(userHasLabels: boolean) {
        const wasDisabled = !this.enabled;
        this._userHasLabels = userHasLabels;
        if (wasDisabled && this.enabled) {
            const editor = this._plugin.outline.view?.editor;
            if (editor) {
                debouncedTriggerEditorUpdate(editor);
            }
        }
    }

    get decorations() {
        return this._decorations;
    }

    setSettings(styles: Settings['decoration']['styles']) {
        this._decorations = Object.values(styles.labels).reduce(
            (acc, val) => {
                if (val.enableStyle) {
                    acc[val.label] = {
                        comment: Decoration.mark({
                            attributes: {
                                style: generateLabelStyleString(val.style),
                            },
                        }),
                        tag: Decoration.mark({
                            attributes: {
                                style: generateLabelStyleString({
                                    ...val.style,
                                    ...styles.tag.style,
                                }),
                            },
                        }),
                    };
                }
                return acc;
            },
            {} as Record<string, { comment: Decoration; tag: Decoration }>,
        );
        this._decorateTags = styles.tag.enableStyle;
        this.userHasLabels = Object.keys(this._decorations).length > 0;
    }
}

export const decorationState = new DecorationState();
