export interface IPopupConfirmProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onConfirm: () => void;
  message: string;
  ok?: string;
  cancel?: string;
}
