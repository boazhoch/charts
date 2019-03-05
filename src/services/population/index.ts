import { IHttp } from "../http/IHttp";
import { IApiDataOptions, IApiService } from "../stock/IStockService";

interface IPayload {}

class PopulationService implements IApiService {
  private requester: IHttp;

  constructor(requester: IHttp) {
    this.requester = requester;
  }

  public getData(options: IApiDataOptions) {
    return this.requester
      .get(this.constructQuery(options))
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(result => {
        if (result.Note) {
          throw new Error("Too much api calls please try in a minute");
        }
        return { err: undefined, data: this.normalizePayloadData(result) };
      })
      .catch((err: Error) => {
        return {
          err,
          data: undefined
        };
      });
  }

  private normalizePayloadData(
    data: IPayload
  ): { name: string; data: [number, number][], average: number } {
    return { data: [[1, 2], [1, 2]], name: "123", average: 1 };
  }

  private constructQuery(options: IApiDataOptions) {
    return `/1.0/population/${options.symbol}/Israel/`;
  }
}

export default PopulationService;
