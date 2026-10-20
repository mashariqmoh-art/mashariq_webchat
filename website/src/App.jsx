import React from 'react';
import ChatLayout from './chat/ChatLayout';
import AdminPanel from './admin/AdminPanel';
import AuthPage from './auth/AuthPage';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: Boolean(localStorage.getItem('token')),
    };
  }

  handleAuthenticated = () => {
    this.setState({ isAuthenticated: true });
  };

  render() {
    if (window.location.pathname === '/admin') {
      return <AdminPanel />;
    }

    if (!this.state.isAuthenticated) {
      return <AuthPage onAuthenticated={this.handleAuthenticated} />;
    }

    return <ChatLayout />;
  }
}
