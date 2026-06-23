import { useState, useEffect } from 'react';

const SESSION_KEY = 'wedding_authed';

export function useAuth() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');

  function login() {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setAuthed(true);
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }

  return { authed, login, logout };
}
