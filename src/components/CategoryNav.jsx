import { Link } from 'react-router-dom'
import { categories } from '../data.js'

export function CategoryNav({ activeSlug }) {
  return <section className={`categories${activeSlug ? ' categories--page' : ''}`}>
    {categories.map((c) => (
      <Link to={`/category/${c.slug}`} key={c.slug} className={activeSlug === c.slug ? 'active' : ''}>
        <span><img src={c.icon} alt="" /></span>{c.label}
      </Link>
    ))}
  </section>
}
