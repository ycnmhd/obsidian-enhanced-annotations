import { describe, it } from 'vitest';
import { parseMultiLineComments } from './parse-multi-line-comments';
import { sample1 } from './parse-comment-samples';
import { parseComments } from './parse-comments';

type Sample = { name: string; input: Parameters<typeof sample1> };
const samples: Sample[] = [
    {
        name: 'single-line',
        input: [
            [
                `<!--n: first-->`,
                `<!--n: second-->`,
                `<!--n: third-->`,
                `<!--n: forth-->`,
            ],
        ],
    },
    {
        name: 'multi-line',
        input: [
            [
                `%%n: first
comment
			
		%%`,
                `<!--n: 

second-->`,
                `<!--n: third

-->`,
                `<!--n: forth comment-->`,
            ],
        ],
    },
];

const run = (
    sample: string,
    callback: typeof parseMultiLineComments | typeof parseComments,
    lines: string[],
) => {
    const label = [
        sample.padEnd(12, ' '),
        callback.name.padEnd(parseMultiLineComments.name.length + 5, ' '),
        String(lines.length + 5).padEnd(6, ' '),
    ].join(': ');
    for (let i = 0; i < 3; i++) {
        console.time(label);
        callback(lines, 0, 0);
        console.timeEnd(label);
    }
};
const multiplyText = (length: number, lines: string[]) =>
    Array.from({ length })
        .map(() => lines)
        .flat();

const lengths = [1, 5, 10, 20, 50, 100, 1000, 10_000, 100_000];

describe.skip('parse comments perf', function () {
    for (const sample of samples) {
        it(sample.name, () => {
            for (const length of lengths) {
                const lines = multiplyText(
                    length,
                    sample1(...sample.input).split('\n'),
                );
                run(sample.name, parseComments, lines);
                run(sample.name, parseMultiLineComments, lines);
            }
        });
    }
});
