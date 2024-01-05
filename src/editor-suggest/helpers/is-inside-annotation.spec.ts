import { describe, expect, it } from 'vitest';
import { isInsideAnnotation } from './is-inside-annotation';

type Sample = {
    input: Parameters<typeof isInsideAnnotation>;
    output: ReturnType<typeof isInsideAnnotation>;
};
const samples: Sample[] = [
    {
        input: ['<!-- some text //--> some text', '//', 15],
        output: true,
    },
    {
        input: ['<!-- some text --//> some text', '//', 17],
        output: true,
    },
    {
        input: ['//<!-- some text --> some text', '//', 0],
        output: false,
    },
    {
        input: ['<!-- some text -->// some text', '//', 18],
        output: false,
    },
];

describe('is-inside-annotation', () => {
    for (const sample of samples) {
        it('should handle [' + sample.input[0] + ']', () => {
            expect(isInsideAnnotation(...sample.input)).toBe(sample.output);
        });
    }
});
