import { useRouter } from 'next/router';
import styles from '../styles/Settings.module.css';

export default function Settings() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>⚙️ Settings</h1>
        
        <div className={styles.section}>
          <h2>About</h2>
          <p>AudioSocial - Audio-only social media platform</p>
          <p>Version 1.0.0</p>
        </div>

        <div className={styles.section}>
          <h2>Privacy</h2>
          <p>Your audio posts are public and can be heard by anyone.</p>
          <p>Your bookmarks are private and only visible to you.</p>
        </div>

        <button onClick={() => router.push('/')} className={styles.button}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
