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

  send = () => {
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
    return (
      <div className="border-top p-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message"
            value={this.state.content}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
          <button type="button" className="btn btn-primary" onClick={this.send}>
            Send
          </button>
        </div>
      </div>
    );
  }
}

export default MessageComposer;
