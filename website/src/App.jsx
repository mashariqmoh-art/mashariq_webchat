import React from 'react';
import ChatLayout from './chat/ChatLayout';
import AdminPanel from './admin/AdminPanel';

export default class App extends React.Component {
  render() {
    if (window.location.pathname === '/admin') {
      return <AdminPanel />;
    }
    return <ChatLayout />;
  }
}
