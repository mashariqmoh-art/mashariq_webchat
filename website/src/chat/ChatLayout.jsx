import React from 'react';
import api from '../shared/api';
import ConversationList from './ConversationList';
import MessageView from './MessageView';

class ChatLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      selectedSID: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.loadConversations();
  }

  async loadConversations() {
    try {
      const data = await api.get('/api/conversations');
      this.setState({ conversations: data.conversations, loading: false });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  }

  handleSelect = (sid) => {
    this.setState({ selectedSID: sid });
  };

  render() {
    const { conversations, selectedSID, loading, error } = this.state;
    const selected = conversations.find((c) => c.SID === selectedSID) || null;

    return (
      <div className="container-fluid vh-100">
        <div className="row h-100">
          <div className="col-4 col-md-3 border-end p-0 overflow-auto">
            <div className="p-3 border-bottom">
              <h5 className="mb-0">Chats</h5>
            </div>
            {loading && <div className="p-3 text-muted">Loading…</div>}
            {error && <div className="p-3 text-danger">{error}</div>}
            <ConversationList
              conversations={conversations}
              selectedSID={selectedSID}
              onSelect={this.handleSelect}
            />
          </div>
          <div className="col-8 col-md-9 p-0">
            <MessageView conversation={selected} />
          </div>
        </div>
      </div>
    );
  }
}

export default ChatLayout;
