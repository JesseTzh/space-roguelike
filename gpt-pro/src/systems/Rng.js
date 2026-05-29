export class SeededRng {
    state;
    constructor(seed = 0x12345678) {
        this.state = seed >>> 0;
    }
    setSeed(seed) {
        this.state = seed >>> 0;
    }
    next() {
        let x = this.state;
        x ^= x << 13;
        x ^= x >>> 17;
        x ^= x << 5;
        this.state = x >>> 0;
        return this.state / 0xffffffff;
    }
    nextRange(min, max) {
        return min + (max - min) * this.next();
    }
    pick(items) {
        if (items.length === 0)
            throw new Error('Cannot pick from empty list');
        const index = Math.min(items.length - 1, Math.floor(this.next() * items.length));
        return items[index];
    }
}
//# sourceMappingURL=Rng.js.map