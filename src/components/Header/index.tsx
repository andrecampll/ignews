import styles from './styles.module.scss';
import { Button } from '../Button';
import { ActiveLink } from '../ActiveLink';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div  className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ignews logo" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>        
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts" prefetch>        
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <Button />
      </div>
    </header>
  );
}