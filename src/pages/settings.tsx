import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatsCard } from '@/components/ui';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { Resource } from '@/utils/permissions';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Palette,
  Globe,
  Save,
  RefreshCw
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    // Paramètres généraux
    facilityName: 'Résidence Pass21',
    facilityAddress: '123 Rue de la Paix, 75001 Paris',
    facilityPhone: '+33 1 23 45 67 89',
    facilityEmail: 'contact@pass21.fr',
    timezone: 'Europe/Paris',
    language: 'fr',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    maintenanceAlerts: true,
    emergencyAlerts: true,
    
    // Sécurité
    requireTwoFactor: false,
    sessionTimeout: 120, // minutes
    passwordComplexity: 'medium',
    allowedIPRanges: '',
    
    // Interface
    theme: 'light',
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR',
    
    // Système
    backupFrequency: 'daily',
    maintenanceWindow: '02:00',
    logRetention: 90 // days
  });

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement settings save
    console.log('Saving settings:', settings);
  };

  const handleReset = () => {
    // TODO: Reset to default settings
    console.log('Resetting settings to defaults');
  };

  return (
    <ProtectedPage requiredPage="/settings">
      <Layout
        title="Pass21 - Paramètres"
        description="Configuration et paramètres du système"
        showNavbar={true}
        showFooter={false}
      >
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                  <p className="text-gray-600 mt-1">
                    Configuration et paramètres du système Pass21
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="inline-flex items-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réinitialiser
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="inline-flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </div>
            </div>
          </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Utilisateurs Actifs"
              value="24"
              icon={<User className="w-6 h-6" />}
              color="blue"
            />
            
            <StatsCard
              title="Notifications Envoyées"
              value="156"
              icon={<Bell className="w-6 h-6" />}
              color="green"
            />
            
            <StatsCard
              title="Dernière Sauvegarde"
              value="2h ago"
              icon={<Database className="w-6 h-6" />}
              color="purple"
            />
            
            <StatsCard
              title="Niveau Sécurité"
              value="Élevé"
              icon={<Shield className="w-6 h-6" />}
              color="yellow"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Paramètres Généraux */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Paramètres Généraux
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Nom de l'établissement"
                  value={settings.facilityName}
                  onChange={(e) => handleInputChange('facilityName', e.target.value)}
                />
                
                <Input
                  label="Adresse"
                  value={settings.facilityAddress}
                  onChange={(e) => handleInputChange('facilityAddress', e.target.value)}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Téléphone"
                    value={settings.facilityPhone}
                    onChange={(e) => handleInputChange('facilityPhone', e.target.value)}
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    value={settings.facilityEmail}
                    onChange={(e) => handleInputChange('facilityEmail', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuseau horaire
                    </label>
                    <Select
                      value={settings.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                    >
                      <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                      <option value="Europe/London">Europe/London (GMT+0)</option>
                      <option value="America/New_York">America/New_York (GMT-5)</option>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Langue
                    </label>
                    <Select
                      value={settings.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Checkbox
                  checked={settings.emailNotifications}
                  onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  label="Notifications par email"
                  description="Recevoir les notifications importantes par email"
                />
                
                <Checkbox
                  checked={settings.smsNotifications}
                  onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                  label="Notifications SMS"
                  description="Recevoir les alertes urgentes par SMS"
                />
                
                <Checkbox
                  checked={settings.pushNotifications}
                  onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                  label="Notifications push"
                  description="Notifications dans le navigateur"
                />
                
                <Checkbox
                  checked={settings.maintenanceAlerts}
                  onChange={(e) => handleInputChange('maintenanceAlerts', e.target.checked)}
                  label="Alertes de maintenance"
                  description="Notifications pour les opérations de maintenance"
                />
                
                <Checkbox
                  checked={settings.emergencyAlerts}
                  onChange={(e) => handleInputChange('emergencyAlerts', e.target.checked)}
                  label="Alertes d'urgence"
                  description="Notifications critiques et situations d'urgence"
                />
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Checkbox
                  checked={settings.requireTwoFactor}
                  onChange={(e) => handleInputChange('requireTwoFactor', e.target.checked)}
                  label="Authentification à deux facteurs obligatoire"
                  description="Exiger la 2FA pour tous les utilisateurs"
                />
                
                <Input
                  label="Délai d'expiration de session (minutes)"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complexité des mots de passe
                  </label>
                  <Select
                    value={settings.passwordComplexity}
                    onChange={(e) => handleInputChange('passwordComplexity', e.target.value)}
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                  </Select>
                </div>
                
                <Input
                  label="Plages IP autorisées (optionnel)"
                  value={settings.allowedIPRanges}
                  onChange={(e) => handleInputChange('allowedIPRanges', e.target.value)}
                  placeholder="192.168.1.0/24, 10.0.0.0/8"
                />
              </CardContent>
            </Card>

            {/* Interface & Préférences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Interface & Préférences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thème
                  </label>
                  <Select
                    value={settings.theme}
                    onChange={(e) => handleInputChange('theme', e.target.value)}
                  >
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                    <option value="auto">Automatique</option>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Format de date
                    </label>
                    <Select
                      value={settings.dateFormat}
                      onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Devise
                    </label>
                    <Select
                      value={settings.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    >
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollar ($)</option>
                      <option value="GBP">Livre (£)</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Paramètres Système */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Paramètres Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fréquence de sauvegarde
                  </label>
                  <Select
                    value={settings.backupFrequency}
                    onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                  >
                    <option value="hourly">Toutes les heures</option>
                    <option value="daily">Quotidienne</option>
                    <option value="weekly">Hebdomadaire</option>
                  </Select>
                </div>
                
                <Input
                  label="Fenêtre de maintenance"
                  type="time"
                  value={settings.maintenanceWindow}
                  onChange={(e) => handleInputChange('maintenanceWindow', e.target.value)}
                />
                
                <Input
                  label="Rétention des logs (jours)"
                  type="number"
                  value={settings.logRetention}
                  onChange={(e) => handleInputChange('logRetention', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </main>
        </div>
      </Layout>
    </ProtectedPage>
  );
};

export default SettingsPage;
