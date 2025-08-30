import styles from './modal-overlay.module.css';
import { selectors } from '../../../../cypress/e2e/cypressSelectors';

export const ModalOverlayUI = ({ onClick }: { onClick: () => void }) => (
  <div
    className={styles.overlay}
    onClick={onClick}
    data-cy={selectors.modalOverlay}
  />
);
