import { useCallback } from 'react';
import { signIn, useSession } from 'next-auth/client';
import styles from './styles.module.scss';

export type SubscribeButtonProps = {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [ session ] = useSession();

  const handleSubscribe = useCallback(() => {
    if(!session) {
      signIn('github');
      return;
    }

    
  }, [session, signIn]);

  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
}