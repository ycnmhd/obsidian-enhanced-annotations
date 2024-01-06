export class WorkerPromise<Input, Output> {
    private id = 0;
    private worker: Worker;
    private resolvers: Record<
        number,
        (value: Output | PromiseLike<Output>) => void
    > = {};

    constructor(worker: Worker) {
        this.worker = worker;
        this.worker.addEventListener('message', this.onMessage);
    }

    private onMessage = (
        message: MessageEvent<{ id: number; payload: Output }>,
    ) => {
        const id = message.data.id;
        const resolver = this.resolvers[id];
        if (resolver) {
            resolver(message.data.payload);
            delete this.resolvers[id];
        }
    };

    run = (payload: Input) => {
        return new Promise<Output>((resolve) => {
            if (this.id === 1000) this.id = 0;
            const id = this.id++;
            this.resolvers[id] = resolve;
            this.worker.postMessage({ id, payload });
        });
    };
}
