import { Message, MessageType } from '@/types';

// Mock Users/Contacts
export const mockUsers = [
  {
    id: '1',
    name: 'Dr. Martin Dubois',
    email: 'martin.dubois@home21.com',
    role: 'ADMIN',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: '2',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@home21.com',
    role: 'STAFF',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: '3',
    name: 'Marie Dupont',
    email: 'marie.dupont@resident.com',
    role: 'RESIDENT',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: '4',
    name: 'Jean Bernard',
    email: 'jean.bernard@resident.com',
    role: 'RESIDENT',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: '5',
    name: 'Équipe Maintenance',
    email: 'maintenance@home21.com',
    role: 'STAFF',
    avatar: '/api/placeholder/40/40'
  }
];

// Mock Messages
export const mockMessages: Message[] = [
  // Conversation with Dr. Dubois
  {
    id: '1',
    senderId: '1',
    recipientId: 'current-user',
    subject: 'Réunion équipe hebdomadaire',
    content: 'Bonjour, n\'oubliez pas la réunion équipe de demain à 14h en salle de conférence.',
    type: MessageType.PRIVATE,
    isRead: false,
    createdAt: new Date('2024-01-15T09:30:00')
  },
  {
    id: '2',
    senderId: 'current-user',
    recipientId: '1',
    content: 'Merci pour le rappel ! Je serai présent(e).',
    type: MessageType.PRIVATE,
    isRead: true,
    replyToId: '1',
    createdAt: new Date('2024-01-15T09:45:00')
  },
  
  // Conversation with Sophie Laurent
  {
    id: '3',
    senderId: '2',
    recipientId: 'current-user',
    subject: 'Nouveau résident - Chambre 15',
    content: 'Le nouveau résident arrivera demain. Pouvez-vous préparer sa chambre et vérifier que tout est en ordre ?',
    type: MessageType.PRIVATE,
    isRead: false,
    createdAt: new Date('2024-01-14T16:20:00')
  },
  {
    id: '4',
    senderId: 'current-user',
    recipientId: '2',
    content: 'C\'est noté ! J\'ai vérifié la chambre 15, tout est prêt pour l\'accueil.',
    type: MessageType.PRIVATE,
    isRead: true,
    replyToId: '3',
    createdAt: new Date('2024-01-14T17:30:00')
  },
  
  // Conversation with Marie Dupont (Resident)
  {
    id: '5',
    senderId: '3',
    recipientId: 'current-user',
    subject: 'Problème chauffage',
    content: 'Bonjour, il fait très froid dans ma chambre depuis hier soir. Le radiateur ne semble pas fonctionner correctement.',
    type: MessageType.PRIVATE,
    isRead: true,
    createdAt: new Date('2024-01-13T08:15:00')
  },
  {
    id: '6',
    senderId: 'current-user',
    recipientId: '3',
    content: 'Bonjour Marie, j\'ai transmis votre demande à l\'équipe maintenance. Ils passeront dans la journée.',
    type: MessageType.PRIVATE,
    isRead: true,
    replyToId: '5',
    createdAt: new Date('2024-01-13T08:30:00')
  },
  {
    id: '7',
    senderId: '5',
    recipientId: '3',
    content: 'Problème résolu ! Le radiateur a été réparé. N\'hésitez pas à nous contacter si vous avez encore froid.',
    type: MessageType.PRIVATE,
    isRead: true,
    createdAt: new Date('2024-01-13T14:45:00')
  },
  
  // Group message
  {
    id: '8',
    senderId: '1',
    groupId: 'staff-group',
    subject: 'Nouvelle procédure sécurité',
    content: 'Nouvelle procédure de sécurité en vigueur dès lundi. Merci de prendre connaissance du document joint.',
    type: MessageType.ANNOUNCEMENT,
    isRead: false,
    attachments: [{
      id: 'att1',
      fileName: 'procedure-securite.pdf',
      filePath: '/documents/procedure-securite.pdf',
      fileSize: 245760,
      mimeType: 'application/pdf'
    }],
    createdAt: new Date('2024-01-12T10:00:00')
  },
  
  // More recent messages
  {
    id: '9',
    senderId: '4',
    recipientId: 'current-user',
    subject: 'Demande de sortie',
    content: 'Bonjour, je souhaiterais sortir cet après-midi pour voir ma famille. Est-ce que c\'est possible ?',
    type: MessageType.PRIVATE,
    isRead: false,
    createdAt: new Date('2024-01-15T11:20:00')
  }
];

// Mock Conversations (grouped messages)
export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  type: 'PRIVATE' | 'GROUP';
  title?: string;
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['1', 'current-user'],
    lastMessage: mockMessages[1],
    unreadCount: 1,
    type: 'PRIVATE'
  },
  {
    id: 'conv-2', 
    participants: ['2', 'current-user'],
    lastMessage: mockMessages[3],
    unreadCount: 1,
    type: 'PRIVATE'
  },
  {
    id: 'conv-3',
    participants: ['3', 'current-user', '5'],
    lastMessage: mockMessages[6],
    unreadCount: 0,
    type: 'PRIVATE'
  },
  {
    id: 'conv-4',
    participants: ['4', 'current-user'],
    lastMessage: mockMessages[8],
    unreadCount: 1,
    type: 'PRIVATE'
  },
  {
    id: 'conv-5',
    participants: ['1', 'staff-group'],
    lastMessage: mockMessages[7],
    unreadCount: 1,
    type: 'GROUP',
    title: 'Équipe Administrative'
  }
];

// Helper functions
export const getUserById = (id: string) => {
  return mockUsers.find(user => user.id === id);
};

export const getMessagesByConversation = (conversationId: string) => {
  const conversation = mockConversations.find(conv => conv.id === conversationId);
  if (!conversation) return [];
  
  return mockMessages.filter(message => 
    (message.recipientId && conversation.participants.includes(message.recipientId) && conversation.participants.includes(message.senderId)) ||
    (message.groupId && message.groupId === conversationId.replace('conv-', ''))
  ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
};