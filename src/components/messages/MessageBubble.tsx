import React from 'react';
import { Message, MessageType } from '@/types';
import { getUserById } from '@/data/mockMessages';
import { Paperclip, Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showSender?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showSender = true
}) => {
  const sender = getUserById(message.senderId);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Sender name (for received messages) */}
        {!isOwn && showSender && sender && (
          <div className="text-xs text-gray-500 mb-1 px-2">
            {sender.name}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`
            px-4 py-2 rounded-lg shadow-sm
            ${isOwn 
              ? 'bg-primary-500 text-white rounded-br-sm' 
              : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
            }
          `}
        >
          {/* Subject (if exists) */}
          {message.subject && (
            <div className={`text-sm font-semibold mb-2 ${isOwn ? 'text-primary-100' : 'text-gray-700'}`}>
              {message.subject}
            </div>
          )}

          {/* Message content */}
          <div className="text-sm whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className={`
                    flex items-center p-2 rounded border
                    ${isOwn 
                      ? 'border-primary-300 bg-primary-400' 
                      : 'border-gray-300 bg-gray-50'
                    }
                  `}
                >
                  <Paperclip className={`w-4 h-4 mr-2 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium truncate ${isOwn ? 'text-white' : 'text-gray-900'}`}>
                      {attachment.fileName}
                    </div>
                    <div className={`text-xs ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                      {formatFileSize(attachment.fileSize)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Time and status */}
          <div className={`flex items-center justify-between mt-2 text-xs ${
            isOwn ? 'text-primary-100' : 'text-gray-500'
          }`}>
            <span>{formatTime(message.createdAt)}</span>
            {isOwn && (
              <div className="flex items-center ml-2">
                {message.isRead ? (
                  <CheckCheck className="w-3 h-3" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Message type indicator */}
        {message.type === MessageType.ANNOUNCEMENT && (
          <div className="flex items-center justify-center mt-1">
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              📢 Annonce
            </span>
          </div>
        )}
        {message.type === MessageType.SYSTEM && (
          <div className="flex items-center justify-center mt-1">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              ⚙️ Système
            </span>
          </div>
        )}
      </div>
      
      {/* Avatar placeholder (for received messages) */}
      {!isOwn && (
        <div className="order-2 ml-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {sender ? sender.name.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};