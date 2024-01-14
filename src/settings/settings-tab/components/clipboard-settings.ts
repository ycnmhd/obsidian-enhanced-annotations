import LabeledAnnotations from '../../../main';
import { Setting } from 'obsidian';
import { l } from '../../../lang/lang';
import {
    ClipboardTemplateSection,
    copiedAnnotationsTemplates,
    copiedAnnotationsVariables,
} from '../../../clipboard/helpers/annotations-to-text';

type Props = {
    containerEl: HTMLElement;
    plugin: LabeledAnnotations;
};

export const ClipboardSettings = ({ plugin, containerEl }: Props) => {
    containerEl.createEl('h3', { text: l.SETTINGS_CLIPBOARD_TITLE });
    const settings = plugin.settings;

    for (const Key of ['Front', 'Header', 'Comment', 'Highlight']) {
        const key = Key.toLowerCase() as ClipboardTemplateSection;

        new Setting(containerEl)
            .setName(Key + ' ' + l.SETTINGS_CLIPBOARD_TEMPLATE)
            .setDesc(
                l.SETTINGS_TEMPLATE_desc +
                    copiedAnnotationsVariables[key]
                        .map((v) => `{{${v}}}`)
                        .join(', '),
            )
            .addTextArea((c) => {
                c.setPlaceholder(copiedAnnotationsTemplates[key]);
                c.setValue(settings.getValue().clipboard.templates[key]);
                c.onChange((v) => {
                    settings.dispatch({
                        type: `SET_CLIPBOARD_TEMPLATE`,
                        payload: { template: v, name: key },
                    });
                });
            });
    }
};
