export interface Column {
  field: string;
  header: string;
  template?: any;
  isFilter?: boolean;
  filterType?: string;
  filterOptions?: any[];
}
