import { useEffect, useRef } from 'react';

export function useWakeLock(enabled: boolean) {
  const wakeLockRef =
    useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const requestWakeLock = async () => {
      if (!('wakeLock' in navigator)) {
        console.warn(
          'Screen Wake Lock is not supported.'
        );
        return;
      }

      try {
        wakeLockRef.current =
          await navigator.wakeLock.request('screen');

        console.log('Screen wake lock active');
      } catch (error) {
        console.warn(
          'Could not acquire screen wake lock:',
          error
        );
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        !wakeLockRef.current
      ) {
        requestWakeLock();
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );

      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, [enabled]);
}