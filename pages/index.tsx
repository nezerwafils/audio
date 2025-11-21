import { useEffect, useState } from 'react';
import { useUserStore } from '../src/lib/stores/userStore';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { user, loading, initialize } = useUserStore();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    initialize();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🎤 AudioSocial</h1>
        <nav className={styles.nav}>
          <a href="/bookmarks">📚 Bookmarks</a>
          <a href="/profile">👤 Profile</a>
          <a href="/settings">⚙️ Settings</a>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.welcome}>
          <h2>Welcome to AudioSocial</h2>
          <p>Share your voice with the world through audio posts!</p>
          {!user && (
            <div className={styles.setupPrompt}>
              <p>Set up your profile to get started</p>
              <a href="/profile" className={styles.button}>Set Up Profile</a>
            </div>
          )}
        </div>

        <div className={styles.posts}>
          {posts.length === 0 ? (
            <p className={styles.noPosts}>No posts yet. Be the first to share!</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className={styles.post}>
                {/* Post content will go here */}
              </div>
            ))
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>AudioSocial - Audio-only social media</p>
      </footer>
    </div>
  );
}
