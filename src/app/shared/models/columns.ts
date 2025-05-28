export interface Column {
  field: string;
  header: string;
  template?: any;
  isFilter?: boolean;
  filterType?: 'selectbox' | 'datepicker' | 'timeonly';
  filterOptions?: any[];
  sortable?: boolean;
}
