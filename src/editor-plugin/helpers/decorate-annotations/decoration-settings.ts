import { Decoration } from '@codemirror/view';
import { Settings } from '../../../settings/settings-type';
import { generateLabelStyleString } from './helpers/generate-label-style-string';
import LabeledAnnotations from '../../../main';
import { triggerEditorUpdate } from '../../../sidebar-outline/helpers/outline-updater/helpers/trigger-editor-update';

export class DecorationSettings {
    private _decorations: Record<
        string,
        {
            comment: Decoration;
            tag: Decoration;
            highlight: Decoration;
        }
    >;
    private _decorateTags: boolean;

    constructor(private plugin: LabeledAnnotations) {}

    get decorateTags() {
        return this._decorateTags;
    }

    private decorate() {
        const editor = this.plugin.outline.getValue().view?.editor;
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

        this.decorate();
    }
}
