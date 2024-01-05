import { describe, expect, it } from 'vitest';
import { sanitizeFileName } from './sanitize-file-name';

type Sample = {
    input: Parameters<typeof sanitizeFileName>;
    output: ReturnType<typeof sanitizeFileName>;
};
const samples: Sample[] = [
    {
        input: ['some[[[text'],
        output: 'some-text',
    },
];

describe('sanitize-file-name', () => {
    for (const sample of samples) {
        it('should handle[' + sample.input[0] + ']', () => {
            expect(sanitizeFileName(...sample.input)).toBe(sample.output);
        });
    }
});
