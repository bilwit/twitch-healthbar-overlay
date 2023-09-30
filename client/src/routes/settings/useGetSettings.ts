import { useState, useEffect } from 'react';

export interface Settings {
  id?: number,
  listener_auth_code: string,
  listener_client_id: string,
  listener_secret: string,
  listener_user_name: string,
  channel_name: string,
  is_connected?: boolean,
}

function useGetSettings(): { 
  isLoading: boolean,
  settings: Settings | undefined,
  error: string, 
} {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | undefined>();
  const [error, setError] = useState('');

  useEffect(() => {
    const wrapDispatch = async () => {
      try {
        const res: any = await fetch('/api/settings', {
          method: 'GET',
        });
        if (res) {
          const responseJson = await res.json();
          if (responseJson.success) {
            setIsLoading(false);
            return setSettings(responseJson.data);
          } 
        }
        throw true;
      } catch (e) {
        setIsLoading(false);
        setError('Could not load settings');
      }
    }

    wrapDispatch();
  }, []);

  return { 
    isLoading,
    settings,
    error,
  };
}

export default useGetSettings;