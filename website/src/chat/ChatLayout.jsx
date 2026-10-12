import React from 'react';
import api from '../shared/api.js';
import ConversationList from './ConversationList.jsx';
import MessageView from './MessageView.jsx';

export default class ChatLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conversations: [],
      selectedConversation: null,
      loading: true,
      error: '',
    };
  }

  componentDidMount() {
    this.loadConversations();
  }

  async loadConversations() {
    try {
      const response = await api.get('/conversations');
      const conversations = response.conversations || [];

      this.setState({
        conversations,
        selectedConversation: conversations[0] || null,
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

  handleSelectConversation(conversation) {
    this.setState({ selectedConversation: conversation });
  }

  render() {
    const { conversations, selectedConversation, loading, error } = this.state;

    return (
      <div className="container-fluid vh-100 p-0 bg-white">
        <div className="row g-0 h-100">
          <div className="col-md-4 col-lg-3 border-end h-100">
            {loading ? (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                Loading conversations...
              </div>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversation?.SID}
                onSelectConversation={this.handleSelectConversation.bind(this)}
              />
            )}
          </div>

          <div className="col-md-8 col-lg-9 h-100">
            {error ? (
              <div className="d-flex align-items-center justify-content-center h-100 text-danger">
                {error}
              </div>
            ) : (
              <MessageView conversation={selectedConversation} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
