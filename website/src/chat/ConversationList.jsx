import React from 'react';
import api from '../shared/api';

class ConversationList extends React.Component {
  constructor(props) {
    super(props);
  }

  displayName(conversation) {
    if (conversation.isGroup) {
      return conversation.name || (this.props.language === 'ar' ? 'مجموعة' : 'Group');
    }
    return conversation.otherUserNickName || (this.props.language === 'ar' ? 'مستخدم' : 'Unknown');
  }

  render() {
    const { conversations, selectedSID, onSelect, language } = this.props;

    return (
      <nav aria-label={language === 'ar' ? 'قائمة المحادثات' : 'Conversation list'} className="chat-conversation-list">
        {conversations.map((conversation) => (
          <button
            key={conversation.SID}
            type="button"
            className={`chat-conversation ${conversation.SID === selectedSID ? 'active' : ''}`}
            onClick={() => onSelect(conversation.SID)}
            aria-current={conversation.SID === selectedSID ? 'page' : undefined}
          >
            {conversation.otherUserProfilePicturePath && !conversation.isGroup ? (
              <img alt="" className="chat-conversation-avatar chat-avatar-image"
                src={api.assetUrl(conversation.otherUserProfilePicturePath)} />
            ) : (
              <span className={`chat-conversation-avatar ${conversation.isGroup ? 'group' : ''}`}>
                {this.displayName(conversation).trim().charAt(0).toLocaleUpperCase()}
              </span>
            )}
            <span className="chat-conversation-copy">
              <span className="chat-conversation-title">{this.displayName(conversation)}</span>
              <span className="chat-conversation-subtitle">
                {conversation.isGroup
                  ? (language === 'ar' ? 'محادثة جماعية' : 'Group conversation')
                  : (language === 'ar' ? 'محادثة مباشرة' : 'Direct conversation')}
              </span>
            </span>
            <span className="chat-conversation-meta">
              {conversation.isGroup ? (
                <span className="chat-group-badge">{language === 'ar' ? 'مجموعة' : 'Group'}</span>
              ) : null}
            </span>
          </button>
        ))}
      </nav>
    );
  }
}

export default ConversationList;
