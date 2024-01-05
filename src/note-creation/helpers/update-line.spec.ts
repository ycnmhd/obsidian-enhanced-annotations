import { describe, expect, it } from 'vitest';
import { updateLine } from './insert-link-to-note';

const samples = [
    {
        input: ['some line ^abc123', '^abc123'],
        output: 'some line [[file|↗]] ^abc123',
    },
    {
        input: ['some line ^abc123 ', '^abc123'],
        output: 'some line [[file|↗]] ^abc123',
    },
    {
        input: ['some line ^abc123 some text', '^abc123'],
        output: 'some line ^abc123 some text',
    },
    {
        input: ['some line [[old-file|↗]] ^abc123', '^abc123'],
        output: 'some line [[old-file|↗]] [[file|↗]] ^abc123',
    },
];

describe('update-line', () => {
    for (const sample of samples) {
        it('should handle[' + sample.input[0] + ']', () => {
            expect(updateLine(sample.input[0], 'file', sample.input[1])).toBe(
                sample.output,
            );
        });
    }
});
