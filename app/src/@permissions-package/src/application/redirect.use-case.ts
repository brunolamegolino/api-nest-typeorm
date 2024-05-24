import axios, { AxiosHeaders } from 'axios';
import { DataSource } from 'typeorm';

export class RedirectUseCase {
  constructor(private readonly database: DataSource) {}

  public async execute(data: any): Promise<any> {
    const { headers, body, url, method, baseURL } = data;

    const config = {
      method: method,
      baseURL: baseURL,
      url: url.replace(/\/gateway*/, ''),
      headers: new AxiosHeaders(JSON.stringify(headers)),
      data: JSON.stringify(body),
    };

    return config;
    // const response = await axios.request(config);
    // return response.data;
  }
}
