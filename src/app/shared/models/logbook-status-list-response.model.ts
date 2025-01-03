export interface ILogbookStatusListResponse {
  statuses: ('APPROVED' | 'REASSIGNED' | 'REJECTED' | 'WAITING_APPROVAL')[];
}
