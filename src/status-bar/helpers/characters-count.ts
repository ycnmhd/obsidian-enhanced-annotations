/* eslint-disable no-useless-escape */

import { WorkerPromise } from '../../helpers/worker-promise';
import { pattern } from './word-count';

export const script = `
let pattern = ${pattern}
function charactersCount(str) {
  
   return str.length - str.replace(/--/g,"##").replace(pattern, '').length
}

self.onmessage = function (e) {
    try {
        self.postMessage({id: e.data.id, payload: charactersCount(e.data.payload)});
    } catch (e) {
        console.error('charactersCount', e);
    }
};`;
const W = new Worker(
    URL.createObjectURL(
        new Blob([script], {
            type: 'text/javascript',
        }),
    ),
);

const workerPromise = new WorkerPromise<string, number>(W);
export const charactersCount = workerPromise.run;
