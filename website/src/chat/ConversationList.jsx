import React from 'react';

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
            <span className="d-flex justify-content-between align-items-center">
              <span className="text-truncate">{this.displayName(conversation)}</span>
              {conversation.isGroup ? (
                <span className="badge text-bg-secondary ms-2">Group</span>
              ) : null}
            </span>
          </button>
        ))}
      </nav>
    );
  }
}

export default ConversationList;
