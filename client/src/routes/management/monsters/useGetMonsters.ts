import { useState, useEffect } from 'react';

export interface Monster {
  id: number,
  created_at: Date,
  updated_at?: Date,
  name: string,
  published: boolean,
  hp_multiplier: number,
  trigger_words?: string,
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
          const responseJson = await res.json();
          if (responseJson.success) {
            setIsLoading(false);
            return setMonsters(responseJson.data);
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