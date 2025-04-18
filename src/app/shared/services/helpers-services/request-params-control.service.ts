import { Injectable } from '@angular/core';

interface IOptionalParams {
  key: string;
  value: any;
}

@Injectable({
  providedIn: 'root',
})
export class RequestParamsControlService {
  paramsControl(optionalParams: IOptionalParams[]) {
    const params: any[] = [];
    optionalParams.map(({ key, value }) => {
      if (value !== undefined && value !== null && value !== '') {
        params.push({ key, value });
      }
    });

    return params;
  }
}
