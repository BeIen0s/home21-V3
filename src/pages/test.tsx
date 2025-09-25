import React from 'react';

// Page ultra-simple pour tester sans dépendances
export default function TestPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000', 
      color: '#00ff00', 
      padding: '20px',
      fontFamily: 'monospace',
      fontSize: '18px'
    }}>
      <h1>✅ TEST PAGE - PRODUCTION</h1>
      <p>Si vous voyez cette page, le système fonctionne !</p>
      <p>Timestamp: {new Date().toISOString()}</p>
      <p>URL: {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
      
      <div style={{ marginTop: '40px' }}>
        <h2>🔗 Navigation Test:</h2>
        <a href="/login" style={{ color: '#00ff00', marginRight: '20px' }}>→ Login</a>
        <a href="/dashboard" style={{ color: '#00ff00', marginRight: '20px' }}>→ Dashboard</a>
        <a href="/" style={{ color: '#00ff00' }}>→ Home</a>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>🎯 Status:</h2>
        <p>✅ Page accessible</p>
        <p>✅ Pas de vérification d'auth</p>
        <p>✅ Navigation libre</p>
      </div>
    </div>
  );
}