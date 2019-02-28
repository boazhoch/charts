import { IHttp } from "./IHttp";

class Http implements IHttp { 
    private endPoint: string;
    
    constructor(endPoint: string) { 
        this.endPoint = endPoint;
    }

    /**
     *
     *
     * @private
     * @param {string} path
     * @returns
     * @memberof Http
     */
    private extendEndPointWithPath(path: string) { 
        return `${this.endPoint}${path}`;
    }

    /**
     *
     *
     * @param {string} path
     * @returns
     * @memberof Http
     */
    public get(path: string) {
        const fullPath = this.extendEndPointWithPath(path);
        return fetch(fullPath)
    }
}


export default Http;