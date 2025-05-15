import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer les appels API avec état de chargement et d'erreur
 * @param {Function} fetchFunction - Fonction asynchrone qui effectue l'appel API
 * @param {Array} dependencies - Tableau de dépendances pour déclencher le rechargement
 * @param {boolean} immediate - Si true, l'appel API est effectué immédiatement
 * @param {any} initialData - Données initiales avant le chargement
 * @returns {Object} - { data, loading, error, refetch, setData }
 */
const useFetch = (fetchFunction, dependencies = [], immediate = true, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [...dependencies, execute]);

  return { data, loading, error, refetch: execute, setData };
};

export default useFetch;
