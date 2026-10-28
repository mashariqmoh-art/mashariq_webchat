import React from 'react';
import api from '../shared/api';
import socketClient from '../shared/socket';

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      typingNickName: null,
      error: null,
    };
    this.containerRef = React.createRef();
    this.typingTimer = null;
    this.currentUser = api.getCurrentUser();
  }

  componentDidMount() {
    socketClient.on('message', this.handleMessage);
    socketClient.on('typing', this.handleTyping);
    socketClient.emit('join', { conversationSID: this.props.conversationSID });
    this.loadMessages();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    socketClient.off('message', this.handleMessage);
    socketClient.off('typing', this.handleTyping);
    clearTimeout(this.typingTimer);
  }

  async loadMessages() {
    try {
      const data = await api.get(`/api/conversations/${this.props.conversationSID}/messages`);
      this.setState({ messages: data.messages, error: null });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  handleMessage = (message) => {
    if (message.conversation_SID !== this.props.conversationSID) return;

    this.setState((state) => ({
      messages: [
        ...state.messages.filter(
          (m) => m.SID !== message.SID && m.SID !== `tmp-${message.clientTag}`
        ),
        message,
      ],
    }));
  };

  handleTyping = (data) => {
    if (data.conversationSID !== this.props.conversationSID) return;
    if (this.currentUser && data.userSID === this.currentUser.userSID) return;

    this.setState({ typingNickName: data.nickName });
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => this.setState({ typingNickName: null }), 2000);
  };

  appendOptimistic(message) {
    this.setState((state) => ({ messages: [...state.messages, message] }));
  }

  scrollToBottom() {
    const el = this.containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }

  isOwn(message) {
    return this.currentUser && message.sender_SID === this.currentUser.userSID;
  }

  formatTime(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(this.props.language === 'ar' ? 'ar' : 'en', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }

  render() {
    const { messages, typingNickName, error } = this.state;
    const isArabic = this.props.language === 'ar';

    return (
      <div className="chat-message-scroll" ref={this.containerRef}>
        {error && <div className="chat-message-error" role="alert">{error}</div>}
        {!error && messages.length === 0 && (
          <div className="chat-no-messages">
            <span aria-hidden="true">✳</span>
            <p>{isArabic ? 'لا توجد رسائل بعد. ابدأ بالسلام!' : 'No messages yet. Say hello!'}</p>
          </div>
        )}
        <div className="chat-message-list">
          {messages.map((message) => {
            const ownMessage = this.isOwn(message);
            return (
              <div
                key={message.SID}
                className={`chat-message-row ${ownMessage ? 'own' : ''}`}
              >
                {!ownMessage && (
                  message.senderProfilePicturePath ? (
                    <img alt="" className="chat-message-avatar chat-avatar-image"
                      src={api.assetUrl(message.senderProfilePicturePath)} />
                  ) : (
                    <span className="chat-message-avatar">
                      {(message.senderNickName || '?').trim().charAt(0).toLocaleUpperCase()}
                    </span>
                  )
                )}
                <div className={`chat-bubble ${ownMessage ? 'own' : ''}`}>
                  {!ownMessage && message.senderNickName && (
                    <div className="chat-message-sender">{message.senderNickName}</div>
                  )}
                  <div className="chat-message-content">{message.content}</div>
                  <div className="chat-message-meta">
                    <time dateTime={message.createdAt}>{this.formatTime(message.createdAt)}</time>
                    {message.pending && (
                      <span>{isArabic ? 'جارٍ الإرسال…' : 'Sending…'}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {typingNickName && (
            <div className="chat-typing">
              <span className="chat-typing-dots" aria-hidden="true"><i /><i /><i /></span>
              <span>
                {isArabic
                  ? `${typingNickName} يكتب الآن…`
                  : `${typingNickName} is typing…`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MessageList;
