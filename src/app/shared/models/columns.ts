export interface Column {
  field: string;
  header: string;
  template?: any;
  isFilter?: boolean;
  filterType?: 'selectbox' | 'datepicker';
  filterOptions?: any[];
  sortable?: boolean;
}
