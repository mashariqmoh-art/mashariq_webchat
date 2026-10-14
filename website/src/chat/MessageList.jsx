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

  render() {
    const { messages, typingNickName, error } = this.state;

    return (
      <div className="flex-grow-1 overflow-auto p-3" ref={this.containerRef}>
        {error && <div className="text-danger">{error}</div>}
        {!error && messages.length === 0 && (
          <div className="text-muted">No messages yet. Say hello!</div>
        )}
        {messages.map((message) => (
          <div
            key={message.SID}
            className={`d-flex mb-2 ${this.isOwn(message) ? 'justify-content-end' : ''}`}
          >
            <div
              className={`px-3 py-2 rounded ${this.isOwn(message) ? 'bg-primary text-white' : 'bg-light'}`}
              style={{ maxWidth: '70%' }}
            >
              {!this.isOwn(message) && (
                <div className="small text-muted">{message.senderNickName}</div>
              )}
              <div>{message.content}</div>
              {message.pending && <div className="small opacity-75">sending…</div>}
            </div>
          </div>
        ))}
        {typingNickName && (
          <div className="text-muted small">{typingNickName} is typing…</div>
        )}
      </div>
    );
  }
}

export default MessageList;
