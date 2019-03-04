export interface ICache {
    addToCache(name: string): void;
    isCached(name: string): boolean;
}
