import { parseMultiLineComments } from './parse-multi-line-comments';

self.onmessage = function (e) {
    try {
        self.postMessage(parseMultiLineComments(e.data));
    } catch (e) {
        console.error('parseMultiLineComments', e);
    }
};
