import { Decoration } from '@codemirror/view';
import { Settings } from '../../../settings/settings-type';
import { generateLabelStyleString } from './helpers/generate-label-style-string';
import LabeledAnnotations from '../../../main';
import {
    debouncedTriggerEditorUpdate,
    triggerEditorUpdate,
} from '../../../sidebar-outline/helpers/outline-updater/helpers/trigger-editor-update';

export class DecorationState {
    private _decorations: Record<
        string,
        {
            comment: Decoration;
            tag: Decoration;
            highlight: Decoration;
        }
    >;
    private _defaultHighlightDecoration: Decoration;
    private _decorateTags: boolean;
    private _fileHasLabeledAnnotations: boolean;
    private _userHasLabels: boolean;
    private _plugin: LabeledAnnotations;

    set plugin(value: LabeledAnnotations) {
        this._plugin = value;
    }

    get enabled() {
        return this._fileHasLabeledAnnotations && this._userHasLabels;
    }

    get decorateTags() {
        return this._decorateTags;
    }

    set fileHasLabeledAnnotations(value: boolean) {
        const wasDisabled = !this.enabled;
        this._fileHasLabeledAnnotations = value;
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

    get defaultHighlightDecoration(): Decoration {
        return this._defaultHighlightDecoration;
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

        const view = this._plugin.outline.view;
        if (view) {
            const bg = getComputedStyle(view.contentEl).getPropertyValue(
                '--text-highlight-bg',
            );
            if (bg) {
                this._defaultHighlightDecoration = Decoration.mark({
                    attributes: {
                        style: `background-color: ${bg}`,
                    },
                });
            }
        }
    }
}

export const decorationState = new DecorationState();
