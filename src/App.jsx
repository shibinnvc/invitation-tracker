import { useState, Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './contexts/DataContext';
import { useAuth } from './hooks/useAuth';
import { useSeed } from './hooks/useSeed';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import InviteList from './pages/InviteList';
import SetupPage from './pages/SetupPage';
import Navbar from './components/Navbar';
import MemberFormModal from './components/MemberFormModal';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-rose-50 p-6">
          <div className="bg-white rounded-2xl shadow p-6 max-w-md w-full text-center">
            <p className="text-2xl mb-2">⚠️</p>
            <p className="font-bold text-gray-800 mb-2">Something went wrong</p>
            <p className="text-sm text-gray-500 bg-red-50 rounded-lg p-3 text-left font-mono break-all">
              {this.state.error?.message || String(this.state.error)}
            </p>
            <button
              className="mt-4 bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppShell() {
  const { authed, login, logout } = useAuth();
  const { dbError } = useData();
  const [modal, setModal] = useState(null); // null | { invitee?: object }
  useSeed();

  if (dbError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 p-6">
        <div className="bg-white rounded-2xl shadow p-6 max-w-md w-full text-center">
          <p className="text-2xl mb-2">🔒</p>
          <p className="font-bold text-gray-800 mb-1">Database Connection Error</p>
          <p className="text-sm text-gray-500 mb-3">Could not connect to Firestore. Check your Firebase project settings and security rules.</p>
          <p className="text-xs text-red-600 bg-red-50 rounded-lg p-3 text-left font-mono break-all">{dbError}</p>
          <button
            className="mt-4 bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!authed) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar onLogout={logout} />

      <Routes>
        <Route
          path="/"
          element={<Dashboard onAddMember={() => setModal({})} />}
        />
        <Route
          path="/invites"
          element={
            <InviteList
              onAddMember={() => setModal({})}
              onEditMember={(inv) => setModal({ invitee: inv })}
            />
          }
        />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {modal !== null && (
        <MemberFormModal
          invitee={modal.invitee}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <DataProvider>
          <AppShell />
        </DataProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
