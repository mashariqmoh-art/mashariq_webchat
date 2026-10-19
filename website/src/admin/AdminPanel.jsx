import React from 'react';
import api from '../shared/api';

class AdminPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      roles: [],
      form: { name: '', email: '', nickName: '', mobileNo: '', password: '', role: '' },
      loading: true,
      saving: false,
      error: null,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    try {
      const [usersData, rolesData] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/roles'),
      ]);
      this.setState({ users: usersData.users, roles: rolesData.roles, loading: false, error: null });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((state) => ({ form: { ...state.form, [name]: value } }));
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ saving: true, error: null });

    try {
      const body = { ...this.state.form };
      if (!body.role) delete body.role;

      await api.post('/api/admin/users', body);
      this.setState({
        form: { name: '', email: '', nickName: '', mobileNo: '', password: '', role: '' },
        saving: false,
      });
      await this.loadData();
    } catch (err) {
      this.setState({ error: err.message, saving: false });
    }
  };

  renderUserRow(user) {
    return (
      <tr key={user.SID}>
        <td>{user.SID}</td>
        <td>{user.name}</td>
        <td>{user.nickName}</td>
        <td>{user.email}</td>
        <td>{user.mobileNo}</td>
        <td>{user.roles || '—'}</td>
        <td>
          {user.isActive
            ? <span className="badge text-bg-success">active</span>
            : <span className="badge text-bg-secondary">disabled</span>}
        </td>
      </tr>
    );
  }

  renderCreateForm() {
    const { form, roles, saving } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className="card card-body mb-4">
        <h5 className="card-title">Create user</h5>
        <div className="row g-2">
          <div className="col-md-2">
            <input name="name" className="form-control" placeholder="Name" required
                   value={form.name} onChange={this.handleChange} />
          </div>
          <div className="col-md-2">
            <input name="nickName" className="form-control" placeholder="Nickname" required
                   value={form.nickName} onChange={this.handleChange} />
          </div>
          <div className="col-md-3">
            <input name="email" type="email" className="form-control" placeholder="Email" required
                   value={form.email} onChange={this.handleChange} />
          </div>
          <div className="col-md-2">
            <input name="mobileNo" className="form-control" placeholder="Mobile" required
                   value={form.mobileNo} onChange={this.handleChange} />
          </div>
          <div className="col-md-2">
            <input name="password" type="password" className="form-control" placeholder="Password" required
                   value={form.password} onChange={this.handleChange} />
          </div>
          <div className="col-md-1">
            <select name="role" className="form-select" value={form.role} onChange={this.handleChange}>
              <option value="">role…</option>
              {roles.map((role) => (
                <option key={role.SID} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Creating…' : 'Create user'}
          </button>
        </div>
      </form>
    );
  }

  render() {
    const { users, loading, error } = this.state;

    return (
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <h4 className="mb-0">Admin — Users</h4>
          <a href="/" className="btn btn-outline-secondary btn-sm ms-auto">Back to chat</a>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {!error && this.renderCreateForm()}

        {loading && <div className="text-muted">Loading…</div>}

        {!loading && !error && (
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>SID</th><th>Name</th><th>Nickname</th><th>Email</th>
                <th>Mobile</th><th>Roles</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => this.renderUserRow(user))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default AdminPanel;
