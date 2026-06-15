import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { isAuthenticated } from '../utils/auth';

// ---------------------------------------------------------------------------
// DEMO auto-login.
// The site is a demo, so instead of showing the login page we sign in
// automatically as one of the seeded demo members and go straight to the
// dashboard. A different demo account is picked per visit to spread load
// across users (the backend enforces one active session per username).
//
// NOTE: these are demo credentials on purpose — do NOT use this pattern for
// the real/production app. The original login page is still available at
// /login.
// ---------------------------------------------------------------------------
const DEMO_USERS = [
  'somchai', 'nattaya', 'prasit', 'kanya', 'thirawat', 'pimchanok', 'apinya',
];
const DEMO_PASSWORD = 'Gpbs2026!';

export default function AutoLogin() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Loading GPBS PMS demo…');

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/home', { replace: true });
      return;
    }

    const username = DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)];

    (async () => {
      try {
        const response = await apiRequest('/login', {
          method: 'POST',
          body: JSON.stringify({ c_username: username, c_password: DEMO_PASSWORD }),
        });
        const data = await response.json();

        if (response.ok && data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user[0]));
          localStorage.setItem('sessionTimeout', data.sessionTimeout || 30);
          localStorage.setItem('lastActivity', Date.now().toString());
          navigate('/home', { replace: true });
        } else {
          setStatus('Could not start the demo. Open /login to sign in manually.');
        }
      } catch (e) {
        setStatus('Could not start the demo. Open /login to sign in manually.');
      }
    })();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(180deg, #eef3f9 0%, #e6edf6 100%)',
        color: '#243044',
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        fontSize: 16,
      }}
    >
      {status}
    </div>
  );
}
