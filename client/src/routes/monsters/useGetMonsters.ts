import { useState, useEffect } from 'react';

interface Monster {
  id: number,
  created_at: Date,
  updated_at: Date,
  name: string,
  published: boolean,
  hp_multiplier: number,
  trigger_words: string,
}

function useGetMonsters(): { 
  monsters: Monster[],
  error: string, 
} {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const wrapDispatch = async () => {
      const res: any = await fetch('/api/monsters', {
        method: 'GET',
      });
      if (res) {
        console.log(res);
        setMonsters([]);
      } else {
        setError('Could not load monsters');
      }
    }

    wrapDispatch();
  }, []);

  return { 
    monsters,
    error,
  };
}

export default useGetMonsters;