import React from 'react';
import { Conversation, mockConversations, getUserById } from '@/data/mockMessages';
import { MessageCircle, Users, Clock } from 'lucide-react';

interface ConversationListProps {
  selectedConversation?: string;
  onSelectConversation: (conversationId: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversation,
  onSelectConversation
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (days === 1) {
      return 'Hier';
    } else if (days < 7) {
      return `Il y a ${days} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.type === 'GROUP' && conversation.title) {
      return conversation.title;
    }
    
    // For private conversations, get the other participant's name
    const otherParticipant = conversation.participants.find(p => p !== 'current-user');
    const user = otherParticipant ? getUserById(otherParticipant) : null;
    return user ? user.name : 'Conversation';
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'GROUP') {
      return (
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-primary-600" />
        </div>
      );
    }
    
    const otherParticipant = conversation.participants.find(p => p !== 'current-user');
    const user = otherParticipant ? getUserById(otherParticipant) : null;
    
    if (user) {
      return (
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
        </div>
      );
    }
    
    return (
      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
        <MessageCircle className="w-6 h-6 text-gray-400" />
      </div>
    );
  };

  return (
    <div className="h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        <p className="text-sm text-gray-500 mt-1">
          {mockConversations.length} conversation{mockConversations.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {mockConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`
              p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50
              ${selectedConversation === conversation.id ? 'bg-primary-50 border-primary-200' : ''}
            `}
          >
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              {getConversationAvatar(conversation)}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium truncate ${
                    conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {getConversationTitle(conversation)}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessage.createdAt)}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Last message preview */}
                <div className="mt-1">
                  <p className={`text-sm truncate ${
                    conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'
                  }`}>
                    {conversation.lastMessage.subject && (
                      <span className="font-medium">{conversation.lastMessage.subject}: </span>
                    )}
                    {conversation.lastMessage.content}
                  </p>
                </div>

                {/* Indicators */}
                <div className="flex items-center mt-2 space-x-2">
                  {conversation.type === 'GROUP' && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="w-3 h-3 mr-1" />
                      <span>Groupe</span>
                    </div>
                  )}
                  {conversation.lastMessage.attachments && conversation.lastMessage.attachments.length > 0 && (
                    <div className="flex items-center text-xs text-gray-500">
                      <span>📎 {conversation.lastMessage.attachments.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {mockConversations.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun message</h3>
            <p className="text-gray-500">Vos conversations apparaîtront ici.</p>
          </div>
        </div>
      )}
    </div>
  );
};