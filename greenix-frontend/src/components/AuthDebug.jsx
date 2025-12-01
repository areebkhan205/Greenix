// src/components/AuthDebug.jsx
import { useAuth } from "../../context/AuthContext";

export default function AuthDebug() {
  const { currentUser, loading } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h4 className="font-bold mb-2">🔐 Auth Debug</h4>
      <div>
        <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>User:</strong> {currentUser ? 'Logged In' : 'Not Logged In'}
      </div>
      {currentUser && (
        <>
          <div>
            <strong>Email:</strong> {currentUser.email}
          </div>
          <div>
            <strong>Name:</strong> {currentUser.displayName || 'N/A'}
          </div>
          <div>
            <strong>UID:</strong> {currentUser.uid}
          </div>
          <div>
            <strong>Provider:</strong> {currentUser.providerData?.[0]?.providerId || 'email'}
          </div>
        </>
      )}
    </div>
  );
}