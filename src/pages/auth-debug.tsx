import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { AuthService } from '@/services/apiService';
import { ProductionServices } from '@/services/supabaseService';

interface DebugResult {
  step: string;
  success: boolean;
  data?: any;
  error?: string;
}

export default function AuthDebugPage() {
  const [email, setEmail] = useState('sylvain.pater.lafages@gmail.com');
  const [password, setPassword] = useState('');
  const [debugResults, setDebugResults] = useState<DebugResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: DebugResult) => {
    setDebugResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setDebugResults([]);
  };

  const runDiagnostic = async () => {
    if (!email || !password) {
      alert('Veuillez saisir email et mot de passe');
      return;
    }

    setIsLoading(true);
    clearResults();

    try {
      // Test 1: Configuration Supabase
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        addResult({
          step: '1. Configuration Supabase',
          success: !!(url && key),
          data: {
            hasUrl: !!url,
            hasKey: !!key,
            urlStart: url?.substring(0, 30) + '...'
          }
        });
      } catch (error: any) {
        addResult({
          step: '1. Configuration Supabase',
          success: false,
          error: error.message
        });
      }

      // Test 2: Connexion directe Supabase
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        addResult({
          step: '2. Authentification Supabase directe',
          success: !authError && !!authData.user,
          data: authData.user ? {
            id: authData.user.id,
            email: authData.user.email,
            confirmed_at: authData.user.email_confirmed_at,
            last_sign_in: authData.user.last_sign_in_at
          } : null,
          error: authError?.message
        });

        // Si la connexion Supabase fonctionne, test suivant
        if (!authError && authData.user) {
          // Test 3: Vérifier l'utilisateur dans la table users
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          addResult({
            step: '3. Recherche utilisateur en BDD',
            success: !userError && !!userData,
            data: userData,
            error: userError?.message
          });

          // Test 4: Si pas d'utilisateur, essayer de le créer
          if (userError && userError.code === 'PGRST116') { // Not found
            const newUserData = {
              id: authData.user.id,
              email: authData.user.email!,
              name: authData.user.email!.split('@')[0],
              role: 'RESIDENT' as const,
            };

            const { data: createdUser, error: createError } = await supabase
              .from('users')
              .insert([newUserData])
              .select()
              .single();

            addResult({
              step: '4. Création utilisateur en BDD',
              success: !createError && !!createdUser,
              data: createdUser,
              error: createError?.message
            });
          }
        }
      } catch (error: any) {
        addResult({
          step: '2. Authentification Supabase directe',
          success: false,
          error: error.message
        });
      }

      // Test 5: Service auth legacy
      try {
        const legacyResult = await auth.signIn(email, password);
        addResult({
          step: '5. Service Auth Legacy',
          success: !!legacyResult,
          data: {
            hasUser: !!legacyResult.user,
            hasSession: !!legacyResult.session
          }
        });
      } catch (error: any) {
        addResult({
          step: '5. Service Auth Legacy',
          success: false,
          error: error.message
        });
      }

      // Test 6: Service API Production
      try {
        const prodResult = await ProductionServices.Auth.login(email, password);
        addResult({
          step: '6. Service Production',
          success: !!prodResult,
          data: prodResult
        });
      } catch (error: any) {
        addResult({
          step: '6. Service Production',
          success: false,
          error: error.message
        });
      }

      // Test 7: Service API (utilisé par useAuth)
      try {
        const apiResult = await AuthService.login(email, password);
        addResult({
          step: '7. Service API (useAuth)',
          success: !!apiResult,
          data: apiResult
        });
      } catch (error: any) {
        addResult({
          step: '7. Service API (useAuth)',
          success: false,
          error: error.message
        });
      }

      // Test 8: Vérifier l'environnement
      const env = {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
        NEXT_PUBLIC_SHOW_MOCK_DATA: process.env.NEXT_PUBLIC_SHOW_MOCK_DATA
      };

      addResult({
        step: '8. Variables d\'environnement',
        success: true,
        data: env
      });

    } finally {
      setIsLoading(false);
    }
  };

  const testNewUser = async () => {
    if (!email || !password) {
      alert('Veuillez saisir email et mot de passe');
      return;
    }

    setIsLoading(true);
    clearResults();

    try {
      // Créer un nouvel utilisateur dans Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      addResult({
        step: 'Création compte Supabase Auth',
        success: !signUpError,
        data: signUpData,
        error: signUpError?.message
      });

      if (!signUpError && signUpData.user) {
        // Créer l'entrée dans la table users
        const userData = {
          id: signUpData.user.id,
          email: signUpData.user.email!,
          name: email.split('@')[0],
          role: 'RESIDENT' as const,
        };

        const { data: userCreated, error: userError } = await supabase
          .from('users')
          .insert([userData])
          .select()
          .single();

        addResult({
          step: 'Création profil utilisateur',
          success: !userError,
          data: userCreated,
          error: userError?.message
        });
      }
    } catch (error: any) {
      addResult({
        step: 'Erreur générale création',
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          🔧 Diagnostic Authentification
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test de connexion</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={runDiagnostic}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? '🔄 Test en cours...' : '🔍 Lancer diagnostic complet'}
            </button>
            
            <button
              onClick={testNewUser}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              👤 Créer utilisateur test
            </button>
            
            <button
              onClick={clearResults}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              🗑️ Effacer
            </button>
          </div>
        </div>

        {/* Résultats */}
        {debugResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Résultats du diagnostic</h2>
            
            <div className="space-y-4">
              {debugResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {result.success ? '✅' : '❌'} {result.step}
                    </h3>
                  </div>
                  
                  {result.error && (
                    <div className="text-red-600 text-sm mb-2">
                      <strong>Erreur:</strong> {result.error}
                    </div>
                  )}
                  
                  {result.data && (
                    <details className="text-sm">
                      <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                        Voir détails
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}