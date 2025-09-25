import React from 'react';

const DebugAuthPage: React.FC = () => {
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
    currentPath: typeof window !== 'undefined' ? window.location.pathname : 'Server-side',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server-side',
    timestamp: new Date().toISOString()
  };

  const clearAllStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      // Clear specific Supabase keys
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      alert('Stockage vidé ! Rechargez la page.');
    }
  };

  const forceRedirect = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1a1a1a', 
      color: 'white', 
      padding: '20px',
      fontFamily: 'monospace'
    }}>
      <h1>🔧 Debug Auth - Production</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>📊 Environment Info:</h2>
        <pre style={{ background: '#333', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(envInfo, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>🎯 Actions:</h2>
        <button 
          onClick={clearAllStorage}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Vider tout le stockage
        </button>
        <button 
          onClick={forceRedirect}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4444ff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Forcer redirection login
        </button>
      </div>

      <div>
        <h2>ℹ️ Instructions:</h2>
        <ol style={{ lineHeight: '1.6' }}>
          <li>Vérifiez les logs de la console (F12)</li>
          <li>Cliquez sur "Vider tout le stockage" pour nettoyer le cache</li>
          <li>Essayez de naviguer vers /login ou /dashboard</li>
          <li>Si ça ne marche pas, contactez le développeur avec ces infos</li>
        </ol>
      </div>

      <div style={{ marginTop: '40px', padding: '10px', background: '#333', borderRadius: '5px' }}>
        <p><strong>URL Actuelle:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
        <p><strong>Protection Auth:</strong> ❌ DÉSACTIVÉE</p>
        <p><strong>Status:</strong> Cette page devrait être accessible en production</p>
      </div>
    </div>
  );
};

export default DebugAuthPage;