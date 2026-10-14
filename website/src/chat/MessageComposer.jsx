import React from 'react';
import socket from '../shared/socket.js';

export default class MessageComposer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      draft: '',
      optimisticMessage: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
  }

  handleTyping() {
    const { conversation } = this.props;

    if (conversation && conversation.SID) {
      socket.emit('typing', Number(conversation.SID));
    }
  }

  handleChange(event) {
    const draft = event.target.value;
    this.setState({ draft });

    if (draft.trim()) {
      this.handleTyping();
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const { conversation } = this.props;
    const content = this.state.draft.trim();

    if (!conversation || !content) {
      return;
    }

    const optimisticMessage = {
      SID: `local-${Date.now()}`,
      senderNickName: 'You',
      content,
      createdAt: new Date().toISOString(),
    };

    this.setState({
      draft: '',
      optimisticMessage,
    });

    socket.emit('message', {
      conversationSID: Number(conversation.SID),
      content,
    });
  }

  render() {
    const { draft, optimisticMessage } = this.state;

    return (
      <div className="border-top bg-white p-3">
        {optimisticMessage ? (
          <div className="alert alert-light border mb-3 py-2 px-3 mb-3">
            <div className="fw-semibold small">You</div>
            <div>{optimisticMessage.content}</div>
          </div>
        ) : null}

        <form onSubmit={this.handleSubmit} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message"
            value={draft}
            onChange={this.handleChange}
            onKeyDown={this.handleTyping}
          />
          <button type="submit" className="btn btn-primary" disabled={!draft.trim()}>
            Send
          </button>
        </form>
      </div>
    );
  }
}
