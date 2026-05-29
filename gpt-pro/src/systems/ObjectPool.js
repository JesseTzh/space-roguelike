export class ObjectPool {
    createItem;
    initialSize;
    maxSize;
    items = [];
    constructor(createItem, initialSize, maxSize = Number.POSITIVE_INFINITY) {
        this.createItem = createItem;
        this.initialSize = initialSize;
        this.maxSize = maxSize;
        for (let i = 0; i < initialSize; i += 1) {
            this.items.push(this.createItem());
        }
    }
    get() {
        const item = this.items.find(candidate => !candidate.active);
        if (item)
            return item;
        if (this.items.length >= this.maxSize)
            return undefined;
        const newItem = this.createItem();
        this.items.push(newItem);
        return newItem;
    }
    release(item) {
        item.despawn();
    }
    releaseAll() {
        for (const item of this.items)
            item.despawn();
    }
    get activeCount() {
        return this.items.filter(item => item.active).length;
    }
    get totalCount() {
        return this.items.length;
    }
    get allItems() {
        return this.items;
    }
}
//# sourceMappingURL=ObjectPool.js.map