import React from 'react';
import Link from 'next/link';

const DebugPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug - Routes Pass21</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pages disponibles :</h2>
          <div className="space-y-2">
            <div>
              <Link href="/" className="text-blue-600 hover:underline">
                / (Homepage - redirige vers dashboard)
              </Link>
            </div>
            <div>
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                /dashboard (Dashboard Pass21)
              </Link>
            </div>
            <div>
              <Link href="/debug" className="text-blue-600 hover:underline">
                /debug (Cette page)
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Navigation :</h2>
          <div className="flex space-x-4">
            <Link href="/dashboard">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Aller au Dashboard
              </button>
            </Link>
            <Link href="/">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Retour Accueil
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Note de débogage :</h3>
          <p className="text-yellow-700 text-sm">
            Cette page aide à tester les routes Next.js. Si vous voyez cette page, 
            cela signifie que le routage fonctionne correctement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;