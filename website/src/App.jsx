import React from 'react';
import ChatLayout from './chat/ChatLayout';
import AdminPanel from './admin/AdminPanel';
import AuthPage from './auth/AuthPage';
import api from './shared/api';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isAuthenticated: Boolean(api.getToken()) };
  }

  handleAuthenticated = () => {
    this.setState({ isAuthenticated: true });
  };

  render() {
    if (!this.state.isAuthenticated) {
      return <AuthPage onAuthenticated={this.handleAuthenticated} />;
    }

    if (window.location.pathname === '/admin') {
      return <AdminPanel />;
    }
    return <ChatLayout />;
  }
}
