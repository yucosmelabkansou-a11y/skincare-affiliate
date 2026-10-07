import Image from 'next/image'
import styles from './InstagramPosts.module.css'

import posts from '@/data/instagramPosts.json'

export default function InstagramPosts() {
  return (
    <section className={styles.section} aria-labelledby="instagram-posts-heading">
      <div className={styles.heading}>
        <div>
          <p className={styles.label}>Instagram</p>
          <h2 id="instagram-posts-heading">Instagramの投稿</h2>
        </div>
        <a href="https://www.instagram.com/yun.skincare_/" className={styles.profile}>
          @yun.skincare_ <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className={styles.grid}>
        {posts.slice(0, 9).map((post) => (
          <a key={post.href} href={post.href} className={styles.post} aria-label={`${post.title}をInstagramで見る`}>
            <Image
              src={post.image}
              alt={post.title}
              width={640}
              height={640}
              sizes="(max-width: 767px) 30vw, (max-width: 1023px) 29vw, 304px"
              className={styles.image}
            />
            <span className={styles.title}>{post.title}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
