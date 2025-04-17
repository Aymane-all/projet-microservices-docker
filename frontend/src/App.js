import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Barre de navigation */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mon Projet</h1>
          <ul className="flex space-x-6">
            <li>
              <a href="#home" className="hover:text-blue-200 transition-colors">
                Accueil
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-blue-200 transition-colors">
                À propos
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-200 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Section principale */}
      <main className="flex-grow container mx-auto p-6">
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Bienvenue sur ma page
          </h2>
          <p className="text-gray-600 mb-4">
            Cette page utilise Tailwind CSS pour créer une interface moderne et
            responsive. Tu peux personnaliser les styles en modifiant les classes
            Tailwind ou en ajoutant tes propres configurations dans
            `tailwind.config.js`.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Cliquez ici
          </button>
        </section>

        {/* Grille d'exemples */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Carte 1</h3>
            <p className="text-gray-600">
              Une carte simple stylisée avec Tailwind CSS.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Carte 2</h3>
            <p className="text-gray-600">
              Ajoute du contenu ici pour personnaliser ta page.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Carte 3</h3>
            <p className="text-gray-600">
              Cette grille est responsive grâce à Tailwind.
            </p>
          </div>
        </section>
      </main>

      {/* Pied de page */}
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Mon Projet. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
