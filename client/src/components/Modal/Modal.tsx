import { type PropsWithChildren, ReactNode } from 'react';
import styles from './Modal.module.scss';

type ModalProps = PropsWithChildren<{
  open: boolean;
  title?: string;
  onClose: () => void;
  actions?: ReactNode;
}>;

const Modal = ({ open, title, onClose, actions, children }: ModalProps) => {
  if (!open) return null;
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.content}>
        {(title || onClose) && (
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            <button className={styles.close} onClick={onClose} type="button">
              ✕
            </button>
          </div>
        )}
        <div>{children}</div>
        {actions}
      </div>
    </div>
  );
};

export default Modal;
