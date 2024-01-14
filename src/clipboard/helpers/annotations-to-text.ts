import { applyVariablesToTemplate } from './apply-variables-to-template';
import {
    formattedDate,
    formattedTime,
    timeTag,
} from '../../helpers/date-utils';
import { ParsedAnnotations } from './parse-annotations-from-files';

export const copiedAnnotationsVariables = {
    front: ['root_folder', 'date', 'time', 'time_tag'],
    header: ['note_folder', 'note_name'],
    highlight: ['highlight_text', 'highlight_label'],
    comment: ['comment_text', 'comment_label'],
} as const;

export type ClipboardTemplateSection = keyof typeof copiedAnnotationsVariables;

type FrontVariables = typeof copiedAnnotationsVariables.front;
type HeaderVariables = typeof copiedAnnotationsVariables.header;

export type ClipboardTemplates = {
    front: string;
    header: string;
    highlight: string;
    comment: string;
};
export const copiedAnnotationsTemplates: ClipboardTemplates = {
    front: '',
    header: `# {{note_name}}`,
    highlight: `- {{highlight_text}}`,
    comment: `- _{{comment_text}}_`,
};

export const annotationsToText = (
    annotations: ParsedAnnotations[],
    templates: ClipboardTemplates,
    rootFolder: string,
): string => {
    const frontVariables: Record<FrontVariables[number], string> = {
        time: formattedTime(),
        date: formattedDate(),
        time_tag: timeTag(),
        root_folder: rootFolder,
    };
    const front = applyVariablesToTemplate({
        template: templates.front,
        variables: frontVariables,
    });
    const annotationsText: string[] = [];
    if (front.trim()) annotationsText.push(front);
    for (const { annotations: fileAnnotations, name, path } of annotations) {
        const fileText: string[] = [];
        const header = applyVariablesToTemplate({
            template: templates.header,
            variables: { note_folder: path, note_name: name } as Record<
                HeaderVariables[number],
                string
            >,
        });
        for (const annotation of fileAnnotations) {
            if (annotation.text) {
                const text = applyVariablesToTemplate({
                    template: annotation.isHighlight
                        ? templates.highlight
                        : templates.comment,
                    variables: {
                        [annotation.isHighlight
                            ? 'highlight_text'
                            : 'comment_text']: annotation.text.trim(),
                        [annotation.isHighlight
                            ? 'highlight_label'
                            : 'comment_label']: annotation.label.trim(),
                    },
                });
                if (text.trim()) fileText.push(text);
            }
        }
        if (fileText.length)
            annotationsText.push(header + '\n' + fileText.join('\n'));
    }

    return annotationsText.join('\n\n');
};
