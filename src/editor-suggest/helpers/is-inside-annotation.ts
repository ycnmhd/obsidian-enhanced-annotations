import { parseAnnotations } from '../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';

export const isInsideAnnotation = (line: string, text: string, ch: number) => {
    line = line.substring(0, ch) + line.substring(ch + text.length);
    const annotation = parseAnnotations(line)[0];
    return (
        annotation &&
        ch > annotation.position.from &&
        ch < annotation.position.to
    );
};
