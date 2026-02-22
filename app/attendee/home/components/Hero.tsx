import styles from "../styles/Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <h1>Discover Amazing Events</h1>
        <p>Tech • Music • Sports</p>
      </div>
    </div>
  );
}