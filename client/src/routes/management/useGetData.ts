import { useState, useEffect } from 'react';

export interface HealthBar {
  id: number,
  created_at: Date,
  updated_at: Date,
  name: string,
  published: boolean,
  avatar_url?: string,
}

export interface Monster {
  id: number,
  created_at: Date,
  updated_at: Date,
  name: string,
  published: boolean,
  avatar_url?: string,
  hp_multiplier?: number,
  trigger_words?: string,
}

interface ResponseData {
  success: boolean,
  data: HealthBar[] | Monster[],
  msg?: string,
}

function useGetData(endpoint: string, id?: string | null): { 
  isLoading: boolean,
  data: HealthBar[] | Monster[],
  setData: React.Dispatch<React.SetStateAction<HealthBar[] | Monster[]>>,
  error: string, 
} {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<HealthBar[] | Monster[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const wrapDispatch = async () => {
      setIsLoading(true);
      try {
        const res: any = await fetch('/api/' + endpoint + (id ? '/' + id : ''), {
          method: 'GET',
        });
        if (res) {
          const responseJson: ResponseData = await res.json();
          if (responseJson.success) {
            setIsLoading(false);
            return setData(responseJson.data.sort((a, b) => a.created_at < b.created_at ? -1 : 1));
          } 
        }
        throw true;
      } catch (e) {
        setIsLoading(false);
        setError('Could not load healthbars');
      }
    }

    wrapDispatch();
  }, []);

  return {
    isLoading,
    data,
    setData,
    error,
  };
}

export default useGetData;