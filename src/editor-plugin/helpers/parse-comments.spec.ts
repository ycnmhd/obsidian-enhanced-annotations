import { parseComments, ParsedComment } from './parse-comments';
import { describe, expect, it } from 'vitest';

type TestData = {
    name: string;
    input: {
        text: string;
        line: number;
        from: number;
    };
    output: ParsedComment[];
};

const data: TestData[] = [
    {
        input: {
            text: `Greenland's climate is a tundra climate (Köppen ET) on and near the coasts and an ice cap climate (Köppen EF) in inland areas. It typically has short, cool summers and long, moderately cold winters.


Greenland map of Köppen climate classification

Retreat of the Helheim Glacier, Greenland

<!--n: first comment-->
Map of Greenland's rate of change in ice sheet height

Map of Greenland bedrock
<!--n: second comment-->
Due to Gulf Stream influences, Greenland's winter temperatures are very mild for its latitude. In Nuuk, the capital, average winter temperatures are only −9 °C (16 °F). In comparison, the average winter temperatures for Iqaluit, Nunavut, Canada, are around −27 °C (−17 °F). Conversely, summer temperatures are very low, with an average high around 10 °C (50 °F). This is too low to sustain trees, and the land is treeless tundra.

<!--n: third multi
line comment-->
On the Greenland ice sheet, the temperature is far below freezing throughout the year, and record high temperatures have peaked only slightly above freezing. The record high temperature at Summit Camp is 2.2 °C (36.0 °F).
%% forth comment%%
In the far south of Greenland, there is a very small forest in the Qinngua Valley, due to summer temperatures being barely high enough to sustain trees. There are mountains over 1,500 metres (4,900 ft) high surrounding the valley, which protect it from cold, fast winds travelling across the ice sheet. It is the only natural forest in Greenland, but is only 15 kilometres (9.3 mi) long.
%%n: sixth 

comment
%%

`,
            from: 0,
            line: 0,
        },
        name: 'test 1',
        output: [
            {
                text: 'first comment',
                label: 'n',
                position: {
                    from: 292,
                    to: 315,
                },
                range: {
                    from: {
                        line: 7,
                        ch: 0,
                    },
                    to: {
                        line: 7,
                        ch: 23,
                    },
                },
            },
            {
                text: 'second comment',
                label: 'n',
                position: { from: 396, to: 420 },
                range: { from: { line: 11, ch: 0 }, to: { line: 11, ch: 24 } },
            },
            {
                label: 'n',
                text: 'third multi line comment',
                position: { from: 852, to: 886 },
                range: { from: { line: 14, ch: 0 }, to: { line: 15, ch: 15 } },
            },
            {
                text: ' forth comment',
                label: '',
                position: { from: 1109, to: 1127 },
                range: { from: { line: 17, ch: 0 }, to: { line: 17, ch: 18 } },
            },
            {
                label: 'n',
                text: 'sixth  comment',
                position: { from: 1516, to: 1539 },
                range: { from: { line: 19, ch: 0 }, to: { line: 22, ch: 2 } },
            },
        ],
    },
];

describe('parse comments', () => {
    for (const sample of data) {
        it(sample.name, () => {
            const result = parseComments(
                sample.input.text.split('\n'),
                sample.input.line,
                sample.input.from,
            );
            expect(result).toEqual(sample.output);
        });
    }
});
