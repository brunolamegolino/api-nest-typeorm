import axios, { AxiosHeaders } from 'axios';
import { DataSource } from 'typeorm';

export class RedirectUseCase {
  constructor(private readonly database: DataSource) {}

  public async execute(data: any): Promise<any> {
    const { headers, body, url, method, baseURL } = data;

    const config = {
      method: method,
      baseURL: baseURL,
      url: url,
      headers: new AxiosHeaders(headers),
      data: JSON.stringify(body),
      timeout: process.env.NODE_ENV === 'dev' ? 10000 : 5000,
    };

    if (process.env.NODE_ENV === 'test') return config;
    const response = await axios.request(config);
    return response.data;
  }
}
