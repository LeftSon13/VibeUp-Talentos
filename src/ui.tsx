import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { ArrowUpRight, BriefcaseBusiness, Check, Heart, MapPin, MessageCircle, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project, User } from './domain'
import { getCompatibility, getContributionSummary, tabSlug } from './domain'
import { useVibeup } from './store'

export type BrandIconName = 'portfolio' | 'code' | 'creative' | 'opportunity' | 'learning' | 'community'

const brandIconLabels: Record<BrandIconName, string> = {
  portfolio: 'Portfólio',
  code: 'Tecnologia',
  creative: 'Criação',
  opportunity: 'Oportunidade',
  learning: 'Aprendizado',
  community: 'Comunidade',
}

export function BrandIcon({ name, className = '', decorative = true }: { name: BrandIconName; className?: string; decorative?: boolean }) {
  return <span className={`vibeup-icon vibeup-icon-${name} ${className}`} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : brandIconLabels[name]} aria-hidden={decorative ? true : undefined} />
}

export function BrandLockup({ className = 'brand-lockup' }: { className?: string }) {
  return <Link to="/feed" className={className} aria-label="VibeUp Talentos — início">
    <img className="brand-mark-image" src="/brand/vibeup-mark-v1.png" alt="" />
    <span><strong>VibeUp</strong><small>talentos em movimento</small></span>
  </Link>
}

export function Avatar({ user, size = 'md' }: { user?: User; size?: 'sm' | 'md' | 'lg' }) {
  const initials = user?.name.split(' ').slice(0, 2).map((part) => part[0]).join('') ?? 'VU'
  return <span className={`avatar avatar-${size} avatar-${user?.role ?? 'student'}`} aria-label={user?.name}>{user?.avatar.startsWith('data:image/') ? <img src={user.avatar} alt=""/> : initials}</span>
}

export function Button({ children, variant = 'primary', onClick, type = 'button', className = '', disabled }: {
  children: ReactNode; variant?: 'primary' | 'secondary' | 'quiet' | 'outline' | 'danger'; onClick?: () => void; type?: 'button' | 'submit'; className?: string; disabled?: boolean
}) {
  return <button className={`button button-${variant} ${className}`} type={type} onClick={onClick} disabled={disabled}>{children}</button>
}

export function Pill({ children, tone = '' }: { children: ReactNode; tone?: string }) {
  return <span className={`pill ${tone ? `pill-${tone}` : ''}`}>{children}</span>
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <header className="page-header"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-header-action">{action}</div>}</header>
}

export function Panel({ children, className = '', title, action, id }: { children: ReactNode; className?: string; title?: string; action?: ReactNode; id?: string }) {
  return <section id={id} className={`panel ${className}`}>{(title || action) && <div className="panel-heading">{title && <h2>{title}</h2>}{action}</div>}{children}</section>
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const dialogRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialog = dialogRef.current
    const focusable = () => dialog?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')
    window.requestAnimationFrame(() => (focusable()?.[0] ?? dialog)?.focus())
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key !== 'Tab') return
      const items = Array.from(focusable() ?? [])
      if (!items.length) { event.preventDefault(); dialog?.focus(); return }
      const first = items[0], last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('keydown', onKeyDown); previousFocus?.focus() }
  }, [onClose])
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1}><div className="modal-heading"><h2 id="modal-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Fechar">×</button></div>{children}</section></div>
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="empty-state"><BrandIcon name="portfolio" className="empty-icon"/><h3>{title}</h3><p>{text}</p>{action}</div>
}

export function Metric({ value, label, icon, note }: { value: string | number; label: string; icon: ReactNode; note?: string }) {
  return <article className="metric-card"><span className="metric-icon">{icon}</span><div><strong>{value}</strong><span>{label}</span>{note && <small>{note}</small>}</div></article>
}

export function ProjectCover({ project, compact = false }: { project: Project; compact?: boolean }) {
  const label = project.category.toLocaleUpperCase('pt-BR').slice(0, 18)
  const icon: BrandIconName = project.category === 'Tecnologia' ? 'code' : ['Design', 'Comunicação', 'Gastronomia', 'Beleza'].includes(project.category) ? 'creative' : 'portfolio'
  const coverKind = project.category === 'Tecnologia' ? 'code' : project.category === 'Design' ? 'visual' : project.category === 'Comunicação' ? 'editorial' : project.category === 'Gastronomia' ? 'food' : ['Beleza', 'Saúde'].includes(project.category) ? 'service' : ['Gestão', 'Comércio', 'Logística'].includes(project.category) ? 'data' : 'general'
  return <div className={`project-cover ${compact ? 'project-cover-compact' : ''}`} style={{ backgroundColor: project.cover }} aria-hidden="true">
    <span className="cover-label">{label}</span><span className="cover-orbit orbit-one" /><span className="cover-orbit orbit-two" />
    <span className={`cover-preview cover-preview-${coverKind}`}><span className="cover-preview-bar"><i/><i/><i/></span><span className="cover-preview-nav"/><span className="cover-preview-data"><i/><i/><i/><i/></span></span>
    <span className="cover-core"><BrandIcon name={icon}/></span>
  </div>
}

export function ProjectTile({ project, showAuthor = true }: { project: Project; showAuthor?: boolean }) {
  const { data, user, likePost, mutate } = useVibeup()
  const owner = data.users.find((item) => item.id === project.ownerId)
  const ownerContribution = owner ? getContributionSummary(data, owner.id, user.id) : undefined
  const post = data.posts.find((item) => item.projectId === project.id)
  const liked = !!post?.likedBy.includes(user.id)
  const likeCount = post ? post.likedBy.length + project.likes : project.likes
  return <article className="project-tile">
    <Link to={`/perfil/${project.ownerId}`} className="project-cover-link"><ProjectCover project={project} /></Link>
    <div className="project-tile-body">
      {showAuthor && owner && <Link to={`/perfil/${owner.id}`} className="author-line"><Avatar user={owner} size="sm" /><span><strong>{owner.name}</strong><small>{owner.course}</small></span></Link>}
      <div className="project-title-row"><Link to={`/perfil/${project.ownerId}`}><h3>{project.title}</h3></Link><button className={`save-button ${data.favorites.includes(project.id) ? 'is-saved' : ''}`} onClick={() => mutate((draft) => { draft.favorites = draft.favorites.includes(project.id) ? draft.favorites.filter((id) => id !== project.id) : [...draft.favorites, project.id] })} aria-label="Salvar projeto">{data.favorites.includes(project.id) ? <Check size={17} /> : <ArrowUpRight size={17} />}</button></div>
      <p>{project.description}</p>
      {project.location && <span className="location-line project-tile-location"><MapPin size={13} /> {project.location}</span>}
      <div className="tag-row">{project.skills.slice(0, 3).map((skill) => <Link key={skill} to={`/explorar?skill=${encodeURIComponent(skill)}`} className="skill-tag">{skill}</Link>)}</div>
      <div className="tile-footer"><span title={ownerContribution ? `Derivado de ${ownerContribution.authoredProjects} projeto(s) autoral(is), ${ownerContribution.collaborations} colaboração(ões), ${ownerContribution.challengeDeliveries} entrega(s) e ${ownerContribution.commentedPosts} post(s) comentado(s).` : undefined}><Star size={14} /> {ownerContribution?.total ?? 0} pontos</span><button className={liked ? 'liked' : ''} onClick={() => post && likePost(post.id)} aria-label="Curtir projeto"><Heart size={15} fill={liked ? 'currentColor' : 'none'} /> {likeCount}</button></div>
    </div>
  </article>
}

export function TalentCard({ person }: { person: User }) {
  const { data, user, toggleFavorite, toggleConnection } = useVibeup()
  const saved = data.favorites.includes(person.id)
  const connected = data.connections.includes(person.id)
  const count = data.projects.filter((project) => project.ownerId === person.id).length
  const contribution = getContributionSummary(data, person.id, user.id)
  const suggestedOpportunity = user.role === 'company' ? data.opportunities.find((item) => item.companyId === user.id && item.stage !== 'Encerrada') : undefined
  const evidenceSkills = data.projects.filter((project) => project.ownerId === person.id).flatMap((project) => project.skills)
  const match = suggestedOpportunity ? getCompatibility(suggestedOpportunity.requirements, [...person.skills, ...evidenceSkills]) : undefined
  return <article className="talent-card">
    <div className="talent-card-top"><Avatar user={person} size="lg" /><button className={`save-button ${saved ? 'is-saved' : ''}`} onClick={() => toggleFavorite(person.id)} aria-label={saved ? 'Remover dos favoritos' : 'Salvar talento'}>{saved ? <Check size={17} /> : <Heart size={17} />}</button></div>
    <Link to={`/perfil/${person.id}`}><h3>{person.name}</h3></Link>
    <p className="talent-course">{person.course}</p>
    <span className="location-line"><MapPin size={14} /> {person.city} · {person.unit}</span>
    <p className="talent-bio">{person.bio}</p>
    <div className="tag-row">{person.skills.slice(0, 3).map((skill) => <Pill key={skill}>{skill}</Pill>)}</div>
    <div className="talent-stats"><span><BriefcaseBusiness size={14} /> {count} projetos</span><span title={`Derivado de ${contribution.authoredProjects} projeto(s) autoral(is), ${contribution.collaborations} colaboração(ões), ${contribution.challengeDeliveries} entrega(s) e ${contribution.commentedPosts} post(s) comentado(s).`}><Star size={14} /> {contribution.total} pts</span></div>
    {match && <div className="talent-match"><strong>{match.score}%</strong><span><b>compatibilidade técnica</b><small>{match.matched.length} competências aparecem em projetos ou perfil</small></span><Link to={`/perfil/${person.id}`} aria-label="Ver projetos relacionados"><ArrowUpRight size={14}/></Link></div>}
    <div className="talent-card-actions"><Button variant={connected ? 'secondary' : 'primary'} onClick={() => toggleConnection(person.id)}>{connected ? <><Check size={16} /> Conectado</> : 'Conectar'}</Button><Link to={`/mensagens?contact=${person.id}`} className="circle-action" aria-label={`Conversar com ${person.name}`}><MessageCircle size={17} /></Link></div>
  </article>
}

export function TabBar({ items, value, onChange, idPrefix = 'section' }: { items: string[]; value: string; onChange: (item: string) => void; idPrefix?: string }) {
  const slug = (item: string) => tabSlug(item)
  function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const current = items.indexOf(value)
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : items.length - 1)) % items.length
    onChange(items[next])
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
  }
  return <div className="tab-bar" role="tablist" aria-label="Seções" onKeyDown={moveFocus}>{items.map((item) => <button id={`${idPrefix}-tab-${slug(item)}`} aria-controls={`${idPrefix}-panel`} tabIndex={value === item ? 0 : -1} className={value === item ? 'active' : ''} key={item} role="tab" aria-selected={value === item} onClick={() => onChange(item)}>{item}</button>)}</div>
}

export function useFlash() {
  const [flash, setFlash] = useState('')
  const showFlash = (message: string) => { setFlash(message); window.setTimeout(() => setFlash(''), 2600) }
  const component = flash ? <div className="toast" role="status">{flash}</div> : null
  return { showFlash, toast: component }
}
