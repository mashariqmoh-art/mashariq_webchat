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
        <MessageList
          key={conversation.SID}
          ref={this.messageListRef}
          conversationSID={conversation.SID}
        />
        <MessageComposer
          conversationSID={conversation.SID}
          onOptimistic={this.handleOptimistic}
        />
      </div>
    );
  }
}

export default MessageView;
