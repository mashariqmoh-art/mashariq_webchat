import React from 'react';
import api from '../shared/api';
import './AuthPage.css';

export default class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'register',
      name: '',
      email: '',
      nickName: '',
      mobileNo: '',
      password: '',
      confirmPassword: '',
      error: '',
      isSubmitting: false,
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleModeChange = (mode) => {
    this.setState({
      mode,
      error: '',
      password: '',
      confirmPassword: '',
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { mode, name, email, nickName, mobileNo, password, confirmPassword } = this.state;

    if (mode === 'register' && password !== confirmPassword) {
      this.setState({ error: 'Your passwords do not match.' });
      return;
    }

    this.setState({ error: '', isSubmitting: true });
    let accountCreated = false;

    try {
      const normalizedEmail = email.trim();

      if (mode === 'register') {
        await api.post('/api/auth/register', {
          name: name.trim(),
          email: normalizedEmail,
          nickName: nickName.trim(),
          mobileNo: mobileNo.trim(),
          password,
        });
        accountCreated = true;
      }

      const result = await api.post('/api/auth/login', {
        email: normalizedEmail,
        password,
      });

      if (!result.token) {
        throw new Error('Sign in succeeded, but no authentication token was returned.');
      }

      localStorage.setItem('token', result.token);
      this.props.onAuthenticated();
    } catch (error) {
      this.setState({
        mode: accountCreated ? 'login' : mode,
        error: accountCreated
          ? `Account created, but automatic sign-in failed: ${error.message}. Please sign in.`
          : error.message,
      });
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  render() {
    const { mode, name, email, nickName, mobileNo, password, confirmPassword, error, isSubmitting } = this.state;
    const isRegistering = mode === 'register';

    return (
      <main className="auth-page">
        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-intro">
            <div className="auth-brand">
              <svg className="auth-brand-mark" viewBox="0 0 48 48" aria-hidden="true">
                <g stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
                  <path d="M24 3v9M24 36v9M3 24h9M36 24h9M9.2 9.2l6.4 6.4m16.8 16.8 6.4 6.4m0-29.6-6.4 6.4m-16.8 16.8-6.4 6.4" />
                </g>
                <circle cx="24" cy="24" r="5.5" fill="currentColor" />
              </svg>
              <span className="auth-brand-name">
                <span lang="ar" dir="rtl">مشارق محادثات </span>
                <span>MASHARIQ</span>
              </span>
            </div>
            <div className="auth-intro-copy">
              <span className="auth-eyebrow">Stay connected</span>
              <h1>Bring your conversations closer.</h1>
              <p>A welcoming space to keep up with the people who matter, every day.</p>
            </div>
            <div className="auth-orbit auth-orbit-one" aria-hidden="true" />
            <div className="auth-orbit auth-orbit-two" aria-hidden="true" />
          </div>

          <div className="auth-form-panel">
            <div className="auth-form-heading">
              <h2 id="auth-title">{isRegistering ? 'Create your account' : 'Welcome back'}</h2>
              <p>
                {isRegistering
                  ? 'Join Mashariq and start chatting with your people.'
                  : 'Sign in to pick up where you left off.'}
              </p>
            </div>

            <form onSubmit={this.handleSubmit}>
              {isRegistering && (
                <>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="name">Full name</label>
                    <input
                      className="form-control auth-input"
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={this.handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="nickName">Display name</label>
                    <input
                      className="form-control auth-input"
                      id="nickName"
                      name="nickName"
                      type="text"
                      autoComplete="nickname"
                      value={nickName}
                      onChange={this.handleChange}
                      placeholder="How people see you"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="mobileNo">Mobile number</label>
                    <input
                      className="form-control auth-input"
                      id="mobileNo"
                      name="mobileNo"
                      type="tel"
                      autoComplete="tel"
                      value={mobileNo}
                      onChange={this.handleChange}
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label" htmlFor="email">Email address</label>
                <input
                  className="form-control auth-input"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={this.handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  className="form-control auth-input"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isRegistering ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={this.handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {isRegistering && (
                <div className="mb-3">
                  <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                  <input
                    className="form-control auth-input"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={this.handleChange}
                    placeholder="Enter your password again"
                    required
                  />
                </div>
              )}

              {error && (
                <div className="alert alert-danger auth-error" role="alert">
                  {error}
                </div>
              )}

              <button className="btn auth-submit w-100" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Please wait…'
                  : isRegistering ? 'Create account' : 'Sign in'}
              </button>
            </form>

            <p className="auth-switch">
              {isRegistering ? 'Already have an account?' : 'New to Mashariq?'}{' '}
              <button
                className="auth-switch-button"
                type="button"
                onClick={() => this.handleModeChange(isRegistering ? 'login' : 'register')}
              >
                {isRegistering ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </div>
        </section>
      </main>
    );
  }
}
