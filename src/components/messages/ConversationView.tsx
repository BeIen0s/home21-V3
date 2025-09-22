import React, { useMemo } from 'react';
import { getMessagesByConversation } from '@/data/mockMessages';
import { MessageBubble } from './MessageBubble';

interface ConversationViewProps {
  conversationId?: string;
}

export const ConversationView: React.FC<ConversationViewProps> = ({ conversationId }) => {
  const messages = useMemo(() => {
    if (!conversationId) return [];
    return getMessagesByConversation(conversationId);
  }, [conversationId]);

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Sélectionnez une conversation</p>
          <p className="mt-1">Choisissez une discussion dans la liste de gauche pour commencer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            isOwn={msg.senderId === 'current-user'}
          />
        ))}
      </div>

      {/* Composer placeholder */}
      <div className="border-t border-gray-200 p-3 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Écrire un message..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
            disabled
          />
          <button
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md cursor-not-allowed"
            title="Envoi désactivé dans la démo"
            disabled
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};