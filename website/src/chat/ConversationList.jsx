import React from 'react';

export default class ConversationList extends React.Component {
  renderConversationItem(conversation) {
    const isSelected = conversation.SID === this.props.selectedConversationId;
    const memberNames = (conversation.members || [])
      .map((member) => member.nickName || member.name)
      .filter(Boolean)
      .join(', ');

    return (
      <button
        type="button"
        key={conversation.SID}
        className={`list-group-item list-group-item-action border-0 ${isSelected ? 'active' : ''}`}
        onClick={() => this.props.onSelectConversation(conversation)}
      >
        <div className="d-flex justify-content-between align-items-center">
          <strong>
            {conversation.name || 'Direct message'}
          </strong>
          <small className="text-muted">#{conversation.SID}</small>
        </div>
        <small className="text-muted d-block">{memberNames || 'No members'}</small>
      </button>
    );
  }

  render() {
    const { conversations } = this.props;

    return (
      <div className="border-end bg-light h-100 overflow-auto">
        <div className="p-3 border-bottom bg-white">
          <h2 className="h5 mb-0">Conversations</h2>
        </div>

        <div className="list-group list-group-flush">
          {conversations.length === 0 ? (
            <div className="p-3 text-muted">No conversations yet.</div>
          ) : (
            conversations.map((conversation) => this.renderConversationItem(conversation))
          )}
        </div>
      </div>
    );
  }
}
