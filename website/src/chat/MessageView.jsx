import React from 'react';
import MessageList from './MessageList.jsx';
import MessageComposer from './MessageComposer.jsx';

export default class MessageView extends React.Component {
  render() {
    const { conversation } = this.props;

    if (!conversation) {
      return (
        <div className="d-flex align-items-center justify-content-center h-100 text-muted">
          Select a conversation to view messages.
        </div>
      );
    }

    const memberNames = (conversation.members || [])
      .map((member) => member.nickName || member.name)
      .filter(Boolean)
      .join(', ');

    return (
      <div className="d-flex flex-column h-100">
        <div className="border-bottom p-3 bg-white">
          <h3 className="h5 mb-0">
            {conversation.name || 'Direct message'}
          </h3>
          <small className="text-muted">{memberNames || 'No members'}</small>
        </div>

        <div className="flex-grow-1 overflow-hidden d-flex flex-column">
          <MessageList conversation={conversation} />
          <MessageComposer conversation={conversation} />
        </div>
      </div>
    );
  }
}
