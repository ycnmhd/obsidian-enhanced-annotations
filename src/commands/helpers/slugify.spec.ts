import { describe, expect, it } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
    it('should slugify', () => {
        const input =
            'Insert a  comment   with the second most recently used label after an empty line!';
        const output =
            'insert-a-comment-with-the-second-most-recently-used-label-after-an-empty-line';
        expect(slugify(input)).toBe(output);
    });
});
