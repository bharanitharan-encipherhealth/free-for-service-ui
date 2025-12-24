export interface RegularButtonType {
  type: string;
  name: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  width: string;
  method?: string;
  disabled: boolean;
  htmlType?: string;
  padding?: string;
  height?: string;
  loading?: boolean;
}
