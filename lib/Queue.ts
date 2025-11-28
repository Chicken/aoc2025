export type Node<TValue> = {
    value: TValue;
    next: Node<TValue> | null;
};

export class Queue<TValue> {
    private head: Node<TValue> | null;
    private tail: Node<TValue> | null;
    constructor() {
        this.head = null;
        this.tail = null;
    }

    notEmpty() {
        return this.head !== null;
    }

    enqueue(value: TValue) {
        const newNode: Node<TValue> = { value, next: null };
        if (this.tail) this.tail.next = newNode;
        this.tail = newNode;
        if (!this.head) this.head = newNode;
    }

    dequeue(): TValue | null {
        if (!this.head) return null;
        const value = this.head.value;
        this.head = this.head.next;
        if (!this.head) this.tail = null;
        return value;
    }

    peek(): TValue | null {
        return this.head?.value ?? null;
    }

    length() {
        let count = 0;
        let current = this.head;
        while (current) {
            count++;
            current = current.next;
        }
        return count;
    }

    // TODO: sorting
}
