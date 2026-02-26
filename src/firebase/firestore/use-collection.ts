'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, Query, QuerySnapshot, FirestoreError, DocumentData } from 'firebase/firestore';

export function useCollection<T = DocumentData>(query: Query | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [snapshot, setSnapshot] = useState<QuerySnapshot | null>(null);

  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        setSnapshot(snapshot);
        const items: T[] = [];
        snapshot.forEach((doc) => {
          items.push({ ...doc.data(), id: doc.id } as T);
        });
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error, snapshot };
}
