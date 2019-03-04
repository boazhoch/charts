export interface ICache {
    addToCache(name: string): void;
    isCached(name: string): boolean;
}


export interface ICacheConstructor {
    new(): ICache;
}