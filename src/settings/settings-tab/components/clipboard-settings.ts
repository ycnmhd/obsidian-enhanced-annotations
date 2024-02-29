import LabeledAnnotations from '../../../main';
import { Setting } from 'obsidian';
import { l } from '../../../lang/lang';
import {
    ClipboardTemplateSection,
    copiedAnnotationsTemplates,
    copiedAnnotationsVariables,
} from '../../../clipboard/helpers/annotations-to-text';
import { settingsHeader } from '../../../status-bar/helpers/class-names';

type Props = {
    containerEl: HTMLElement;
    plugin: LabeledAnnotations;
};

export const ClipboardSettings = ({ plugin, containerEl }: Props) => {
    const settings = plugin.settings;
    const render = () => {
        containerEl.empty();
        new Setting(containerEl)
            .setName(l.SETTINGS_CLIPBOARD_TITLE)
            .setHeading()
            .settingEl.addClass(settingsHeader);
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
                })
                .addExtraButton((c) => {
                    c.setIcon('reset');
                    c.setTooltip('Reset');
                    c.onClick(() => {
                        settings.dispatch({
                            type: 'SET_CLIPBOARD_TEMPLATE',
                            payload: {
                                template: copiedAnnotationsTemplates[key],
                                name: key,
                            },
                        });
                        render();
                    });
                });
        }
    };
    render();
};
