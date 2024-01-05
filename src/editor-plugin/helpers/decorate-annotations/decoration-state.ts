import { Decoration } from '@codemirror/view';
import { Settings } from '../../../settings/settings-type';
import { generateLabelStyleString } from './helpers/generate-label-style-string';
import LabeledAnnotations from '../../../main';
import { triggerEditorUpdate } from '../../../sidebar-outline/helpers/outline-updater/helpers/trigger-editor-update';

export class DecorationState {
    private _decorations: Record<
        string,
        {
            comment: Decoration;
            tag: Decoration;
            highlight: Decoration;
        }
    >;
    private _decorateTags: boolean;
    private _fileHasLabeledAnnotations: boolean;
    private _fileHasHighlight: boolean;
    private _userHasLabels: boolean;
    private _plugin: LabeledAnnotations;

    set plugin(value: LabeledAnnotations) {
        this._plugin = value;
    }

    get enabled() {
        return (
            (this._fileHasLabeledAnnotations && this._userHasLabels) ||
            this._fileHasHighlight
        );
    }

    get decorateTags() {
        return this._decorateTags;
    }

    set fileHasLabeledAnnotations(value: boolean) {
        const wasDisabled = !this.enabled;
        this._fileHasLabeledAnnotations = value;
        if (wasDisabled && this.enabled) {
            this.decorate();
        }
    }

    set fileHasHighlight(value: boolean) {
        const wasDisabled = !this.enabled;
        this._fileHasHighlight = value;
        if (wasDisabled && this.enabled) {
            this.decorate();
        }
    }

    private set userHasLabels(userHasLabels: boolean) {
        const wasDisabled = !this.enabled;
        this._userHasLabels = userHasLabels;
        if (wasDisabled && this.enabled) {
            this.decorate();
        }
    }

    private decorate() {
        const editor = this._plugin.outline.getValue().view?.editor;
        if (editor) {
            triggerEditorUpdate(editor);
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
                                style: generateLabelStyleString(
                                    val.style,
                                    false,
                                ),
                            },
                        }),
                        highlight: Decoration.mark({
                            attributes: {
                                style: generateLabelStyleString(
                                    val.style,
                                    true,
                                ),
                            },
                        }),
                        tag: Decoration.mark({
                            attributes: {
                                style: generateLabelStyleString(
                                    {
                                        ...val.style,
                                        ...styles.tag.style,
                                    },
                                    false,
                                ),
                            },
                        }),
                    };
                }
                return acc;
            },
            {} as Record<
                string,
                {
                    comment: Decoration;
                    tag: Decoration;
                    highlight: Decoration;
                }
            >,
        );
        this._decorateTags = styles.tag.enableStyle;

        this.userHasLabels = Object.keys(this._decorations).length > 0;
        this.decorate();
    }
}

export const decorationState = new DecorationState();
