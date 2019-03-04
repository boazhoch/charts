export interface IHttp {
    get(path: string): Promise<Response>;
}

export interface IHttpConstructor {
    new(path: string): IHttp
}