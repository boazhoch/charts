export interface IHttp {
    get(path: string): Promise<Response>;
}
