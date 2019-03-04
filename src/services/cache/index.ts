import { ICache } from "./ICache";

class Cache implements ICache { 
    private cachedArray: string[] = []

    public addToCache(name: string) { 
        this.cachedArray.push(name);
    }

    public isCached(name: string) {
        return this.cachedArray.indexOf(name) !== -1;
    }
}

export default Cache;