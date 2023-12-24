import { useState, useEffect } from 'react';

export interface HealthBar {
  id: number,
  created_at: Date,
  updated_at: Date,
  name: string,
  published: boolean,
  avatar_url?: string,
}

export interface Stage {
  id: number,
  hp_value: number,
  avatar_url?: string,
  ref_id: string,
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
  bar_theme?: string,
  relations_id?: number,
}

interface ResponseData {
  success: boolean,
  data: any[],
  msg?: string,
}

function useGetData(endpoint: string, id?: string | null): { 
  isLoading: boolean,
  data: any[],
  setData: React.Dispatch<React.SetStateAction<any[]>>,
  error: string, 
  setError?: React.Dispatch<React.SetStateAction<string>>,
} {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
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
            return setData(responseJson.data.sort((a, b) => ('created_at' in a && 'created_at' in b) ? a.created_at < b.created_at ? -1 : 1 : 1));
          } 
        }
        throw true;
      } catch (e) {
        setIsLoading(false);
        setError('Could not load data');
      }
    }

    wrapDispatch();
  }, []);

  return {
    isLoading,
    data,
    setData,
    error,
    setError,
  };
}

export default useGetData;