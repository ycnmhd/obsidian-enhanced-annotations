import {
    Invalidator,
    Subscriber,
    Unsubscriber,
    Updater,
    Writable,
} from 'svelte/store';

export type Reducer<T, U> = (store: T, action: U) => T;

export class Store<T, U> implements Writable<T> {
    private value: T;
    private subscribers: Set<Subscriber<T>> = new Set();
    private readonly reducer: Reducer<T, U> = () => this.value;

    constructor(initialValue: T, reducer?: Reducer<T, U>) {
        this.value = initialValue;
        if (reducer) this.reducer = reducer;
    }

    getValue(): T {
        return this.value;
    }

    dispatch(action: U) {
        this.set(this.reducer(this.value, action));
    }

    set(value: T): void {
        this.value = value;
        this.notifySubscribers();
    }

    subscribe(run: Subscriber<T>, invalidate?: Invalidator<T>): Unsubscriber {
        this.subscribers.add(run);
        run(this.value);
        return () => {
            this.subscribers.delete(run);
        };
    }

    update(updater: Updater<T>): void {
        this.value = updater(this.value);
        this.notifySubscribers();
    }

    private notifySubscribers(): void {
        for (const subscriber of this.subscribers) {
            subscriber(this.value);
        }
    }
}
