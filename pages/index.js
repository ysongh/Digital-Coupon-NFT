import styles from '../styles/Home.module.css';

export default function Home({ domainData }) {

  return (
    <div className={styles.container}>
      <p>{JSON.stringify(domainData)}</p>
    </div>
  )
}
