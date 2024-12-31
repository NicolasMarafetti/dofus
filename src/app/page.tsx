'use client';

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Titre principal */}
      <h1 className="text-5xl font-bold text-blue-500 mb-4">Dofus Leveling</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl">
        Optimisez la montée en niveau de vos métiers, gérez vos crafts, analysez vos ressources, 
        et trouvez les méthodes les plus rentables pour progresser.
      </p>
      
      {/* Section des fonctionnalités principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        
        {/* Lien vers les Crafts */}
        <Link href="/crafts">
          <div className="bg-white shadow-md rounded-lg p-6 hover:bg-blue-50 transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-blue-500">📦 Gestion des Crafts</h2>
            <p className="text-gray-600">Optimisez vos crafts avec les meilleures recettes disponibles.</p>
          </div>
        </Link>

        {/* Lien vers les Objets */}
        <Link href="/items">
          <div className="bg-white shadow-md rounded-lg p-6 hover:bg-blue-50 transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-blue-500">🛡️ Objets</h2>
            <p className="text-gray-600">Explorez et configurez les objets du jeu avec précision.</p>
          </div>
        </Link>

        {/* Lien vers l'Équipement */}
        <Link href="/equipement">
          <div className="bg-white shadow-md rounded-lg p-6 hover:bg-blue-50 transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-blue-500">⚔️ Équipement</h2>
            <p className="text-gray-600">Calculez le niveau moyen de votre équipement facilement.</p>
          </div>
        </Link>

        {/* Lien vers la Planification */}
        <Link href="/plan">
          <div className="bg-white shadow-md rounded-lg p-6 hover:bg-blue-50 transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-blue-500">📅 Planification</h2>
            <p className="text-gray-600">Planifiez vos montées de niveau et vos sessions de craft.</p>
          </div>
        </Link>

        {/* Lien vers les Monstres */}
        <Link href="/monsters">
          <div className="bg-white shadow-md rounded-lg p-6 hover:bg-blue-50 transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-blue-500">🐉 Monstres</h2>
            <p className="text-gray-600">Analysez les zones et les meilleurs spots de farm.</p>
          </div>
        </Link>

        {/* Lien vers les Zones */}
        <Link href="/zones">
          <div className="bg-white shadow-md rounded-lg p-6 hover:bg-blue-50 transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-blue-500">🌍 Zones</h2>
            <p className="text-gray-600">Analysez les zones et optimisez vos sessions de farm.</p>
          </div>
        </Link>

        {/* Lien vers la Puissance */}
        <Link href="/items/power">
          <div className="bg-white shadow-md rounded-lg p-6 hover:bg-blue-50 transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-blue-500">💪 Puissance des Objets</h2>
            <p className="text-gray-600">Classez les objets selon leur puissance pour votre niveau.</p>
          </div>
        </Link>
      </div>

      {/* Appel à l'action */}
      <div className="mt-12">
        <Link
          href="/crafts"
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
        >
          Commencer dès maintenant
        </Link>
      </div>
    </div>
  );
}
