import { useCallback } from 'react';
import { signIn, useSession } from 'next-auth/client';
import styles from './styles.module.scss';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

export type SubscribeButtonProps = {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [ session ] = useSession();

  const handleSubscribe = useCallback(async () => {
    if(!session) {
      signIn('github');
      return;
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({
        sessionId,
      });
    } catch(err) {
      alert(err.message);
    }
  }, [session, signIn]);

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}