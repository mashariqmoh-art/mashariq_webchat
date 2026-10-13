import React from 'react';

class MessageView extends React.Component {
  constructor(props) {
    super(props);
  }

  title(conversation) {
    if (conversation.isGroup) {
      return conversation.name || 'Group';
    }
    return conversation.otherUserNickName || 'Unknown';
  }

  render() {
    const { conversation } = this.props;

    if (!conversation) {
      return (
        <div className="d-flex h-100 align-items-center justify-content-center text-muted">
          Select a conversation to start chatting
        </div>
      );
    }

    return (
      <div className="d-flex flex-column h-100">
        <div className="border-bottom p-3">
          <h5 className="mb-0">{this.title(conversation)}</h5>
        </div>
        <div className="flex-grow-1 p-3 text-muted">
          Messages will appear here.
        </div>
      </div>
    );
  }
}

export default MessageView;
