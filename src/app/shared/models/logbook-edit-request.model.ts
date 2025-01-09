export interface ILogbookEditRequest {
    logId: number,
    uploadReason?: string,
    changes: [
      {
        field?: string,
        newValue?: string
      }
    ]
}