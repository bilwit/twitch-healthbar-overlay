import { useState, useEffect } from 'react';

interface Settings {
  id: number,
  listener_auth_code: string,
  listener_client_id: string,
  listener_secret: string,
  listener_user_name: string,
  channel_name: string,
  is_connected: boolean,
}

function useGetSettings(): { 
  settings: Settings | undefined,
  error: string, 
} {
  const [settings, setSettings] = useState<Settings | undefined>();
  const [error, setError] = useState('');

  useEffect(() => {
    const wrapDispatch = async () => {
      const res: any = await fetch('api/settings', {
        method: 'GET',
      });
      if (res) {
        console.log(res);
        setSettings(undefined);
      } else {
        setError('');
      }
    }

    wrapDispatch();
  }, []);

  return { 
    settings,
    error,
  };
}

export default useGetSettings;