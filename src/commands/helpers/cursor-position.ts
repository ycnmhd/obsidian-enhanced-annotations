import { CommentFormat } from '../../settings/settings-type';
import { AnnotationType } from '../../sidebar-outline/components/components/annotations-list/annotations-list.store';

export const cursorPosition = (
    text: string,
    commentType: CommentFormat,
    type?: AnnotationType,
) => {
    return text.length - (type ? (commentType === 'html' ? 3 : 2) : 0);
};
