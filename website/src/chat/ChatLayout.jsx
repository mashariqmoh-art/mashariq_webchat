import React from 'react';
import api from '../shared/api';
import ConversationList from './ConversationList';
import MessageView from './MessageView';
import './ChatLayout.css';

class ChatLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      selectedSID: null,
      loading: true,
      error: null,
      search: '',
      language: localStorage.getItem('auth-language') === 'ar' ? 'ar' : 'en',
      theme: localStorage.getItem('auth-theme') === 'dark' ? 'dark' : 'light',
      newConversationOpen: false,
      users: [],
      usersLoading: false,
      usersError: null,
      userSearch: '',
      creatingConversation: false,
    };
    this.currentUser = api.getCurrentUser();
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

  handleSearch = (event) => {
    this.setState({ search: event.target.value });
  };

  openNewConversation = async () => {
    this.setState({
      newConversationOpen: true,
      usersLoading: true,
      usersError: null,
      userSearch: '',
    });

    try {
      const data = await api.get('/api/conversations/users');
      this.setState({ users: data.users, usersLoading: false });
    } catch (err) {
      this.setState({ usersError: err.message, usersLoading: false });
    }
  };

  closeNewConversation = () => {
    if (!this.state.creatingConversation) {
      this.setState({ newConversationOpen: false, usersError: null });
    }
  };

  handleUserSearch = (event) => {
    this.setState({ userSearch: event.target.value });
  };

  startConversation = async (otherUserSID) => {
    this.setState({ creatingConversation: true, usersError: null });

    try {
      const result = await api.post('/api/conversations', { otherUserSID });
      const data = await api.get('/api/conversations');
      this.setState({
        conversations: data.conversations,
        selectedSID: result.conversationSID,
        newConversationOpen: false,
        creatingConversation: false,
      });
    } catch (err) {
      this.setState({ usersError: err.message, creatingConversation: false });
    }
  };

  toggleLanguage = () => {
    const language = this.state.language === 'en' ? 'ar' : 'en';
    localStorage.setItem('auth-language', language);
    this.setState({ language });
  };

  toggleTheme = () => {
    const theme = this.state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('auth-theme', theme);
    this.setState({ theme });
  };

  handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  displayName(conversation) {
    if (conversation.isGroup) {
      return conversation.name || (this.state.language === 'ar' ? 'مجموعة' : 'Group');
    }
    return conversation.otherUserNickName || (this.state.language === 'ar' ? 'مستخدم' : 'Unknown');
  }

  render() {
    const {
      conversations,
      selectedSID,
      loading,
      error,
      search,
      language,
      theme,
      newConversationOpen,
      users,
      usersLoading,
      usersError,
      userSearch,
      creatingConversation,
    } = this.state;
    const isArabic = language === 'ar';
    const copy = isArabic
      ? {
        appName: 'ويب شات',
        chats: 'المحادثات',
        search: 'ابحث في المحادثات',
        newConversation: 'محادثة جديدة',
        newConversationTitle: 'ابدأ محادثة جديدة',
        newConversationDescription: 'اختر شخصاً لبدء محادثة مباشرة.',
        searchPeople: 'ابحث عن الأشخاص',
        loadingUsers: 'جارٍ تحميل الأشخاص…',
        noUsers: 'لا يوجد أشخاص متاحون لبدء محادثة.',
        noUsersFound: 'لم يتم العثور على أشخاص.',
        cancel: 'إلغاء',
        loading: 'جارٍ تحميل المحادثات…',
        noChats: 'لا توجد محادثات بعد',
        noResults: 'لا توجد محادثات مطابقة',
        yourAccount: 'حسابك',
        signOut: 'تسجيل الخروج',
        language: 'English',
        darkMode: 'الوضع الداكن',
        lightMode: 'الوضع الفاتح',
        themeToDark: 'التبديل إلى الوضع الداكن',
        themeToLight: 'التبديل إلى الوضع الفاتح',
      }
      : {
        appName: 'WebChat',
        chats: 'Conversations',
        search: 'Search conversations',
        newConversation: 'New conversation',
        newConversationTitle: 'Start a new conversation',
        newConversationDescription: 'Choose someone to start a direct conversation.',
        searchPeople: 'Search people',
        loadingUsers: 'Loading people…',
        noUsers: 'There are no people available to chat with.',
        noUsersFound: 'No people found.',
        cancel: 'Cancel',
        loading: 'Loading conversations…',
        noChats: 'No conversations yet',
        noResults: 'No matching conversations',
        yourAccount: 'Your account',
        signOut: 'Sign out',
        language: 'العربية',
        darkMode: 'Dark mode',
        lightMode: 'Light mode',
        themeToDark: 'Switch to dark mode',
        themeToLight: 'Switch to light mode',
      };
    const filteredConversations = conversations.filter((conversation) => (
      this.displayName(conversation).toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
    ));
    const filteredUsers = users.filter((user) => (
      `${user.nickName || ''} ${user.name || ''}`.toLocaleLowerCase().includes(userSearch.trim().toLocaleLowerCase())
    ));
    const selected = conversations.find((c) => c.SID === selectedSID) || null;
    const accountName = this.currentUser && this.currentUser.nickName
      ? this.currentUser.nickName
      : copy.yourAccount;
    const avatarLetter = accountName.trim().charAt(0).toLocaleUpperCase() || '?';

    return (
      <main className="chat-app" data-theme={theme} dir={isArabic ? 'rtl' : 'ltr'} lang={language}>
        <aside className={`chat-sidebar ${selected ? 'has-selection' : ''}`}>
          <header className="chat-sidebar-header">
            <img className="chat-brand-logo" src="/mashariq-logo.png" alt="Mashariq" />
            <span className="chat-app-label">{copy.appName}</span>
            <div className="chat-preferences">
              <button className="chat-icon-button chat-language-button" onClick={this.toggleLanguage} type="button">
                {copy.language}
              </button>
              <button
                aria-label={theme === 'light' ? copy.themeToDark : copy.themeToLight}
                className="chat-icon-button"
                onClick={this.toggleTheme}
                type="button"
              >
                {theme === 'light' ? '☾' : '☀'}
              </button>
            </div>
          </header>

          <div className="chat-list-heading">
            <div>
              <span className="chat-section-kicker">{isArabic ? 'مساحتك الخاصة' : 'YOUR SPACE'}</span>
              <h1>{copy.chats}</h1>
            </div>
            <div className="chat-heading-actions">
              <span className="chat-count">{conversations.length}</span>
              <button
                aria-label={copy.newConversation}
                className="chat-new-button"
                onClick={this.openNewConversation}
                title={copy.newConversation}
                type="button"
              >
                <span aria-hidden="true">＋</span>
                <span className="chat-new-button-label">{copy.newConversation}</span>
              </button>
            </div>
          </div>

          <label className="chat-search">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label={copy.search}
              onChange={this.handleSearch}
              placeholder={copy.search}
              type="search"
              value={search}
            />
          </label>

          {loading && <div className="chat-list-status">{copy.loading}</div>}
          {error && <div className="chat-list-error" role="alert">{error}</div>}
          {!loading && !error && conversations.length === 0 && (
            <div className="chat-list-status">{copy.noChats}</div>
          )}
          {!loading && !error && conversations.length > 0 && filteredConversations.length === 0 && (
            <div className="chat-list-status">{copy.noResults}</div>
          )}
          {!error && (
            <ConversationList
              conversations={filteredConversations}
              selectedSID={selectedSID}
              onSelect={this.handleSelect}
              emptyStateText={null}
              language={language}
            />
          )}

          <footer className="chat-profile">
            <span className="chat-profile-avatar">{avatarLetter}</span>
            <span className="chat-profile-copy">
              <strong>{accountName}</strong>
              <small>{copy.yourAccount}</small>
            </span>
            <button
              aria-label={copy.signOut}
              className="chat-signout"
              onClick={this.handleLogout}
              title={copy.signOut}
              type="button"
            >
              ↪
            </button>
          </footer>
        </aside>

        <section className={`chat-main ${selected ? 'has-selection' : ''}`}>
          <MessageView
            conversation={selected}
            language={language}
            onBack={() => this.setState({ selectedSID: null })}
          />
        </section>
        {newConversationOpen && (
          <div className="chat-dialog-backdrop" onMouseDown={(event) => {
            if (event.target === event.currentTarget) this.closeNewConversation();
          }}>
            <section
              aria-labelledby="new-conversation-title"
              aria-modal="true"
              className="chat-dialog"
              dir={isArabic ? 'rtl' : 'ltr'}
              lang={language}
              role="dialog"
            >
              <header className="chat-dialog-header">
                <div>
                  <span className="chat-section-kicker">{isArabic ? 'تواصل مباشر' : 'DIRECT MESSAGE'}</span>
                  <h2 id="new-conversation-title">{copy.newConversationTitle}</h2>
                  <p>{copy.newConversationDescription}</p>
                </div>
                <button
                  aria-label={copy.cancel}
                  className="chat-dialog-close"
                  disabled={creatingConversation}
                  onClick={this.closeNewConversation}
                  type="button"
                >
                  ×
                </button>
              </header>
              <label className="chat-search chat-user-search">
                <span aria-hidden="true">⌕</span>
                <input
                  autoFocus
                  aria-label={copy.searchPeople}
                  onChange={this.handleUserSearch}
                  placeholder={copy.searchPeople}
                  type="search"
                  value={userSearch}
                />
              </label>
              {usersError && <p className="chat-dialog-error" role="alert">{usersError}</p>}
              <div className="chat-user-list">
                {usersLoading && <p className="chat-dialog-status">{copy.loadingUsers}</p>}
                {!usersLoading && users.length === 0 && !usersError && (
                  <p className="chat-dialog-status">{copy.noUsers}</p>
                )}
                {!usersLoading && users.length > 0 && filteredUsers.length === 0 && (
                  <p className="chat-dialog-status">{copy.noUsersFound}</p>
                )}
                {!usersLoading && filteredUsers.map((user) => (
                  <button
                    className="chat-user-option"
                    disabled={creatingConversation}
                    key={user.SID}
                    onClick={() => this.startConversation(user.SID)}
                    type="button"
                  >
                    <span className="chat-conversation-avatar">
                      {(user.nickName || user.name || '?').trim().charAt(0).toLocaleUpperCase()}
                    </span>
                    <span className="chat-conversation-copy">
                      <span className="chat-conversation-title">{user.nickName || user.name}</span>
                      {user.name && user.nickName && user.name !== user.nickName && (
                        <span className="chat-conversation-subtitle">{user.name}</span>
                      )}
                    </span>
                    <span className="chat-user-arrow" aria-hidden="true">{isArabic ? '←' : '→'}</span>
                  </button>
                ))}
              </div>
              <footer className="chat-dialog-footer">
                <button
                  className="chat-dialog-cancel"
                  disabled={creatingConversation}
                  onClick={this.closeNewConversation}
                  type="button"
                >
                  {creatingConversation
                    ? (isArabic ? 'جارٍ إنشاء المحادثة…' : 'Starting conversation…')
                    : copy.cancel}
                </button>
              </footer>
            </section>
          </div>
        )}
      </main>
    );
  }
}

export default ChatLayout;
