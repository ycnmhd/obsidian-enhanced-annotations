import { AnnotationType } from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';
import { CommentFormat } from '../../settings/settings-type';

export const wrapText = ({
    text,
    type,
    format,
    label,
}: {
    label?: string;
    text: string;
    type?: AnnotationType;
    format: CommentFormat;
}) => {
    if (label) label = label + ': ';
    if (type === 'highlight') {
        return `==${label}${text}==`;
    } else if (type) {
        if (format === 'html') {
            return `<!--${label}${text}-->`;
        } else return `%%${label}${text}%%`;
    } else return text;
};
