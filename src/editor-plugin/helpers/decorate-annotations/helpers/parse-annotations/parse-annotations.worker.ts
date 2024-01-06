import { parseAnnotations } from './parse-annotations';

self.onmessage = function (e) {
    try {
        self.postMessage({
            id: e.data.id,
            payload: parseAnnotations(e.data.payload),
        });
    } catch (e) {
        console.error('parseAnnotations', e);
    }
};
