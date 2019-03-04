import { ICache, ICacheConstructor } from "../cache/ICache";

function cacheFactory(cacheTypes: { [index: string]: ICacheConstructor }) { 
    const caches: Map<string, ICacheConstructor> = new Map<string, ICacheConstructor>();
    
    function init(cacheTypes: { [index: string]: ICacheConstructor }) {
        for (const cacheName in cacheTypes) {
            caches.set(cacheName, cacheTypes[cacheName])
        }
    }

    init(cacheTypes)

    function getService(name: string): ICache | null  {
        const CacheService = caches.get(name);
        if (CacheService) {
            return new CacheService();
        }
        return null;
    }

    return {
        getService
    }
}

export default cacheFactory;