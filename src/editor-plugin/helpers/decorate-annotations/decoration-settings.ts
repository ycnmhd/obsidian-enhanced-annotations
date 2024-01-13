import { Decoration } from '@codemirror/view';
import { Settings } from '../../../settings/settings-type';
import { generateLabelStyleString } from './helpers/generate-label-style-string';
import LabeledAnnotations from '../../../main';
import { triggerEditorUpdate } from '../../../sidebar-outline/helpers/outline-updater/helpers/trigger-editor-update';

export class DecorationSettings {
    constructor(private plugin: LabeledAnnotations) {}

    private _decorations: Record<
        string,
        {
            comment: Decoration;
            tag: Decoration;
            highlight: Decoration;
        }
    >;

    get decorations() {
        return this._decorations;
    }

    private _decorateTags: boolean;

    get decorateTags() {
        return this._decorateTags;
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

    private decorate() {
        const editor = this.plugin.outline.getValue().view?.editor;
        if (editor) {
            triggerEditorUpdate(editor);
        }
    }
}
