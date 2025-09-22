# Home21-V3 Design System

## 🎨 Vue d'ensemble

Ce document définit le système de design cohérent pour l'application Home21-V3, garantissant une expérience utilisateur fluide et professionnelle.

## ✨ Principes de design

### 1. **Cohérence**
- Actions similaires produisent des résultats similaires
- Même interface = même comportement attendu
- Uniformité dans tous les composants

### 2. **Prévisibilité**  
- États visuels clairs pour tous les éléments interactifs
- Feedbacks visuels cohérents
- Transitions harmonieuses

### 3. **Accessibilité**
- Support des technologies d'assistance
- Contrastes conformes aux standards
- Navigation au clavier

## 🧩 Composants standardisés

### Button
```tsx
import { Button } from '@/components/ui/Button';

// Variants disponibles
<Button variant="primary">Action principale</Button>
<Button variant="secondary">Action secondaire</Button>
<Button variant="outline">Bouton contour</Button>
<Button variant="ghost">Bouton transparent</Button>
<Button variant="success">Succès</Button>
<Button variant="warning">Attention</Button>
<Button variant="error">Erreur</Button>
<Button variant="info">Information</Button>

// Tailles disponibles
<Button size="xs">Extra petit</Button>
<Button size="sm">Petit</Button>
<Button size="md">Moyen (défaut)</Button>
<Button size="lg">Grand</Button>
<Button size="xl">Extra grand</Button>

// États
<Button disabled>Désactivé</Button>
<Button loading>En cours...</Button>
```

### Input
```tsx
import { Input } from '@/components/ui/Input';

<Input 
  label="Nom d'utilisateur"
  placeholder="Saisissez votre nom"
  required
  error="Ce champ est requis"
  helper="Texte d'aide"
/>
```

### Select
```tsx
import { Select } from '@/components/ui/Select';

<Select 
  label="Département"
  placeholder="Choisissez un département"
  options={[
    { value: 'admin', label: 'Administration' },
    { value: 'soins', label: 'Soins' }
  ]}
  error="Sélection requise"
/>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent, StatsCard } from '@/components/ui/Card';

// Card basique
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Titre de la carte</CardTitle>
  </CardHeader>
  <CardContent>
    Contenu de la carte
  </CardContent>
</Card>

// Card de statistiques  
<StatsCard
  title="Total utilisateurs"
  value={42}
  icon={<UsersIcon className="w-6 h-6" />}
  color="blue"
  trend={{ value: 12, direction: 'up' }}
/>
```

### ConfirmDialog
```tsx
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';

const { confirm, ConfirmDialog } = useConfirmDialog();

// Usage
const handleDelete = () => {
  confirm({
    title: 'Supprimer l\'élément',
    message: 'Cette action est irréversible.',
    variant: 'danger',
    onConfirm: () => {
      // Action de suppression
    }
  });
};

// Dans le JSX
<ConfirmDialog />
```

## 🎯 États visuels standardisés

### Boutons
- **Défaut** : Couleur de base avec ombre légère
- **Survol** : Couleur plus foncée avec ombre accentuée  
- **Actif** : Couleur la plus foncée
- **Désactivé** : Opacité 50%, cursor not-allowed
- **Focus** : Ring de focus en couleur primaire

### Champs de saisie
- **Défaut** : Bordure gris-300
- **Focus** : Bordure primaire + ring
- **Erreur** : Bordure rouge + message d'erreur
- **Succès** : Bordure verte
- **Désactivé** : Opacité 50%

## 🎨 Palette de couleurs

### Couleurs primaires
- **Primary 50** : `#eff6ff` (backgrounds légers)
- **Primary 500** : `#3b82f6` (couleur principale)  
- **Primary 600** : `#2563eb` (boutons, liens)
- **Primary 700** : `#1d4ed8` (survol)

### Couleurs sémantiques
- **Succès** : `#10b981` (vert)
- **Avertissement** : `#f59e0b` (jaune)  
- **Erreur** : `#ef4444` (rouge)
- **Information** : `#3b82f6` (bleu)

### Couleurs neutres
- **Gray 50** : `#f9fafb` (backgrounds)
- **Gray 300** : `#d1d5db` (bordures)
- **Gray 600** : `#4b5563` (texte secondaire)
- **Gray 900** : `#111827` (texte principal)

## ⚡ Animations et transitions

### Durées standardisées
- **Rapide** : `150ms` (hover, focus)
- **Normale** : `200ms` (défaut pour la plupart des éléments)
- **Lente** : `300ms` (modals, grandes transitions)

### Courbes d'animation
- **ease-in-out** : Défaut pour la plupart des transitions
- **ease-out** : Entrées d'éléments
- **ease-in** : Sorties d'éléments

## 📝 Conventions de nommage

### Messages utilisateur
- **Ton professionnel** mais accessible
- **Français correct** avec accents
- **Terminologie cohérente** (même mots pour mêmes concepts)
- **Messages d'erreur constructifs** (que faire pour corriger)

### Libellés d'interface
- **Verbes d'action** : "Créer", "Modifier", "Supprimer"
- **Noms explicites** : "Gestion des utilisateurs" vs "Users"
- **Cohérence** : toujours "Résident" (pas "Habitant" parfois)

## 🔧 Usage et bonnes pratiques

### DO ✅
- Utilisez toujours les composants standardisés
- Respectez les variants et tailles définies
- Appliquez les états visuels cohérents
- Utilisez ConfirmDialog au lieu de confirm() natif
- Groupez les actions similaires visuellement

### DON'T ❌  
- Ne créez pas de boutons avec des classes inline
- N'utilisez pas confirm() ou alert() natifs
- Ne mélangez pas les styles de même type d'élément
- Ne créez pas de nouvelles variantes sans documentation
- N'ignorez pas les états disabled/loading

## 🚀 Implémentation

### Import centralisé
```tsx
// Importez depuis l'index principal
import { Button, Input, Select, Card, StatsCard } from '@/components/ui';
```

### Extensibilité
Pour ajouter de nouveaux variants ou composants :
1. Respectez les conventions existantes
2. Ajoutez la documentation ici
3. Testez tous les états visuels
4. Mettez à jour l'export dans `/ui/index.ts`

## 📱 Responsive Design

### Breakpoints
- **sm** : `640px+`
- **md** : `768px+` 
- **lg** : `1024px+`
- **xl** : `1280px+`

### Grilles
- Utilisez les classes Tailwind `grid-cols-*` et `md:grid-cols-*`
- Cards s'empilent sur mobile, s'alignent sur desktop
- Navigation adaptative selon la taille d'écran

---

**Objectif** : Créer une expérience utilisateur fluide, intuitive et professionnelle pour tous les utilisateurs de Home21-V3.