import React from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Shield, Home, ArrowLeft, AlertTriangle } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  return (
    <Layout
      title="Pass21 - Accès non autorisé"
      description="Vous n'avez pas les permissions nécessaires pour accéder à cette page"
      showNavbar={false}
      showFooter={false}
    >
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="text-center shadow-xl border-0">
            <CardContent className="p-8">
              {/* Icon */}
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-10 h-10 text-red-600" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Accès non autorisé
              </h1>

              {/* Message */}
              <p className="text-gray-600 mb-6">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page. 
                Contactez votre administrateur si vous pensez qu'il s'agit d'une erreur.
              </p>

              {/* Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-700">
                    Cette tentative d'accès a été enregistrée
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => window.history.back()}
                  variant="primary"
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à la page précédente
                </Button>

                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Retour au tableau de bord
                  </Button>
                </Link>
              </div>

              {/* Support */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Besoin d'aide ?{' '}
                  <Link href="/contact" className="text-primary-600 hover:text-primary-500">
                    Contactez le support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UnauthorizedPage;