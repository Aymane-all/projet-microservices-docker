import axios from 'axios';
import toast from 'react-hot-toast';

// Configuration pour les APIs externes
const EXTERNAL_APIS = {
  // API pour les informations médicales
  healthInfo: {
    baseURL: 'https://health.gov/myhealthfinder/api/v3',
    apiKey: null // Pas besoin de clé API pour cette API
  },
  // API pour les médicaments (exemple)
  medications: {
    baseURL: 'https://rxnav.nlm.nih.gov/REST/rxcui',
    apiKey: null // Pas besoin de clé API pour cette API
  },
  // API pour les actualités médicales
  medicalNews: {
    baseURL: 'https://newsapi.org/v2',
    apiKey: null // À remplacer par votre clé API si vous en avez une
  }
};

// Création des instances axios pour chaque API externe
const createExternalApiInstance = (config) => {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Intercepteur pour ajouter la clé API si nécessaire
  instance.interceptors.request.use(
    (config) => {
      if (config.apiKey) {
        // Selon l'API, la clé peut être ajoutée de différentes façons
        // Exemple pour les headers
        config.headers['X-Api-Key'] = config.apiKey;
        // Exemple pour les paramètres de requête
        config.params = { ...config.params, apiKey: config.apiKey };
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Intercepteur pour gérer les erreurs
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { response } = error;
      
      if (response) {
        console.error('External API error:', response.status, response.data);
        toast.error('Erreur lors de la récupération des données externes');
      } else if (error.request) {
        console.error('External API request error:', error.request);
        toast.error('Impossible de joindre le service externe');
      } else {
        console.error('External API setup error:', error.message);
        toast.error('Erreur de configuration de la requête externe');
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Création des instances API
const healthInfoApi = createExternalApiInstance(EXTERNAL_APIS.healthInfo);
const medicationsApi = createExternalApiInstance(EXTERNAL_APIS.medications);
const medicalNewsApi = createExternalApiInstance(EXTERNAL_APIS.medicalNews);

// Service API externe
const externalApiService = {
  // Méthodes pour l'API d'informations médicales
  healthInfo: {
    // Récupérer des conseils de santé par catégorie
    getHealthTips: async (category) => {
      try {
        const response = await healthInfoApi.get('/topicsearch.json', {
          params: { categoryId: category }
        });
        return response.data.Result.Resources.Resource || [];
      } catch (error) {
        console.error('Error fetching health tips:', error);
        return [];
      }
    },
    
    // Récupérer des informations de santé personnalisées
    getPersonalizedInfo: async (age, gender, pregnant = false) => {
      try {
        const response = await healthInfoApi.get('/myhealthfinder.json', {
          params: { age, gender, pregnant: pregnant ? 'true' : 'false' }
        });
        return response.data.Result.Resources.Resource || [];
      } catch (error) {
        console.error('Error fetching personalized health info:', error);
        return [];
      }
    }
  },
  
  // Méthodes pour l'API de médicaments
  medications: {
    // Rechercher un médicament par nom
    searchMedication: async (name) => {
      try {
        const response = await medicationsApi.get('/search', {
          params: { name }
        });
        return response.data.rxnormdata.idGroup || { rxnormId: [], name: name };
      } catch (error) {
        console.error('Error searching medication:', error);
        return { rxnormId: [], name: name };
      }
    },
    
    // Obtenir des informations sur un médicament par ID
    getMedicationInfo: async (rxcui) => {
      try {
        const response = await medicationsApi.get(`/${rxcui}/allrelated`);
        return response.data.relatedGroup.conceptGroup || [];
      } catch (error) {
        console.error('Error fetching medication info:', error);
        return [];
      }
    }
  },
  
  // Méthodes pour l'API d'actualités médicales
  medicalNews: {
    // Récupérer les dernières actualités médicales
    getLatestNews: async (count = 5) => {
      // Si vous n'avez pas de clé API, utilisez des données fictives
      if (!EXTERNAL_APIS.medicalNews.apiKey) {
        return getMockMedicalNews(count);
      }
      
      try {
        const response = await medicalNewsApi.get('/top-headlines', {
          params: {
            category: 'health',
            pageSize: count,
            language: 'fr',
            apiKey: EXTERNAL_APIS.medicalNews.apiKey
          }
        });
        return response.data.articles || [];
      } catch (error) {
        console.error('Error fetching medical news:', error);
        return getMockMedicalNews(count);
      }
    },
    
    // Rechercher des actualités médicales par mot-clé
    searchNews: async (query, count = 10) => {
      // Si vous n'avez pas de clé API, utilisez des données fictives
      if (!EXTERNAL_APIS.medicalNews.apiKey) {
        return getMockMedicalNews(count, query);
      }
      
      try {
        const response = await medicalNewsApi.get('/everything', {
          params: {
            q: query,
            pageSize: count,
            language: 'fr',
            apiKey: EXTERNAL_APIS.medicalNews.apiKey
          }
        });
        return response.data.articles || [];
      } catch (error) {
        console.error('Error searching medical news:', error);
        return getMockMedicalNews(count, query);
      }
    }
  }
};

// Fonction pour générer des données fictives d'actualités médicales
const getMockMedicalNews = (count = 5, query = '') => {
  const mockNews = [
    {
      title: 'Nouvelles avancées dans le traitement du diabète',
      description: 'Des chercheurs ont découvert une nouvelle approche pour traiter le diabète de type 2.',
      url: '#',
      urlToImage: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg',
      publishedAt: '2025-05-10T08:30:00Z',
      source: { name: 'Santé Magazine' }
    },
    {
      title: 'Les bienfaits de la méditation sur la santé mentale',
      description: 'Une étude révèle que 15 minutes de méditation quotidienne peuvent réduire significativement le stress.',
      url: '#',
      urlToImage: 'https://images.pexels.com/photos/3759661/pexels-photo-3759661.jpeg',
      publishedAt: '2025-05-09T14:45:00Z',
      source: { name: 'Psychologie Santé' }
    },
    {
      title: 'Vaccination: campagne nationale pour les personnes âgées',
      description: 'Le ministère de la santé lance une nouvelle campagne de vaccination pour les plus de 65 ans.',
      url: '#',
      urlToImage: 'https://images.pexels.com/photos/5863366/pexels-photo-5863366.jpeg',
      publishedAt: '2025-05-08T10:15:00Z',
      source: { name: 'Info Santé' }
    },
    {
      title: 'Alimentation: les superaliments à intégrer dans votre régime',
      description: 'Découvrez les aliments aux propriétés nutritionnelles exceptionnelles pour améliorer votre santé.',
      url: '#',
      urlToImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      publishedAt: '2025-05-07T16:20:00Z',
      source: { name: 'Nutrition Santé' }
    },
    {
      title: 'Sommeil: comment améliorer sa qualité pour une meilleure santé',
      description: 'Les experts partagent leurs conseils pour un sommeil réparateur et ses impacts sur la santé globale.',
      url: '#',
      urlToImage: 'https://images.pexels.com/photos/6551055/pexels-photo-6551055.jpeg',
      publishedAt: '2025-05-06T09:40:00Z',
      source: { name: 'Bien-être Magazine' }
    },
    {
      title: 'Exercice physique: 30 minutes par jour suffisent pour rester en forme',
      description: 'Une nouvelle étude confirme queune activité physique modérée quotidienne améliore significativement la santé.',
      url: '#',
      urlToImage: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg',
      publishedAt: '2025-05-05T11:30:00Z',
      source: { name: 'Sport & Santé' }
    },
    {
      title: 'Santé cardiaque: les aliments à privilégier pour un cœur en bonne santé',
      description: 'Les cardiologues recommandent ces aliments pour maintenir une bonne santé cardiovasculaire.',
      url: '#',
      urlToImage: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
      publishedAt: '2025-05-04T13:15:00Z',
      source: { name: 'Cœur & Santé' }
    }
  ];
  
  // Filtrer par requête si fournie
  const filteredNews = query 
    ? mockNews.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) || 
        article.description.toLowerCase().includes(query.toLowerCase())
      )
    : mockNews;
  
  // Retourner le nombre demandé d'articles
  return filteredNews.slice(0, count);
};

export default externalApiService;
