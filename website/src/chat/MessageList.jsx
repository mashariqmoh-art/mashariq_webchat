import React from 'react';
import api from '../shared/api.js';
import socket from '../shared/socket.js';

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      loading: true,
      error: '',
      typingUser: null,
    };

    this.handleIncomingMessage = this.handleIncomingMessage.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
  }

  componentDidMount() {
    this.loadMessages();
    this.attachSocket();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.conversation?.SID !== this.props.conversation?.SID) {
      this.loadMessages();
      this.attachSocket();
    }
  }

  componentWillUnmount() {
    socket.off('message', this.handleIncomingMessage);
    socket.off('typing', this.handleTyping);
  }

  attachSocket() {
    const { conversation } = this.props;

    socket.off('message', this.handleIncomingMessage);
    socket.off('typing', this.handleTyping);
    socket.on('message', this.handleIncomingMessage);
    socket.on('typing', this.handleTyping);

    if (conversation && conversation.SID) {
      socket.emit('join', Number(conversation.SID));
    }
  }

  async loadMessages() {
    const { conversation } = this.props;

    if (!conversation) {
      this.setState({ messages: [], loading: false, error: '' });
      return;
    }

    try {
      const response = await api.get(`/conversations/${conversation.SID}/messages`);
      this.setState({
        messages: response.messages || [],
        loading: false,
        error: '',
      });
    } catch (error) {
      this.setState({
        loading: false,
        error: error.message,
      });
    }
  }

  handleIncomingMessage(payload) {
    const message = payload && payload.message ? payload.message : payload;
    const currentConversationSID = Number(this.props.conversation?.SID);
    const messageConversationSID = Number(message?.conversation_SID ?? message?.conversationSID ?? 0);

    if (!message || !messageConversationSID || messageConversationSID !== currentConversationSID) {
      return;
    }

    this.setState((previousState) => {
      const alreadyExists = previousState.messages.some((item) => Number(item.SID) === Number(message.SID));
      if (alreadyExists) {
        return previousState;
      }

      return {
        ...previousState,
        messages: [...previousState.messages, message],
      };
    });
  }

  handleTyping(payload) {
    const { conversation } = this.props;
    const currentConversationSID = Number(conversation?.SID);
    const incomingConversationSID = Number(payload?.conversationSID ?? payload?.conversation_SID ?? 0);

    if (!payload || !incomingConversationSID || incomingConversationSID !== currentConversationSID) {
      return;
    }

    const userName = payload.nickName || 'Someone';
    this.setState({ typingUser: userName });

    window.clearTimeout(this.typingTimer);
    this.typingTimer = window.setTimeout(() => {
      this.setState({ typingUser: null });
    }, 1200);
  }

  render() {
    const { messages, loading, error, typingUser } = this.state;

    if (loading) {
      return (
        <div className="flex-grow-1 p-3 d-flex align-items-center justify-content-center text-muted">
          Loading messages...
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-grow-1 p-3 d-flex align-items-center justify-content-center text-danger">
          {error}
        </div>
      );
    }

    return (
      <div className="flex-grow-1 overflow-auto bg-light p-3">
        {messages.length === 0 ? (
          <div className="text-center text-muted mt-4">No messages yet. Start the conversation.</div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {messages.map((message) => (
              <div key={message.SID || `msg-${Date.now()}-${Math.random()}`} className="bg-white border rounded p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong>{message.senderNickName || message.senderName || 'User'}</strong>
                  <small className="text-muted">
                    {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </small>
                </div>
                <div>{message.content}</div>
              </div>
            ))}
          </div>
        )}

        {typingUser ? (
          <div className="mt-3 text-muted small">{typingUser} is typing...</div>
        ) : null}
      </div>
    );
  }
}
