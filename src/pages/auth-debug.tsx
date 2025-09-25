import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/auth';

interface DebugInfo {
  supabaseUrl: string;
  hasAnonKey: boolean;
  connectionStatus: 'checking' | 'connected' | 'failed';
  connectionError?: string;
  databaseTables?: string[];
  authUser?: any;
  session?: any;
}

const AuthDebugPage: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured',
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    connectionStatus: 'checking'
  });
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        setDebugInfo(prev => ({
          ...prev,
          connectionStatus: 'failed',
          connectionError: error.message
        }));
      } else {
        setDebugInfo(prev => ({
          ...prev,
          connectionStatus: 'connected'
        }));
      }

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!sessionError) {
        setDebugInfo(prev => ({ ...prev, session }));
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!userError) {
        setDebugInfo(prev => ({ ...prev, authUser: user }));
      }

    } catch (error: any) {
      setDebugInfo(prev => ({
        ...prev,
        connectionStatus: 'failed',
        connectionError: error.message
      }));
    }
  };

  const testSignUp = async () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'test123456';

    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword
      });

      setTestResults(prev => ({
        ...prev,
        signUp: { success: !error, data, error: error?.message }
      }));
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        signUp: { success: false, error: error.message }
      }));
    }
  };

  const testSignIn = async () => {
    const testEmail = 'test@example.com';
    const testPassword = 'test123456';

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      setTestResults(prev => ({
        ...prev,
        signIn: { success: !error, data, error: error?.message }
      }));
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        signIn: { success: false, error: error.message }
      }));
    }
  };

  const clearAuthStorage = async () => {
    try {
      await supabase.auth.signOut();
      // Clear local storage
      localStorage.clear();
      sessionStorage.clear();
      
      setTestResults(prev => ({
        ...prev,
        clearStorage: { success: true, message: 'Auth storage cleared' }
      }));

      // Refresh debug info
      setTimeout(() => {
        checkSupabaseConnection();
      }, 1000);
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        clearStorage: { success: false, error: error.message }
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <Layout
      title="Authentication Debug - Home21"
      description="Debug Supabase authentication configuration"
      showNavbar={false}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              Authentication Debug
            </h1>
            <p className="text-gray-400">
              Diagnose Supabase authentication issues
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">
                Configuration Status
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Supabase URL:</span>
                  <span className="text-sm font-mono bg-gray-700 px-2 py-1 rounded">
                    {debugInfo.supabaseUrl.substring(0, 50)}...
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Anonymous Key:</span>
                  <span className={debugInfo.hasAnonKey ? 'text-green-400' : 'text-red-400'}>
                    {debugInfo.hasAnonKey ? 'Configured' : 'Missing'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Connection:</span>
                  <span className={getStatusColor(debugInfo.connectionStatus)}>
                    {debugInfo.connectionStatus}
                  </span>
                </div>

                {debugInfo.connectionError && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded">
                    <p className="text-red-400 text-sm font-medium">Error:</p>
                    <p className="text-red-300 text-sm">{debugInfo.connectionError}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Session */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">
                Current Session
              </h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-gray-300 block mb-1">Session:</span>
                  <div className="bg-gray-700 p-2 rounded text-xs">
                    <pre className="text-gray-300 overflow-auto">
                      {JSON.stringify(debugInfo.session, null, 2)}
                    </pre>
                  </div>
                </div>

                <div>
                  <span className="text-gray-300 block mb-1">Auth User:</span>
                  <div className="bg-gray-700 p-2 rounded text-xs">
                    <pre className="text-gray-300 overflow-auto">
                      {JSON.stringify(debugInfo.authUser, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Actions */}
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Test Actions
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Button onClick={testSignUp} variant="secondary">
                Test Sign Up
              </Button>
              <Button onClick={testSignIn} variant="secondary">
                Test Sign In
              </Button>
              <Button onClick={clearAuthStorage} variant="outline">
                Clear Auth Storage
              </Button>
            </div>

            {/* Test Results */}
            {Object.keys(testResults).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-200">Test Results:</h3>
                {Object.entries(testResults).map(([key, result]: [string, any]) => (
                  <div key={key} className="bg-gray-700 p-3 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-200 capitalize">{key}:</span>
                      <span className={result.success ? 'text-green-400' : 'text-red-400'}>
                        {result.success ? 'Success' : 'Failed'}
                      </span>
                    </div>
                    {result.error && (
                      <p className="text-red-300 text-sm">{result.error}</p>
                    )}
                    {result.message && (
                      <p className="text-green-300 text-sm">{result.message}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Troubleshooting Guide */}
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Troubleshooting Guide
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-medium text-gray-200 mb-2">Common Issues:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Invalid Refresh Token: Clear browser storage and try signing in again</li>
                  <li>Database connection failed: Check if Supabase project is active</li>
                  <li>Missing environment variables: Ensure .env.local is configured</li>
                  <li>Table not found: Make sure database tables are created</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-200 mb-2">Quick Fixes:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Click "Clear Auth Storage" to reset authentication state</li>
                  <li>Check Supabase dashboard for project status</li>
                  <li>Verify RLS (Row Level Security) policies are set up correctly</li>
                  <li>Ensure authentication is enabled in Supabase settings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuthDebugPage;