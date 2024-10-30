export interface LayoutMenuItem {
  label: string;
  icon: string;
  items?: LayoutMenuItem[];
  path?: string;
}
