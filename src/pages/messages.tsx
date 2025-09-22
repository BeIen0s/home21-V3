import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ConversationList } from '@/components/messages/ConversationList';
import { ConversationView } from '@/components/messages/ConversationView';

const MessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>();

  return (
    <Layout title="Messages" showFooter={false}>
      <div className="h-full flex">
        {/* Conversations sidebar */}
        <div className="w-1/3 min-w-[300px] max-w-md">
          <ConversationList 
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        </div>

        {/* Conversation view */}
        <div className="flex-1 bg-gray-50">
          <ConversationView conversationId={selectedConversation} />
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;