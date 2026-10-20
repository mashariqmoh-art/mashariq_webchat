import React from 'react';
import api from '../shared/api';
import './AuthPage.css';

const initialForm = {
  name: '',
  nickName: '',
  mobileNo: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const translations = {
  en: {
    language: 'العربية',
    themeToDark: 'Switch to dark mode',
    themeToLight: 'Switch to light mode',
    connected: 'CONNECTED WITH PURPOSE',
    brandHeading: <>Conversations that<br />bring us closer.</>,
    brandDescription: 'A thoughtful space for your community to connect, share, and stay in touch.',
    brandFooter: 'Inspired by a tradition of care and connection',
    join: 'JOIN THE COMMUNITY',
    welcome: 'WELCOME BACK',
    registerTitle: 'Create your account',
    loginTitle: 'Sign in to WebChat',
    registerDescription: 'A few details and you’ll be ready to connect.',
    loginDescription: 'Your conversations are waiting for you.',
    accountAccess: 'Account access',
    signIn: 'Sign in',
    createAccount: 'Create account',
    fullName: 'Full name',
    fullNamePlaceholder: 'Your full name',
    displayName: 'Display name',
    displayNamePlaceholder: 'How you’ll appear',
    mobile: 'Mobile number',
    mobilePlaceholder: '+966 5X XXX XXXX',
    email: 'Email address',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    newPasswordPlaceholder: 'At least 8 characters',
    currentPasswordPlaceholder: 'Enter your password',
    confirmPassword: 'Confirm password',
    confirmPasswordPlaceholder: 'Enter your password again',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    show: 'Show',
    hide: 'Hide',
    passwordMismatch: 'Your passwords do not match.',
    pleaseWait: 'Please wait…',
    createAccountAction: 'Create your account',
    terms: 'By continuing, you agree to use WebChat respectfully and responsibly.',
  },
  ar: {
    language: 'English',
    themeToDark: 'التبديل إلى الوضع الداكن',
    themeToLight: 'التبديل إلى الوضع الفاتح',
    connected: 'تواصل يجمعنا',
    brandHeading: <>محادثات<br />تقرّبنا من بعضنا.</>,
    brandDescription: 'مساحة تجمع مجتمعك للتواصل ومشاركة اللحظات والبقاء على اتصال.',
    brandFooter: 'مستوحى من قيم التواصل والاهتمام',
    join: 'انضم إلى مجتمعنا',
    welcome: 'مرحباً بعودتك',
    registerTitle: 'أنشئ حسابك',
    loginTitle: 'سجّل الدخول إلى ويب شات',
    registerDescription: 'أدخل بعض التفاصيل وابدأ بالتواصل.',
    loginDescription: 'محادثاتك بانتظارك.',
    accountAccess: 'خيارات الحساب',
    signIn: 'تسجيل الدخول',
    createAccount: 'إنشاء حساب',
    fullName: 'الاسم الكامل',
    fullNamePlaceholder: 'أدخل اسمك الكامل',
    displayName: 'الاسم الظاهر',
    displayNamePlaceholder: 'الاسم الذي سيظهر للآخرين',
    mobile: 'رقم الجوال',
    mobilePlaceholder: '+966 5X XXX XXXX',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',
    password: 'كلمة المرور',
    newPasswordPlaceholder: '8 أحرف على الأقل',
    currentPasswordPlaceholder: 'أدخل كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    show: 'إظهار',
    hide: 'إخفاء',
    passwordMismatch: 'كلمتا المرور غير متطابقتين.',
    pleaseWait: 'يرجى الانتظار…',
    createAccountAction: 'إنشاء حسابك',
    terms: 'باستمرارك، فإنك توافق على استخدام ويب شات باحترام ومسؤولية.',
  },
};

export default class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'login',
      form: { ...initialForm },
      passwordVisible: false,
      submitting: false,
      error: '',
      language: localStorage.getItem('auth-language') === 'ar' ? 'ar' : 'en',
      theme: localStorage.getItem('auth-theme') === 'dark' ? 'dark' : 'light',
    };
  }

  setLanguage = (language) => {
    localStorage.setItem('auth-language', language);
    this.setState({ language });
  };

  toggleTheme = () => {
    const theme = this.state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('auth-theme', theme);
    this.setState({ theme });
  };

  setMode = (mode) => {
    this.setState({ mode, error: '' });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((state) => ({
      form: { ...state.form, [name]: value },
      error: '',
    }));
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { form, mode } = this.state;

    if (mode === 'register' && form.password !== form.confirmPassword) {
      this.setState({ error: translations[this.state.language].passwordMismatch });
      return;
    }

    this.setState({ submitting: true, error: '' });

    try {
      if (mode === 'register') {
        await api.post('/api/auth/register', {
          name: form.name.trim(),
          nickName: form.nickName.trim(),
          mobileNo: form.mobileNo.trim(),
          email: form.email.trim(),
          password: form.password,
        });
      }

      const result = await api.post('/api/auth/login', {
        email: form.email.trim(),
        password: form.password,
      });

      localStorage.setItem('token', result.token);
      this.props.onAuthenticated();
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ submitting: false });
    }
  };

  render() {
    const { mode, form, passwordVisible, submitting, error, language, theme } = this.state;
    const isRegistering = mode === 'register';
    const passwordType = passwordVisible ? 'text' : 'password';
    const t = translations[language];
    const isArabic = language === 'ar';

    return (
      <main className="auth-page" data-theme={theme} dir={isArabic ? 'rtl' : 'ltr'} lang={language}>
        <section className="auth-brand-panel" aria-label="Mashariq WebChat">
          <div className="auth-brand-logo">
            <img alt="Mashariq" className="auth-logo" src="/mashariq-logo.png" />
          </div>
          <div className="auth-brand-copy">
            <span className="auth-kicker">{t.connected}</span>
            <h1>{t.brandHeading}</h1>
            <p>{t.brandDescription}</p>
          </div>
          <div className="auth-brand-footer">
            <span className="auth-brand-line" />
            <span>{t.brandFooter}</span>
          </div>
          <span className="auth-orbit auth-orbit-one" aria-hidden="true" />
          <span className="auth-orbit auth-orbit-two" aria-hidden="true" />
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-wrap">
            <div className="auth-preferences" aria-label={isArabic ? 'تفضيلات العرض' : 'Display preferences'}>
              <button
                className="auth-preference-button"
                onClick={() => this.setLanguage(isArabic ? 'en' : 'ar')}
                type="button"
              >
                {t.language}
              </button>
              <button
                aria-label={theme === 'light' ? t.themeToDark : t.themeToLight}
                className="auth-preference-button"
                onClick={this.toggleTheme}
                type="button"
              >
                <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
                {theme === 'light'
                  ? (isArabic ? 'الوضع الداكن' : 'Dark mode')
                  : (isArabic ? 'الوضع الفاتح' : 'Light mode')}
              </button>
            </div>
            <div className="auth-mobile-brand">
              <img alt="Mashariq" className="auth-logo" src="/mashariq-logo.png" />
            </div>
            <div className="auth-heading">
              <span className="auth-eyebrow">{isRegistering ? t.join : t.welcome}</span>
              <h2>{isRegistering ? t.registerTitle : t.loginTitle}</h2>
              <p>
                {isRegistering
                  ? t.registerDescription
                  : t.loginDescription}
              </p>
            </div>

            <div className="auth-mode-switch" role="tablist" aria-label={t.accountAccess}>
              <button
                type="button"
                className={!isRegistering ? 'active' : ''}
                role="tab"
                aria-selected={!isRegistering}
                onClick={() => this.setMode('login')}
              >
                {t.signIn}
              </button>
              <button
                type="button"
                className={isRegistering ? 'active' : ''}
                role="tab"
                aria-selected={isRegistering}
                onClick={() => this.setMode('register')}
              >
                {t.createAccount}
              </button>
            </div>

            <form className="auth-form" onSubmit={this.handleSubmit}>
              {isRegistering && (
                <>
                  <label className="auth-field">
                    <span>{t.fullName}</span>
                    <input
                      autoComplete="name"
                      name="name"
                      onChange={this.handleChange}
                      placeholder={t.fullNamePlaceholder}
                      required
                      value={form.name}
                    />
                  </label>
                  <div className="auth-field-row">
                    <label className="auth-field">
                      <span>{t.displayName}</span>
                      <input
                        autoComplete="nickname"
                        name="nickName"
                        onChange={this.handleChange}
                        placeholder={t.displayNamePlaceholder}
                        required
                        value={form.nickName}
                      />
                    </label>
                    <label className="auth-field">
                      <span>{t.mobile}</span>
                      <input
                        autoComplete="tel"
                        name="mobileNo"
                        onChange={this.handleChange}
                        placeholder={t.mobilePlaceholder}
                        type="tel"
                        required
                        value={form.mobileNo}
                      />
                    </label>
                  </div>
                </>
              )}

              <label className="auth-field">
                <span>{t.email}</span>
                <input
                  autoComplete="email"
                  name="email"
                  onChange={this.handleChange}
                  placeholder={t.emailPlaceholder}
                  type="email"
                  required
                  value={form.email}
                />
              </label>
              <label className="auth-field">
                <span>{t.password}</span>
                <span className="auth-password-wrap">
                  <input
                    autoComplete={isRegistering ? 'new-password' : 'current-password'}
                    minLength={8}
                    name="password"
                    onChange={this.handleChange}
                    placeholder={isRegistering ? t.newPasswordPlaceholder : t.currentPasswordPlaceholder}
                    type={passwordType}
                    required
                    value={form.password}
                  />
                  <button
                    aria-label={passwordVisible ? t.hidePassword : t.showPassword}
                    className="auth-password-toggle"
                    onClick={() => this.setState((state) => ({ passwordVisible: !state.passwordVisible }))}
                    type="button"
                  >
                    {passwordVisible ? t.hide : t.show}
                  </button>
                </span>
              </label>
              {isRegistering && (
                <label className="auth-field">
                  <span>{t.confirmPassword}</span>
                  <input
                    autoComplete="new-password"
                    minLength={8}
                    name="confirmPassword"
                    onChange={this.handleChange}
                    placeholder={t.confirmPasswordPlaceholder}
                    type={passwordType}
                    required
                    value={form.confirmPassword}
                  />
                </label>
              )}

              {error && <p className="auth-error" role="alert">{error}</p>}

              <button className="auth-submit" disabled={submitting} type="submit">
                {submitting
                  ? t.pleaseWait
                  : isRegistering
                    ? t.createAccountAction
                    : t.signIn}
                {!submitting && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <p className="auth-terms">
              {t.terms}
            </p>
          </div>
        </section>
      </main>
    );
  }
}
