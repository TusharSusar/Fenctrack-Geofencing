// src/pages/LoginPage.jsx
// Combined Login + Signup with animated tabs, password strength meter, show/hide
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/Fenctrack-logo.png"

export default function LoginPage() {
  const { login, signup, error, setError } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode]               = useState('login');
  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [loading, setLoading]         = useState(false);
  const [showPw, setShowPw]           = useState(false);

  function switchMode(next) {
    setMode(next); setError(null);
    setFullName(''); setEmail('');
    setPassword(''); setConfirm('');
  }

  function pwStrength(pwd) {
    let s = 0;
    if (pwd.length >= 6) s++;
    if (pwd.length >= 10) s++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  }
  const strength = pwStrength(password);
  const LABELS = ['','Weak','Fair','Good','Strong'];
  const COLORS = ['','#ef4444','#f59e0b','#22c55e','#1f9fb0'];

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (mode === 'signup') {
      if (!fullName.trim()) { setError('Please enter your full name.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      if (password !== confirm) { setError('Passwords do not match.'); return; }
    }
    setLoading(true);
    try {
      if (mode === 'login') await login(email, password);
      else await signup(fullName, email, password);
      navigate('/dashboard');
    } catch { /* error set in context */ }
    finally { setLoading(false); }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">
          <img src={logo} className='logo' alt="Logo"/>
        </div>
        <h1>FenceTrack - Smart Geofence</h1>
        <p className="login-subtitle">
          {mode === 'login' ? 'Parent Portal — Sign In' : 'Create Your Account'}
        </p>

        {/* ── Mode Tabs ─────────────────────────── */}
        <div className="auth-tabs">
          <button type="button"
            className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => switchMode('login')}>
            Sign In
          </button>
          <button type="button"
            className={`auth-tab ${mode === 'signup' ? 'auth-tab--active' : ''}`}
            onClick={() => switchMode('signup')}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          {/* Full Name — signup only */}
          {mode === 'signup' && (
            <div className="field-group field-anim">
              <label>Full Name</label>
              <input type="text" value={fullName} autoFocus required
                placeholder="Your full name" autoComplete="name"
                onChange={e => { setFullName(e.target.value); setError(null); }} />
            </div>
          )}

          <div className="field-group">
            <label>Email</label>
            <input type="email" value={email} required
              placeholder="parent@email.com" autoComplete="email"
              autoFocus={mode === 'login'}
              onChange={e => { setEmail(e.target.value); setError(null); }} />
          </div>

          <div className="field-group">
            <label>Password</label>
            <div className="password-wrap">
              <input
                type={showPw ? 'text' : 'password'} value={password} required
                placeholder={mode === 'signup' ? 'Min. 6 characters' : '········'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                onChange={e => { setPassword(e.target.value); setError(null); }} />
              <button type="button" className="btn-toggle-pw"
                onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
            {mode === 'signup' && password.length > 0 && (
              <div className="pw-strength">
                <div className="pw-strength__track">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="pw-strength__seg"
                      style={{ background: i <= strength ? COLORS[strength] : 'var(--border)' }} />
                  ))}
                </div>
                <span className="pw-strength__label" style={{ color: COLORS[strength] }}>
                  {LABELS[strength]}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password — signup only */}
          {mode === 'signup' && (
            <div className="field-group field-anim">
              <label>Confirm Password</label>
              <div className="password-wrap">
                <input type={showPw ? 'text' : 'password'} value={confirm} required
                  placeholder="Repeat password" autoComplete="new-password"
                  onChange={e => { setConfirm(e.target.value); setError(null); }} />
                {confirm.length > 0 && (
                  <span className="pw-match-icon"
                    style={{ color: confirm === password ? '#22c55e' : '#ef4444' }}>
                    {confirm === password ? '✓' : '✗'}
                  </span>
                )}
              </div>
            </div>
          )}

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary btn-auth" disabled={loading}>
            {loading
              ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
              : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>

          <p className="auth-switch">
            {mode === 'login' ? (
              <>No account?{' '}
                <button type="button" className="btn-link" onClick={() => switchMode('signup')}>Sign up free</button>
              </>
            ) : (
              <>Already registered?{' '}
                <button type="button" className="btn-link" onClick={() => switchMode('login')}>Sign in</button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}