import React from 'react';

class ConversationList extends React.Component {
  constructor(props) {
    super(props);
  }

  displayName(conversation) {
    if (conversation.isGroup) {
      return conversation.name || 'Group';
    }
    return conversation.otherUserNickName || 'Unknown';
  }

  render() {
    const { conversations, selectedSID, onSelect } = this.props;

    return (
      <div className="list-group list-group-flush">
        {conversations.length === 0 && (
          <div className="p-3 text-muted">No conversations yet</div>
        )}
        {conversations.map((conversation) => (
          <button
            key={conversation.SID}
            type="button"
            className={`list-group-item list-group-item-action ${conversation.SID === selectedSID ? 'active' : ''}`}
            onClick={() => onSelect(conversation.SID)}
          >
            {this.displayName(conversation)}
          </button>
        ))}
      </div>
    );
  }
}

export default ConversationList;
