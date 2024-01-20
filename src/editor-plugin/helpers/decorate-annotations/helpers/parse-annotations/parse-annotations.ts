import { EditorRangeOrCaret } from 'obsidian';

const pairs: Record<string, string> = {
    '<!--': '-->',
    '==': '==',
    '%%': '%%',
};

export type Annotation = {
    text: string;
    label: string;
    isHighlight: boolean;
    range: EditorRangeOrCaret;
    position: {
        from: number;
        to: number;
        beforeTo: number;
        afterFrom: number;
    };
};
const startPattern = /(<!--|%%|==)/g;
const endPattern = /(-->|%%|==)/g;
export const parseAnnotations = (
    text: string,
    lineNumber = 0,
    from = 0,
    includeEmptyAnnotations = false,
) => {
    const lines = text.split('\n');
    const annotations: Annotation[] = [];

    const state: {
        multiLineAnnotation:
            | (Omit<Annotation, 'text'> & {
                  text: string[];
              })
            | null;
        line: number;
        from: number;
        multiLineStart: string | null;
        multiAnnotationLine: boolean;
    } = {
        multiLineAnnotation: null,
        line: lineNumber,
        from,
        multiLineStart: '',
        multiAnnotationLine: false,
    };
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (state.multiAnnotationLine) {
            state.multiAnnotationLine = false;
        } else {
            startPattern.lastIndex = 0;
            endPattern.lastIndex = 0;
        }

        let startRegex = startPattern.exec(line);

        let endRegex: RegExpExecArray | null | undefined = undefined;

        if (startRegex || state.multiLineAnnotation) {
            // to handle identical tags `%% comment %%`
            if (!state.multiLineAnnotation)
                endPattern.lastIndex = startPattern.lastIndex;
            endRegex = endPattern.exec(line);
        }

        // single line annotation
        if (startRegex && endRegex) {
            const start = startRegex[1];
            const end = endRegex[1];
            // tags match
            if (pairs[start] === end) {
                const from = startRegex.index;
                const beforeTo = endRegex.index;
                const afterFrom = from + start.length;
                const to = beforeTo + end.length;
                // single line annotation
                if (from < beforeTo) {
                    const annotation = line.substring(afterFrom, beforeTo);
                    const labelRegex = /^([^:\s]+): ?(.+)$/g.exec(annotation);
                    const text = (
                        labelRegex ? labelRegex[2] : annotation
                    ).trim();
                    const label = (labelRegex ? labelRegex[1] : '').trim();
                    if (text || label || includeEmptyAnnotations) {
                        annotations.push({
                            text: text,
                            label: label,
                            isHighlight: start === '==',
                            position: {
                                from: state.from + from,
                                to: state.from + to,
                                afterFrom: state.from + afterFrom,
                                beforeTo: state.from + beforeTo,
                            },
                            range: {
                                from: {
                                    line: state.line,
                                    ch: from,
                                },
                                to: {
                                    line: state.line,
                                    ch: to,
                                },
                            },
                        });
                    }
                    // multi comment line
                    if (startPattern.exec(line) !== null) {
                        state.multiAnnotationLine = true;
                        startPattern.lastIndex = endPattern.lastIndex;
                        i = i - 1;
                        continue;
                    }
                    state.multiLineAnnotation = null;
                } else if (from === beforeTo) {
                    // start and end are the same
                    startRegex = null;
                }
            }
        }
        // start of multiline annotation
        if (startRegex && !endRegex) {
            const start = startRegex[1];
            const from = state.from + startRegex.index;
            const afterFrom = startRegex.index + start.length;
            const annotation = line.substring(afterFrom);
            const labelRegex = /^([^:\s]+): ?(.+)$/g.exec(annotation);
            const text = labelRegex ? labelRegex[2] : annotation;
            const label = (labelRegex ? labelRegex[1] : '').trim();

            if (text || label) {
                state.multiLineAnnotation = {
                    label,
                    text: [text],
                    isHighlight: start === '==',
                    position: {
                        from,
                        afterFrom: state.from + afterFrom,
                        beforeTo: -1,
                        to: -1,
                    },
                    range: {
                        from: { line: state.line, ch: startRegex.index },
                    },
                };
                state.multiLineStart = start;
            }
        }
        // end of multi line annotation
        else if (endRegex && state.multiLineAnnotation) {
            const end = endRegex[1];
            if (pairs[state.multiLineStart as string] === end) {
                const beforeTo = endRegex.index;
                const to = beforeTo + end.length;
                state.multiLineAnnotation.text.push(
                    line.substring(0, beforeTo),
                );
                state.multiLineAnnotation.position.to = state.from + to;
                state.multiLineAnnotation.position.beforeTo =
                    state.from + beforeTo;
                state.multiLineAnnotation.range.to = {
                    line: state.line,
                    ch: to,
                };
                const allText = state.multiLineAnnotation.text
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .join(' ');
                if (allText || includeEmptyAnnotations)
                    annotations.push({
                        ...state.multiLineAnnotation,
                        text: allText,
                    });
                state.multiLineAnnotation = null;
                state.multiLineStart = null;
                // end of multiline annotation and start of another annotation in the same line
                if (startRegex) {
                    startPattern.lastIndex = endPattern.lastIndex;
                    i = i - 1;
                    continue;
                }
            }
        }
        // middle of a multi line annotation
        else if (state.multiLineAnnotation) {
            state.multiLineAnnotation.text.push(line);
        }
        state.line++;
        state.from += line.length + 1;
    }

    return annotations;
};
