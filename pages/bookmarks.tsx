import { useRouter } from 'next/router';
import styles from '../styles/Bookmarks.module.css';

export default function Bookmarks() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>📚 Bookmarks</h1>
        <p className={styles.subtitle}>Your saved audio posts</p>
        
        <div className={styles.bookmarks}>
          <p className={styles.empty}>No bookmarks yet. Save posts to see them here!</p>
        </div>

        <button onClick={() => router.push('/')} className={styles.button}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
