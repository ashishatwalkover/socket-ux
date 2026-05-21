export type MasterItem = {
  id: string;
  label: string;
  badge: string;
  badgeBg: string;
  badgeFg: string;
};

export type PanelProps = {
  item: MasterItem;
  onClose: () => void;
};
