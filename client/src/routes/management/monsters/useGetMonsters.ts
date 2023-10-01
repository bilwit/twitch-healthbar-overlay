import { useState, useEffect } from 'react';

export interface Monster {
  id: number,
  created_at: Date,
  updated_at: Date,
  name: string,
  published: boolean,
  hp_multiplier: number,
  trigger_words?: string,
  avatar_url?: string,
}

interface ResponseData {
  success: boolean,
  data: Monster[],
  msg?: string,
}

function useGetMonsters(id?: string | null): { 
  isLoading: boolean,
  monsters: Monster[],
  setMonsters: React.Dispatch<React.SetStateAction<Monster[]>>,
  error: string, 
} {
  const [isLoading, setIsLoading] = useState(true);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const wrapDispatch = async () => {
      setIsLoading(true);
      try {
        const res: any = await fetch('/api/monsters' + (id ? '/' + id : ''), {
          method: 'GET',
        });
        if (res) {
          const responseJson: ResponseData = await res.json();
          if (responseJson.success) {
            setIsLoading(false);
            return setMonsters(responseJson.data.sort((a, b) => a.created_at < b.created_at ? -1 : 1));
          } 
        }
        throw true;
      } catch (e) {
        setIsLoading(false);
        setError('Could not load monsters');
      }
    }

    wrapDispatch();
  }, []);

  return {
    isLoading,
    monsters,
    setMonsters,
    error,
  };
}

export default useGetMonsters;