import { ICache } from "./ICache";

class CacheService implements ICache { 
    private cachedArray: string[] = []

    public addToCache(name: string) { 
        this.cachedArray.push(name);
    }

    public isCached(name: string) {
        return this.cachedArray.indexOf(name) !== -1;
    }
}

export default CacheService;