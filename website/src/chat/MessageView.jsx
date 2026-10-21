import React from 'react';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';

class MessageView extends React.Component {
  constructor(props) {
    super(props);
    this.messageListRef = React.createRef();
  }

  handleOptimistic = (message) => {
    if (this.messageListRef.current) {
      this.messageListRef.current.appendOptimistic(message);
    }
  };

  title(conversation) {
    if (conversation.isGroup) {
      return conversation.name || (this.props.language === 'ar' ? 'مجموعة' : 'Group');
    }
    return conversation.otherUserNickName || (this.props.language === 'ar' ? 'مستخدم' : 'Unknown');
  }

  render() {
    const { conversation, language, onBack } = this.props;
    const isArabic = language === 'ar';

    if (!conversation) {
      return (
        <div className="chat-empty">
          <img className="chat-empty-logo" src="/mashariq-logo.png" alt="Mashariq" />
          <span className="chat-empty-spark" aria-hidden="true">✳</span>
          <h2>{isArabic ? 'كل تواصل يبدأ بتحية' : 'Every connection starts with hello'}</h2>
          <p>
            {isArabic
              ? 'اختر محادثة من القائمة لتبدأ التواصل.'
              : 'Choose a conversation from your list to start chatting.'}
          </p>
        </div>
      );
    }

    const title = this.title(conversation);
    const initial = title.trim().charAt(0).toLocaleUpperCase();

    return (
      <div className="chat-message-view">
        <header className="chat-message-header">
          <button
            aria-label={isArabic ? 'العودة إلى المحادثات' : 'Back to conversations'}
            className="chat-back-button"
            onClick={onBack}
            type="button"
          >
            {isArabic ? '→' : '←'}
          </button>
          <span className={`chat-header-avatar ${conversation.isGroup ? 'group' : ''}`}>{initial}</span>
          <span className="chat-header-copy">
            <strong>{title}</strong>
            <small>
              {conversation.isGroup
                ? (isArabic ? 'محادثة جماعية' : 'Group conversation')
                : (isArabic ? 'محادثة مباشرة' : 'Direct conversation')}
            </small>
          </span>
          <span className="chat-header-mark" aria-hidden="true">✳</span>
        </header>
        <MessageList
          key={conversation.SID}
          ref={this.messageListRef}
          conversationSID={conversation.SID}
          language={language}
        />
        <MessageComposer
          conversationSID={conversation.SID}
          onOptimistic={this.handleOptimistic}
          language={language}
        />
      </div>
    );
  }
}

export default MessageView;
