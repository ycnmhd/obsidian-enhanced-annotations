import { parseAnnotations } from './parse-annotations';

self.onmessage = function (e) {
    try {
        self.postMessage(parseAnnotations(e.data));
    } catch (e) {
        console.error('parseAnnotations', e);
    }
};
