export interface IHttpResponseModel {
  data: any;
  meta: {
    user: string;
    httpStatus: number;
    httpMethod: string;
    url: string;
    traceId: string;
    timestamp: number;
  };
  errors: [
    {
      code: string;
      message: string;
      logs: string;
    },
  ];
}
