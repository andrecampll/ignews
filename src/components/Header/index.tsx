import styles from './styles.module.scss';
import { Button } from '../Button';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div  className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ignews logo" />
        <nav>
          <a href="/" className={styles.active}>Home</a>
          <a href="/posts">Posts</a>
        </nav>

        <Button />
      </div>
    </header>
  );
}