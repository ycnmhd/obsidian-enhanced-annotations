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
export const parseAnnotations = (text: string, lineNumber = 0, from = 0) => {
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
    } = {
        multiLineAnnotation: null,
        line: lineNumber,
        from,
        multiLineStart: '',
    };
    for (const line of lines) {
        let startRegex = /(<!--|%%|==)/.exec(line);
        let endRegex =
            startRegex || state.multiLineAnnotation
                ? /(-->|%%|==)/.exec(line)
                : undefined;
        // single line annotation
        if (startRegex && endRegex) {
            const start = startRegex[1];
            const end = endRegex[1];
            if (pairs[start] === end) {
                const from = line.indexOf(start);
                const beforeTo = line.lastIndexOf(end);
                const afterFrom = from + start.length;
                const to = beforeTo + end.length;
                // start of multiline obsidian annotation
                if (from === beforeTo) {
                    if (state.multiLineAnnotation) startRegex = null;
                    else endRegex = null;
                } else {
                    // single line annotation
                    const annotation = line.substring(afterFrom, beforeTo);
                    const labelRegex = /^([^:\s]+): ?(.+)$/g.exec(annotation);
                    const text = (
                        labelRegex ? labelRegex[2] : annotation
                    ).trim();
                    const label = (labelRegex ? labelRegex[1] : '').trim();
                    if (text || label)
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
                    state.multiLineAnnotation = null;
                }
            }
        }
        // start of multiline annotation
        if (startRegex && !endRegex) {
            const start = startRegex[1];
            const from = state.from + line.indexOf(start);
            const afterFrom = line.indexOf(start) + start.length;
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
                        from: { line: state.line, ch: line.indexOf(start) },
                    },
                };
                state.multiLineStart = start;
            }
        }
        // end of multi line annotation
        else if (endRegex && state.multiLineAnnotation) {
            const end = endRegex[1];
            if (pairs[state.multiLineStart as string] === end) {
                const beforeTo = line.lastIndexOf(end);
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
                if (allText)
                    annotations.push({
                        ...state.multiLineAnnotation,
                        text: allText,
                    });
                state.multiLineAnnotation = null;
                state.multiLineStart = null;
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
