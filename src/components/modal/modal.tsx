import { FC, memo, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

const MODAL_ROOT_ID = 'modals';
const ESC_KEY = 'Escape';

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === ESC_KEY) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const modalRoot = document.getElementById(MODAL_ROOT_ID);

  if (!modalRoot) {
    console.error(`Modal root element with id "${MODAL_ROOT_ID}" not found`);
    return null;
  }

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot
  );
});

Modal.displayName = 'Modal';
