type Subscriber = () => void;
type Setter<T> = (currentValue: T) => T;
export type Reducer<T, U> = (store: T, action: U) => T;

export class Store<T, U> {
    private data: T;
    private subscribers: Set<Subscriber> = new Set();
    private readonly reducer: Reducer<T, U> = () => this.data;

    constructor(initialValue: T, reducer?: Reducer<T, U>) {
        this.data = initialValue;
        if (reducer) this.reducer = reducer;
    }

    // Set a new value in the store and notify subscribers
    setValue(newValue: T | Setter<T>): void {
        this.data =
            // @ts-ignore
            typeof newValue === 'function' ? newValue(this.data) : newValue;
        this.notifySubscribers();
    }

    // Get the current value from the store
    getValue(): T {
        return JSON.parse(JSON.stringify(this.data));
    }

    dispatch(action: U) {
        this.setValue(this.reducer(this.data, action));
    }

    // Subscribe to changes in the store
    subscribe(subscriber: Subscriber): void {
        this.subscribers.add(subscriber);
        // Provide the initial value to the new subscriber
        subscriber();
    }

    // Unsubscribe from changes in the store
    unsubscribe(subscriber: Subscriber): void {
        this.subscribers.delete(subscriber);
    }

    // Notify all subscribers of a change in the store value
    private notifySubscribers(): void {
        for (const subscriber of this.subscribers) {
            subscriber();
        }
    }
}
