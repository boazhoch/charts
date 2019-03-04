import { ICache, ICacheConstructor } from "../cache/ICache";

class CacheFactory implements IFactory {
    private caches: Map<string, ICacheConstructor> = new Map<string, ICacheConstructor>();
    constructor(cacheTypes: { [index: string]: ICacheConstructor }) {
        for (const cacheName in cacheTypes) {
            this.caches.set(cacheName, cacheTypes[cacheName])
        }
    }

    public getService(name: string): ICache {
        const CacheService = this.caches.get(name);
        return new (CacheService as ICacheConstructor)();
    }
}

interface IFactory {
    getService(name: string): ICache;
}

export default CacheFactory;