import { useCallback, useEffect, useState } from 'react';
import { EMPTY_DATA, loadData, saveData } from '../lib/storage';
import type { AppData } from '../lib/types';

export function useAppData() {
  const [data, setData] = useState<AppData>(EMPTY_DATA);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadData().then((d) => {
      setData(d);
      setLoaded(true);
    });
  }, []);

  const update = useCallback((fn: (d: AppData) => AppData) => {
    setData((prev) => {
      const next = fn(prev);
      void saveData(next);
      return next;
    });
  }, []);

  return { data, loaded, update };
}
