import { useState } from 'react';
import { useUserStore } from '../src/lib/stores/userStore';
import { useRouter } from 'next/router';
import styles from '../styles/Profile.module.css';

export default function Profile() {
  const router = useRouter();
  const { user, updateProfile } = useUserStore();
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updateProfile(username.trim());
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>👤 {user ? 'Edit Profile' : 'Set Up Profile'}</h1>
        <p className={styles.subtitle}>
          {user ? 'Update your profile information' : 'Choose a username to get started'}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={loading}
              maxLength={30}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/')}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
