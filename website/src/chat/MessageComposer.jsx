import React from 'react';
import api from '../shared/api';
import socketClient from '../shared/socket';

class MessageComposer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: '' };
    this.lastTypingSent = 0;
  }

  handleChange = (event) => {
    this.setState({ content: event.target.value });

    const now = Date.now();
    if (now - this.lastTypingSent > 2000) {
      this.lastTypingSent = now;
      socketClient.emit('typing', { conversationSID: this.props.conversationSID });
    }
  };

  handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  };

  send = (event) => {
    if (event) event.preventDefault();
    const content = this.state.content.trim();
    if (!content) return;

    const clientTag = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    socketClient.emit('message', {
      conversationSID: this.props.conversationSID,
      content,
      clientTag,
    });

    const user = api.getCurrentUser();
    this.props.onOptimistic({
      SID: `tmp-${clientTag}`,
      conversation_SID: this.props.conversationSID,
      sender_SID: user && user.userSID,
      senderNickName: user && user.nickName,
      content,
      createdAt: new Date().toISOString(),
      pending: true,
    });

    this.setState({ content: '' });
  };

  render() {
    const isArabic = this.props.language === 'ar';

    return (
      <form className="chat-composer" onSubmit={this.send}>
        <div className="chat-composer-inner">
          <input
            aria-label={isArabic ? 'اكتب رسالة' : 'Type a message'}
            type="text"
            className="chat-composer-input"
            placeholder={isArabic ? 'اكتب رسالة…' : 'Write a message…'}
            value={this.state.content}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
          <button type="submit" className="chat-send-button" disabled={!this.state.content.trim()}>
            <span>{isArabic ? 'إرسال' : 'Send'}</span>
            <span aria-hidden="true">{isArabic ? '←' : '→'}</span>
          </button>
        </div>
        <p className="chat-composer-hint">
          {isArabic ? 'اضغط Enter للإرسال' : 'Press Enter to send'}
        </p>
      </form>
    );
  }
}

export default MessageComposer;
