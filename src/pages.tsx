import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowDownWideNarrow, ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness,
  Check, CheckCheck, Clock3, Filter, GraduationCap, Heart, Image, MapPin, MessageCircle, MoreHorizontal, Plus,
  Search, Send, Share2, Sparkles, Star, TrendingUp, UsersRound, Video,
} from 'lucide-react'
import type { Challenge, Community, Opportunity, Role, User } from './domain'
import { areConnected, canViewCity, canViewContact, canViewPost, canViewProfile, canViewProject, canViewUserSkills, getCompatibility, getContributionAchievements, getContributionSummary, getUserPrivacy, tabSlug } from './domain'
import { useVibeup } from './store'
import {
  Avatar, BrandIcon, BrandLockup, Button, EmptyState, Metric, Modal, PageHeader, Panel, Pill, ProjectCover, ProjectTile,
  TabBar, useFlash,
} from './ui'

const commaList = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean)
const dateLabel = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
const getPersonName = (users: User[], id: string) => users.find((item) => item.id === id)?.name ?? 'Pessoa da comunidade'
const initialNow = Date.now()
const feedDateLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(initialNow))

function useNow() {
  const [now, setNow] = useState(initialNow)
  useEffect(() => {
    const refresh = () => setNow(Date.now())
    const interval = window.setInterval(refresh, 60_000)
    return () => window.clearInterval(interval)
  }, [])
  return now
}

export function LoginPage() {
  const { switchRole, mutate, data } = useVibeup()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [role, setRole] = useState<Role>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const { showFlash, toast } = useFlash()
  function submit(event: FormEvent) {
    event.preventDefault()
    if (!email.includes('@') || password.length < 4) return showFlash('Informe um e-mail válido e uma senha com ao menos 4 caracteres.')
    if (mode === 'signup') {
      if (!name.trim() || !birthDate) return showFlash('Preencha seu nome e a data de nascimento.')
      const id = `user-local-${Date.now()}`
      mutate((draft) => draft.users.unshift({ id, name, role, email, city: 'Chapecó', unit: 'Senac Chapecó', course: role === 'company' ? 'Empresa parceira' : 'Novo perfil', area: role === 'company' ? 'Empresa' : 'Em formação', avatar: '', cover: '#e9efff', bio: 'Conte um pouco sobre o que você está construindo.', skills: [], tools: [], interests: [], availability: 'Não informado', connections: 0 }))
      mutate((draft) => { draft.currentUserId = id })
      showFlash(`Perfil ${role === 'company' ? 'empresarial' : 'de estudante'} criado neste protótipo.`)
    } else {
      switchRole(role)
      if (!data.users.some((person) => person.email.toLowerCase() === email.toLowerCase())) showFlash('Acesso demonstrativo ativado para o perfil selecionado.')
    }
    window.setTimeout(() => navigate('/feed'), 350)
  }
  return <main className="login-screen"><section className="login-visual"><BrandLockup/><div className="login-art"><span className="art-orbit art-orbit-a"/><span className="art-orbit art-orbit-b"/><img className="login-art-mark" src="/brand/vibeup-mark-v1.png" alt=""/></div><div className="login-visual-copy"><span className="eyebrow">APRENDER · CRIAR · CONECTAR</span><h1>Seu próximo capítulo começa com o que você já sabe fazer.</h1><p>Um espaço para mostrar projetos, encontrar pessoas e transformar aprendizado em oportunidade.</p><div className="login-proof"><span><b>01</b> Mostre seu processo</span><span><b>02</b> Descubra novas conexões</span><span><b>03</b> Encontre seu próximo desafio</span></div></div><div className="institutional-reference"><span>IDENTIDADE VISUAL DE REFERÊNCIA</span><div><img src="/brand/jovem-programador.png" alt="Marca Jovem Programador"/><img src="/brand/senac-sc-80-anos.png" alt="Marca Senac Santa Catarina"/></div><small>As marcas aparecem apenas como referência visual. A VibeUp é uma proposta acadêmica independente, sem vínculo ou endosso institucional.</small></div><small className="academic-note">Atividade acadêmica · proposta independente</small></section>
    <section className="login-form-wrap"><form className="login-form" onSubmit={submit}><BrandLockup className="login-mobile-brand"/><div className="login-mobile-reference"><strong className="reference-label">IDENTIDADE VISUAL DE REFERÊNCIA</strong><img src="/brand/jovem-programador.png" alt="Marca Jovem Programador"/><img src="/brand/senac-sc-80-anos.png" alt="Marca Senac Santa Catarina"/><span>Marcas exibidas apenas como referência visual. Proposta acadêmica independente, sem vínculo ou endosso institucional.</span></div><div className="login-title"><span className="eyebrow">BEM-VINDO À VIBEUP</span><h2>{mode === 'login' ? 'Entre para sua comunidade' : 'Crie seu espaço profissional'}</h2><p>{mode === 'login' ? 'Continue construindo sua trajetória.' : 'É rápido e você pode ajustar seus dados depois.'}</p></div><div className="role-selector"><button type="button" className={role === 'student' ? 'selected' : ''} onClick={() => setRole('student')}><GraduationCap size={16}/> Sou estudante</button><button type="button" className={role === 'company' ? 'selected' : ''} onClick={() => setRole('company')}><BriefcaseBusiness size={16}/> Sou empresa</button></div>{mode === 'signup' && <><label>Nome completo<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Como quer ser chamado?" required /></label><label>Data de nascimento<input value={birthDate} onChange={(event) => setBirthDate(event.target.value)} type="date" required /></label></>}<label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={role === 'company' ? 'voce@empresa.com.br' : 'voce@email.com'} required /></label><label>Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo de 4 caracteres" required /></label>{mode === 'login' && <button type="button" className="forgot-link" onClick={() => showFlash('Link de recuperação simulado. Verifique a caixa de entrada demonstrativa.')}>Esqueci minha senha</button>}<Button type="submit" className="login-submit">{mode === 'login' ? 'Entrar na VibeUp' : 'Criar minha conta'} <ArrowRight size={16} /></Button><div className="demo-access"><Sparkles size={15}/><span>Acesso rápido para apresentação</span><button type="button" onClick={() => { switchRole('student'); navigate('/feed') }}>Estudante</button><button type="button" onClick={() => { switchRole('company'); navigate('/feed') }}>Empresa</button></div><p className="signup-toggle">{mode === 'login' ? 'Ainda não tem conta?' : 'Já tem conta?'} <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Cadastre-se' : 'Entrar'}</button></p><small className="privacy-hint">Ao continuar, você concorda com os termos do protótipo. Seus dados ficam apenas neste navegador.</small></form></section>{toast}</main>
}

function PostCard({ post }: { post: (typeof useVibeup extends () => infer T ? T : never)['data']['posts'][number] }) {
  const { data, user, likePost, commentPost, toggleFavorite } = useVibeup()
  const [commentOpen, setCommentOpen] = useState(false)
  const [comment, setComment] = useState('')
  const { showFlash, toast } = useFlash()
  const now = useNow()
  const author = data.users.find((person) => person.id === post.authorId)!
  const linkedProject = data.projects.find((item) => item.id === post.projectId)
  const project = linkedProject && canViewProject(data, user.id, linkedProject) ? linkedProject : undefined
  const liked = post.likedBy.includes(user.id)
  const expired = post.expiresAt && new Date(post.expiresAt).getTime() < now
  const postImages = (post.media ?? []).filter((item) => item.startsWith('data:image/'))
  const namedAttachments = (post.media ?? []).filter((item) => !item.startsWith('data:image/'))
  if (expired || !canViewPost(data, user.id, post)) return null
  const location = canViewCity(data, user.id, author.id) ? author.city : 'Localização oculta'
  async function sharePost() {
    const shareUrl = new URL(window.location.href)
    shareUrl.hash = `post-${encodeURIComponent(post.id)}`
    const shareData = { title: `Publicação de ${author.name} | VibeUp`, text: post.text, url: shareUrl.toString() }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        showFlash('Compartilhamento concluído.')
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url)
      } else {
        const field = document.createElement('textarea')
        field.value = shareData.url
        field.setAttribute('readonly', '')
        field.style.position = 'fixed'
        field.style.left = '-9999px'
        document.body.append(field)
        field.select()
        const copied = document.execCommand('copy')
        field.remove()
        if (!copied) throw new Error('Cópia indisponível')
      }
      showFlash('Link da publicação copiado para compartilhar.')
    } catch {
      showFlash('Não foi possível copiar o link. Tente compartilhar novamente pelo navegador.')
    }
  }
  return <article className="post-card" id={`post-${post.id}`}>
    <div className="post-author"><Link to={`/perfil/${author.id}`}><Avatar user={author}/></Link><div><Link to={`/perfil/${author.id}`}><strong>{author.name}</strong></Link><span>{author.course} · {location} · {post.expiresAt ? 'Publicação temporária' : 'Portfólio aberto'}</span></div><button className="more-button" aria-label="Mais opções"><MoreHorizontal size={18}/></button></div>
    <p className="post-copy">{post.text}</p>
    {project && <div className="post-project"><Link to={`/perfil/${project.ownerId}`}><ProjectCover project={project} compact /></Link><div><span className="eyebrow">PROJETO EM DESTAQUE</span><Link to={`/perfil/${project.ownerId}`}><h3>{project.title}</h3></Link><p>{project.description}</p>{project.location && <p className="post-project-location"><MapPin size={13}/>{project.location}</p>}<div className="tag-row">{project.skills.slice(0, 4).map((skill) => <Link key={skill} to={`/explorar?skill=${encodeURIComponent(skill)}`} className="skill-tag">{skill}</Link>)}</div></div></div>}
    {(postImages.length > 0 || namedAttachments.length > 0) && <div className="post-media-gallery" role="group" aria-label="Anexos da publicação">{postImages.map((image, index) => <img key={`${post.id}-image-${index}`} src={image} alt={`Imagem ${index + 1} anexada por ${author.name}`} style={{ display: 'block', maxWidth: '100%', maxHeight: 440, objectFit: 'contain', borderRadius: 8, marginTop: 10 }}/>)}{namedAttachments.map((attachment, index) => <p key={`${post.id}-attachment-${index}`} className="post-attachment-label">{attachment.startsWith('video:') ? 'Vídeo anexado: ' : 'Arquivo anexado: '}{attachment.startsWith('video:') ? attachment.slice(6) : attachment}</p>)}</div>}
    <div className="post-actions"><button className={liked ? 'liked' : ''} onClick={() => likePost(post.id)}><Heart size={16} fill={liked ? 'currentColor' : 'none'}/> {post.likedBy.length + (project?.likes ?? 0)}</button><button onClick={() => setCommentOpen(!commentOpen)}><MessageCircle size={16}/> {post.comments.length} comentários</button><button onClick={() => toggleFavorite(post.projectId ?? post.id)}><ArrowUpRight size={16}/> Salvar</button><button onClick={sharePost} aria-label={`Compartilhar publicação de ${author.name}`}><Share2 size={16}/> Compartilhar</button></div>
    {commentOpen && <div className="comment-area">{post.comments.map((item) => <p key={item.id}><strong>{canViewProfile(data, user.id, item.authorId) ? getPersonName(data.users, item.authorId) : 'Pessoa da comunidade'}</strong> {item.text}</p>)}<form onSubmit={(event) => { event.preventDefault(); if (comment.trim()) { commentPost(post.id, comment.trim()); setComment('') } }}><input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Escreva um comentário..." aria-label="Escreva um comentário"/><button aria-label="Enviar comentário"><Send size={15}/></button></form></div>}
    {toast}
  </article>
}

export function FeedPage() {
  const { data, user, toggleConnection } = useVibeup()
  const now = useNow()
  const [feedFilter, setFeedFilter] = useState('Para você')
  const userProjects = data.projects.filter((item) => item.ownerId === user.id)
  const visibleProjects = data.projects.filter((project) => canViewProject(data, user.id, project))
  const normalizeAffinity = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/[^a-z0-9]+/g, ' ').trim()
  const genericAffinitySignals = new Set(['aprendizado pratico', 'colaboracao', 'projeto', 'projetos'])
  const affinitySignals = (values: string[]) => Array.from(new Map(values.filter(Boolean).map((value) => [normalizeAffinity(value), value.trim()])).entries())
    .filter(([normalized]) => normalized && !genericAffinitySignals.has(normalized))
    .map(([normalized, label]) => ({ normalized, label }))
  const userInterestSignals = affinitySignals(user.interests ?? [])
  const userCompetencySignals = affinitySignals([
    ...(user.skills ?? []),
    ...userProjects.flatMap((project) => project.skills),
  ])
  const hasAffinitySignals = userInterestSignals.length > 0 || userCompetencySignals.length > 0
  const containsSignal = (content: string, signal: string) => ` ${normalizeAffinity(content)} `.includes(` ${signal} `)
  const skillCounts = new Map<string, { label: string; count: number }>()
  visibleProjects.forEach((project) => new Set(project.skills).forEach((skill) => {
    const key = skill.trim().toLocaleLowerCase('pt-BR')
    const current = skillCounts.get(key)
    skillCounts.set(key, { label: current?.label ?? skill, count: (current?.count ?? 0) + 1 })
  }))
  const trendingSkills = [...skillCounts.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'pt-BR')).slice(0, 4)
  const openOpportunities = data.opportunities.filter((item) => item.stage !== 'Encerrada' && item.stage !== 'Concluída').length
  const firstName = user.name.split(' ')[0]
  const userContribution = getContributionSummary(data, user.id, user.id)
  const chronologicalPosts = (left: { post: (typeof data.posts)[number] }, right: { post: (typeof data.posts)[number] }) => right.post.createdAt.localeCompare(left.post.createdAt)
  const feed = data.posts.filter((post) => canViewPost(data, user.id, post) && !data.blocked.includes(post.authorId) && (!post.expiresAt || new Date(post.expiresAt).getTime() > now)).map((post) => {
    const linkedProject = post.projectId ? data.projects.find((project) => project.id === post.projectId) : undefined
    const visibleProject = linkedProject && canViewProject(data, user.id, linkedProject) ? linkedProject : undefined
    const postText = [post.text, ...(visibleProject ? [visibleProject.title, visibleProject.description, visibleProject.category] : [])].join(' ')
    const visibleProjectSkills = visibleProject?.skills ?? []
    const matchedInterests = userInterestSignals.filter((signal) => containsSignal(postText, signal.normalized))
    const matchedCompetencies = userCompetencySignals.filter((signal) => visibleProjectSkills.some((skill) => normalizeAffinity(skill) === signal.normalized) || containsSignal(post.text, signal.normalized))
    const reasons = [
      ...matchedInterests.slice(0, 1).map((signal) => `interesse em ${signal.label}`),
      ...matchedCompetencies.slice(0, 1).map((signal) => `competência ${signal.label}`),
    ]
    return { post, score: matchedInterests.length * 2 + matchedCompetencies.length * 3, rationale: reasons.join(' · ') }
  }).sort((left, right) => feedFilter === 'Recentes' ? chronologicalPosts(left, right) : right.score - left.score || chronologicalPosts(left, right))
  const peopleToMeet = data.users.filter((person) => person.id !== user.id
    && !data.blocked.includes(person.id)
    && !areConnected(data, user.id, person.id)
    && canViewProfile(data, user.id, person.id)
    && (user.role !== 'company' || person.role === 'student'))
    .map((person) => {
      const skillsVisible = canViewUserSkills(data, user.id, person.id)
      const profileProjects = skillsVisible ? data.projects.filter((project) => project.ownerId === person.id && canViewProject(data, user.id, project)) : []
      const personInterests = affinitySignals(person.interests ?? [])
      const personCompetencies = affinitySignals(skillsVisible ? [...(person.skills ?? []), ...profileProjects.flatMap((project) => project.skills)] : [])
      const sharedInterests = userInterestSignals.filter((signal) => personInterests.some((candidateSignal) => candidateSignal.normalized === signal.normalized))
      const sharedCompetencies = userCompetencySignals.filter((signal) => personCompetencies.some((candidateSignal) => candidateSignal.normalized === signal.normalized))
      const score = sharedInterests.length * 2 + sharedCompetencies.length * 3
      const reasons = [
        ...sharedInterests.slice(0, 1).map((signal) => `interesse em ${signal.label}`),
        ...sharedCompetencies.slice(0, 1).map((signal) => `competência ${signal.label}`),
      ]
      return { person, score, rationale: reasons.join(' · ') }
    }).filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || getContributionSummary(data, right.person.id, user.id).total - getContributionSummary(data, left.person.id, user.id).total)
    .slice(0, 4)
  return <>
    <PageHeader eyebrow={feedDateLabel} title={user.role === 'company' ? `Olá, ${firstName}. Encontre talentos pelo que já construíram.` : `Olá, ${firstName}. O que você está construindo?`} description={user.role === 'company' ? 'Veja projetos de estudantes, confira as competências demonstradas e comece uma conversa.' : 'Acompanhe projetos da turma, encontre parceiros e compartilhe o que está aprendendo.'} action={<Link className="button button-primary" to="/publicar"><Plus size={16}/> Criar publicação</Link>} />
    <div className="feed-metrics"><Metric value={userProjects.length} label="projetos no portfólio" icon={<Sparkles size={17}/>} note="Projetos que você publicou"/><Metric value={user.connections} label="conexões" icon={<UsersRound size={17}/>} note="Pessoas na sua rede"/><Metric value={userContribution.total} label="pontos de contribuição" icon={<Star size={17}/>} note="Cálculo local sobre suas contribuições"/><Metric value={openOpportunities} label="oportunidades abertas" icon={<BriefcaseBusiness size={17}/>} note="Vagas, estágios e projetos"/></div>
    <section className="preview-layout"><div className="feed-column"><div className="intro-banner"><div><span className="eyebrow">PORTFÓLIO EM CONSTRUÇÃO</span><h2>{user.role === 'company' ? 'Veja o trabalho de estudantes em contexto.' : 'Compartilhe o que você está construindo.'}</h2><p>{user.role === 'company' ? 'Abra projetos, confira as habilidades aplicadas e convide quem combina com a oportunidade.' : 'Conte o que você tentou e o que aprendeu. Um projeto em andamento também merece ser mostrado.'}</p><Link to={user.role === 'company' ? '/explorar' : '/publicar'}>{user.role === 'company' ? 'Encontrar talentos' : 'Publicar uma atualização'} <ArrowUpRight size={16}/></Link></div><div className="banner-shape"><img className="banner-shape-mark" src="/brand/vibeup-mark-v1.png" alt=""/></div></div><div className="feed-section-heading"><div><span className="eyebrow">NA REDE VIBEUP</span><h2>{user.role === 'company' ? 'Projetos de estudantes' : 'Novidades da comunidade'}</h2></div><select className="feed-filter" value={feedFilter} onChange={(event) => setFeedFilter(event.target.value)}><option>Para você</option><option>Recentes</option></select></div>{feedFilter === 'Para você' && <p className="feed-affinity-guide" role="status">{hasAffinitySignals ? 'Ordenado por interesses e competências em comum. Cada publicação indica a afinidade encontrada.' : 'Adicione interesses ou competências ao perfil para personalizar a ordem. Sem sinais informados, as publicações seguem em ordem cronológica.'}</p>}{feed.length ? feed.map((item) => <div className="feed-post-result" key={item.post.id}>{feedFilter === 'Para você' && item.rationale && <p className="feed-post-affinity">Em destaque por: {item.rationale}</p>}<PostCard post={item.post}/></div>) : <EmptyState title="Sua rede ainda está quieta" text="Siga estudantes ou explore comunidades para ver projetos e conversas por aqui." action={<Link className="button button-outline" to="/explorar">Explorar a comunidade</Link>}/>}
      </div><aside className="right-column"><Panel className="profile-mini"><div className="mini-cover"/><Avatar user={user} size="lg"/><h3>{user.name}</h3><p>{user.course}</p><div className="mini-stats"><span><strong>{userProjects.length}</strong>projetos</span><span><strong>{user.connections}</strong>conexões</span><span><strong>{userContribution.total}</strong>pontos</span></div><Link to={`/perfil/${user.id}`}>Ver meu portfólio <ArrowUpRight size={15}/></Link></Panel><Panel className="feed-people-panel" title="Pessoas para conhecer"><p className="muted">Perfis públicos com interesses ou competências em comum.</p>{peopleToMeet.length ? <div className="feed-people-list">{peopleToMeet.map(({ person, rationale }) => <article className="feed-person-suggestion" key={person.id}><Link to={`/perfil/${person.id}`} className="feed-person-link"><Avatar user={person} size="sm"/><span><strong>{person.name}</strong><small>{person.role === 'company' ? 'Empresa parceira' : person.course}</small></span></Link><p>{rationale}</p><button type="button" className="feed-person-connect" aria-label={`Conectar com ${person.name}`} onClick={() => toggleConnection(person.id)}><UsersRound size={13}/> Conectar</button></article>)}</div> : <p className="feed-people-empty">{!hasAffinitySignals ? 'Informe interesses ou competências no seu perfil para encontrar afinidades.' : 'Nenhum perfil público com afinidade direta apareceu agora.'}</p>}</Panel><Panel><div className="side-card-title"><h3>Competências em projetos</h3></div><p className="muted">Habilidades mais citadas nos projetos visíveis para você.</p>{trendingSkills.length ? trendingSkills.map(({ label, count }) => <Link className="trend-row" to={`/explorar?skill=${encodeURIComponent(label)}`} key={label}><span>{label}</span><small>{count} {count === 1 ? 'projeto' : 'projetos'}</small></Link>) : <p className="muted">As competências aparecem aqui conforme os projetos forem publicados.</p>}</Panel><Panel className="event-mini"><span className="eyebrow">PRÓXIMO ENCONTRO</span><h3>{data.events[0]?.title ?? 'Nenhum encontro programado'}</h3><p>{data.events[0] && `${dateLabel(data.events[0].date)} · ${data.events[0].time}`}</p><Link to="/eventos">Ver agenda <ArrowUpRight size={15}/></Link></Panel></aside></section>
  </>
}

export function CreatePostPage() {
  const { addPost, data, user } = useVibeup()
  const navigate = useNavigate()
  const [project, setProject] = useState(true)
  const [temporary, setTemporary] = useState(false)
  const [media, setMedia] = useState<{ kind: 'image'; src: string; name: string } | { kind: 'video'; name: string } | null>(null)
  const [mediaProcessing, setMediaProcessing] = useState(false)
  const [collaboratorSearch, setCollaboratorSearch] = useState('')
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([])
  const { showFlash, toast } = useFlash()
  const availableCollaborators = data.users.filter((person) => person.id !== user.id && canViewProfile(data, user.id, person.id))
    .sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'))
  const visibleCollaborators = availableCollaborators.filter((person) => `${person.name} ${person.course}`.toLocaleLowerCase('pt-BR').includes(collaboratorSearch.toLocaleLowerCase('pt-BR')))

  async function prepareMedia(file?: File) {
    if (!file) return
    if (file.type.startsWith('image/')) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        showFlash('Escolha uma imagem JPG, PNG ou WebP.')
        return
      }
      if (file.size > 8 * 1024 * 1024) {
        showFlash('A imagem deve ter até 8 MB antes da compressão.')
        return
      }
      setMediaProcessing(true)
      let bitmap: ImageBitmap | undefined
      try {
        bitmap = await createImageBitmap(file)
        if (!bitmap.width || !bitmap.height || bitmap.width * bitmap.height > 40_000_000) throw new Error('Dimensões inválidas')
        let width = Math.max(1, Math.round(bitmap.width * Math.min(1, 1280 / bitmap.width, 960 / bitmap.height)))
        let height = Math.max(1, Math.round(bitmap.height * Math.min(1, 1280 / bitmap.width, 960 / bitmap.height)))
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Canvas indisponível')
        for (let pass = 0; pass < 8; pass += 1) {
          canvas.width = width
          canvas.height = height
          context.fillStyle = '#fff'
          context.fillRect(0, 0, width, height)
          context.drawImage(bitmap, 0, 0, width, height)
          for (const quality of [0.82, 0.74, 0.66, 0.58, 0.5]) {
            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
            if (!blob || blob.size > 180_000) continue
            const src = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Falha ao ler a imagem'))
              reader.onerror = () => reject(reader.error ?? new Error('Falha ao ler a imagem'))
              reader.readAsDataURL(blob)
            })
            setMedia({ kind: 'image', src, name: file.name })
            return
          }
          width = Math.max(1, Math.round(width * 0.8))
          height = Math.max(1, Math.round(height * 0.8))
        }
        throw new Error('Imagem acima do limite local')
      } catch {
        showFlash('Não foi possível reduzir esta imagem ao limite local. Tente um arquivo menor.')
      } finally {
        bitmap?.close()
        setMediaProcessing(false)
      }
      return
    }
    if (file.type.startsWith('video/')) {
      if (file.size > 30 * 1024 * 1024) {
        showFlash('O vídeo deve ter até 30 MB. Nesta demonstração, guardamos apenas o nome do arquivo.')
        return
      }
      setMedia({ kind: 'video', name: file.name })
      return
    }
    showFlash('Escolha uma imagem JPG, PNG, WebP ou um vídeo.')
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const description = String(form.get('description') ?? '').trim()
    if (!description) return showFlash('Escreva uma descrição antes de publicar.')
    const allowedIds = new Set(availableCollaborators.map((person) => person.id))
    const collaboratorIds = selectedCollaborators.filter((id) => allowedIds.has(id))
    const storedMedia = media ? [media.kind === 'image' ? media.src : `video:${media.name}`] : []
    addPost({ text: description, title: String(form.get('title') ?? ''), category: String(form.get('category') ?? ''), course: String(form.get('course') ?? ''), skills: commaList(String(form.get('skills') ?? '')), tools: commaList(String(form.get('tools') ?? '')), collaborators: project ? collaboratorIds : [], links: commaList(String(form.get('link') ?? '')), location: String(form.get('location') ?? ''), communityId: String(form.get('communityId') ?? ''), privacy: String(form.get('privacy') ?? 'Público'), media: storedMedia, project, temporary })
    showFlash('Publicação adicionada ao feed e ao portfólio.')
    window.setTimeout(() => navigate('/feed'), 500)
  }

  return <><PageHeader eyebrow="COMPARTILHE SEU PROCESSO" title="Criar publicação" description="Mostre o que você está aprendendo, construindo ou descobrindo."/><form className="content-form" onSubmit={submit}><Panel className="form-panel"><div className="form-toggle-row"><div><strong>Adicionar ao portfólio</strong><small>Projetos permanecem disponíveis no seu perfil.</small></div><button type="button" className={`switch ${project ? 'on' : ''}`} onClick={() => setProject(!project)} aria-pressed={project}><i/></button></div>{project && <><label>Título do projeto<input name="title" placeholder="Ex.: identidade visual para feira local" required/></label><div className="form-grid"><label>Categoria<select name="category"><option>Tecnologia</option><option>Design</option><option>Gestão</option><option>Gastronomia</option><option>Comunicação</option><option>Saúde</option><option>Logística</option></select></label><label>Curso relacionado<input name="course" placeholder="Seu curso atual"/></label></div><label>Competências demonstradas<input name="skills" placeholder="Ex.: React, Figma, Excel"/><small>Separe as competências por vírgula para relacioná-las aos projetos.</small></label><label>Ferramentas utilizadas<input name="tools" placeholder="Ex.: VS Code, Figma, Power BI"/></label><div className="collaborator-picker"><label htmlFor="collaborator-search">Buscar colaboradores</label><input id="collaborator-search" type="search" value={collaboratorSearch} onChange={(event) => setCollaboratorSearch(event.target.value)} placeholder="Nome ou curso"/><small>Selecione perfis visíveis. O vínculo e os links do perfil respeitam as opções de privacidade.</small><div role="group" aria-label="Perfis disponíveis para colaboração" style={{ display: 'grid', gap: 5, maxHeight: 190, overflowY: 'auto', marginTop: 7, padding: 7, border: '1px solid #e2e6ed', borderRadius: 7 }}>{visibleCollaborators.map((person) => <label key={person.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 3px' }}><input type="checkbox" name="collaborators" value={person.id} checked={selectedCollaborators.includes(person.id)} onChange={(event) => setSelectedCollaborators((current) => event.target.checked ? [...current, person.id] : current.filter((id) => id !== person.id))} style={{ width: 16, minHeight: 16, padding: 0, flex: 'none' }}/><Avatar user={person} size="sm"/><span style={{ display: 'grid', minWidth: 0 }}><strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{person.name}</strong><small style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{person.course}</small></span></label>)}{visibleCollaborators.length === 0 && <small>Nenhum perfil público encontrado para esta busca.</small>}</div><small>{selectedCollaborators.length} {selectedCollaborators.length === 1 ? 'colaborador selecionado' : 'colaboradores selecionados'}</small></div></>}
      <label>Descrição<textarea name="description" rows={5} placeholder="Conte o contexto, suas decisões e o que aprendeu..." required/></label>
      <div className="attach-box"><div><Image size={18}/><Video size={18}/><span>{mediaProcessing ? 'Comprimindo imagem…' : media ? media.name : 'Adicione imagens ou vídeos'}</span></div><label className="button button-outline">Escolher arquivo<input type="file" accept="image/jpeg,image/png,image/webp,video/*" disabled={mediaProcessing} onChange={(event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ''; void prepareMedia(file) }} hidden/></label></div>
      {media && <div className="attachment-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: 9, border: '1px solid #e2e6ed', borderRadius: 7 }} role="status">{media.kind === 'image' ? <img src={media.src} alt={`Prévia da imagem ${media.name}`} style={{ display: 'block', maxWidth: 'min(100%, 280px)', maxHeight: 170, objectFit: 'contain', borderRadius: 5 }}/> : <span>Vídeo selecionado: {media.name} (somente o nome será salvo)</span>}<button type="button" className="button button-quiet" onClick={() => setMedia(null)}>Remover anexo</button></div>}
      <div className="form-grid"><label>Link externo<input name="link" type="url" placeholder="https://"/></label><div className="form-note">Links e anexos acompanham a publicação no feed. Imagens são comprimidas antes de serem salvas neste navegador.</div></div><div className="form-grid"><label>Localização<input name="location" placeholder="Cidade ou unidade Senac"/></label><label>Comunidade<select name="communityId"><option value="">Conexões da VibeUp</option>{data.communities.map((community) => <option key={community.id} value={community.id}>{community.name}</option>)}</select></label></div><div className="form-grid"><label>Privacidade<select name="privacy"><option>Público</option><option>Somente conexões</option><option>Privado</option></select></label><div className="form-note">Projetos públicos podem aparecer em pesquisas de competências. Essas opções organizam a demonstração local neste navegador; não são controles de segurança.</div></div><div className="form-toggle-row"><div><strong>Publicação temporária</strong><small>Desaparece do feed em 24 horas.</small></div><button type="button" className={`switch ${temporary ? 'on' : ''}`} onClick={() => setTemporary(!temporary)} aria-pressed={temporary}><i/></button></div><div className="form-actions"><Button variant="outline" onClick={() => navigate('/feed')}>Cancelar</Button><Button type="submit" disabled={mediaProcessing}><Plus size={16}/> Publicar agora</Button></div></Panel><aside className="form-aside"><Panel><span className="eyebrow">DICA VIBEUP</span><h3>Mostre a evidência junto da habilidade.</h3><p>Ao relacionar competências e ferramentas, empresas conseguem entender como você aplicou o que sabe.</p></Panel><Panel><span className="eyebrow">PRÉVIA DO PORTFÓLIO</span><div className="preview-project-placeholder"><Sparkles size={20}/><strong>{project ? 'Projeto permanente' : 'Publicação no feed'}</strong><small>{temporary ? 'Visível por 24 horas' : 'Aparece no seu perfil'}</small>{media?.kind === 'image' && <img src={media.src} alt="Prévia no cartão de publicação" style={{ display: 'block', maxWidth: '100%', maxHeight: 100, objectFit: 'contain', borderRadius: 5 }}/>}</div></Panel></aside></form>{toast}</>
}

export function ProfilePage() {
  const { id } = useParams()
  const { data, user, toggleConnection, toggleFavorite, toggleBlock, updateProfile } = useVibeup()
  const person = data.users.find((item) => item.id === (id ?? user.id)) ?? user
  const own = person.id === user.id
  const canEditCareerDetails = own && (person.role === 'student' || person.role === 'company')
  const isBlocked = !own && data.blocked.includes(person.id)
  const profileVisible = canViewProfile(data, user.id, person.id)
  const canSeeSkills = canViewUserSkills(data, user.id, person.id)
  const canSeeCity = canViewCity(data, user.id, person.id)
  const canSeeContact = canViewContact(data, user.id, person.id)
  const [tab, setTab] = useState('Projetos / Portfólio')
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(person.name)
  const [editBio, setEditBio] = useState(person.bio)
  const [editSkills, setEditSkills] = useState(person.skills.join(', '))
  const [editTools, setEditTools] = useState(person.tools.join(', '))
  const [editAvailability, setEditAvailability] = useState(person.availability)
  const [editExperiences, setEditExperiences] = useState((person.experiences ?? []).join('\n'))
  const [editCourses, setEditCourses] = useState((person.courses ?? []).join('\n'))
  const [editCertificates, setEditCertificates] = useState((person.certificates ?? []).join('\n'))
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [coverDraft, setCoverDraft] = useState('')
  const [coverPreviewOpen, setCoverPreviewOpen] = useState(false)
  const [coverProcessing, setCoverProcessing] = useState(false)
  const { showFlash, toast } = useFlash()
  const now = useNow()
  const projects = data.projects.filter((project) => canSeeSkills && (project.ownerId === person.id || project.collaborators.includes(person.id)) && canViewProject(data, user.id, project))
  const visiblePosts = data.posts.filter((post) => post.authorId === person.id && canViewPost(data, user.id, post) && (!post.expiresAt || new Date(post.expiresAt).getTime() > now))
  const personContribution = getContributionSummary(data, person.id, user.id)
  const personAchievements = getContributionAchievements(data, person.id, user.id)
  const personCommunities = data.communities.filter((community) => community.members.includes(person.id))
  const connected = areConnected(data, user.id, person.id)
  const skills = canSeeSkills ? Array.from(new Set([...person.skills, ...projects.flatMap((project) => project.skills)])) : []
  const profileExperiences = canSeeSkills ? (person.experiences ?? []).map((item) => item.trim()).filter(Boolean) : []
  const profileCourses = canSeeSkills ? (person.courses ?? []).map((item) => item.trim()).filter(Boolean) : []
  const profileCertificates = canSeeSkills ? (person.certificates ?? []).map((item) => item.trim()).filter(Boolean) : []
  const locationLabel = canSeeCity ? `${person.unit} · ${person.city}` : 'Unidade e cidade não compartilhadas'
  const coverIsImage = person.cover.startsWith('data:image/')
  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const optionalLines = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
    updateProfile({
      name: editName,
      bio: editBio,
      skills: commaList(editSkills),
      tools: commaList(editTools),
      availability: editAvailability,
      ...(canEditCareerDetails ? {
        experiences: optionalLines(editExperiences),
        courses: optionalLines(editCourses),
        certificates: optionalLines(editCertificates),
      } : {}),
    })
    setEditing(false)
    showFlash('Perfil atualizado e salvo neste navegador.')
  }
  async function prepareCover(file?: File) {
    if (!file) return
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      showFlash('Escolha uma imagem JPG, PNG ou WebP.')
      if (coverInputRef.current) coverInputRef.current.value = ''
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      showFlash('A imagem deve ter até 8 MB antes da compressão.')
      if (coverInputRef.current) coverInputRef.current.value = ''
      return
    }

    setCoverProcessing(true)
    let bitmap: ImageBitmap | undefined
    try {
      bitmap = await createImageBitmap(file)
      if (!bitmap.width || !bitmap.height || bitmap.width * bitmap.height > 40_000_000) throw new Error('Dimensões da imagem inválidas')
      let width = Math.max(1, Math.round(bitmap.width * Math.min(1, 1600 / bitmap.width, 900 / bitmap.height)))
      let height = Math.max(1, Math.round(bitmap.height * Math.min(1, 1600 / bitmap.width, 900 / bitmap.height)))
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas indisponível')

      for (let sizePass = 0; sizePass < 6; sizePass += 1) {
        canvas.width = width
        canvas.height = height
        context.fillStyle = '#f2eafb'
        context.fillRect(0, 0, width, height)
        context.drawImage(bitmap, 0, 0, width, height)
        for (const quality of [0.84, 0.76, 0.68, 0.6, 0.52]) {
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
          if (!blob || blob.size > 300_000) continue
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Falha ao ler a imagem'))
            reader.onerror = () => reject(reader.error ?? new Error('Falha ao ler a imagem'))
            reader.readAsDataURL(blob)
          })
          setCoverDraft(dataUrl)
          setCoverPreviewOpen(true)
          return
        }
        width = Math.max(1, Math.round(width * 0.78))
        height = Math.max(1, Math.round(height * 0.78))
      }
      throw new Error('A imagem não pôde ser reduzida ao limite local')
    } catch {
      showFlash('Não foi possível preparar esta imagem. Tente outro arquivo JPG, PNG ou WebP.')
    } finally {
      bitmap?.close()
      setCoverProcessing(false)
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
  }
  function closeCoverPreview() {
    setCoverPreviewOpen(false)
    setCoverDraft('')
  }
  function saveCover() {
    if (!coverDraft) return
    updateProfile({ cover: coverDraft })
    closeCoverPreview()
    showFlash('Capa atualizada e salva neste navegador.')
  }
  if (isBlocked) return <><PageHeader eyebrow="PRIVACIDADE" title="Perfil indisponível" description="Você bloqueou este perfil; o conteúdo não fica visível enquanto o bloqueio estiver ativo."/><Panel><p className="muted">Conversas e entregas existentes foram preservadas. Desbloqueie o perfil para voltar a acessar as interações.</p><Button variant="outline" onClick={() => { toggleBlock(person.id); showFlash('Perfil desbloqueado.') }}>Desbloquear perfil</Button></Panel>{toast}</>
  if (!profileVisible) return <><PageHeader eyebrow="VISIBILIDADE CONTROLADA PELO PERFIL" title="Este perfil é privado" description="Somente a pessoa proprietária e suas conexões podem ver este portfólio."/><Panel><p className="muted">A VibeUp aplicou a preferência de visibilidade desta demonstração local.</p><Link className="button button-outline" to="/explorar">Voltar para Explorar</Link></Panel></>
  return <>
    <div className={`profile-cover ${coverIsImage ? 'has-image' : ''}`} style={coverIsImage ? { backgroundColor: '#f2eafb', backgroundImage: `linear-gradient(112deg, rgba(35, 2, 84, .035), transparent 48%), url("${person.cover}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: person.cover }}><span className="cover-orbit orbit-one"/><span className="cover-orbit orbit-two"/><span className="cover-index">VIBEUP / PORTFÓLIO</span>{own && <><Button variant="outline" className="profile-cover-edit" onClick={() => coverInputRef.current?.click()} disabled={coverProcessing}><Image size={15}/>{coverProcessing ? 'Preparando…' : coverIsImage ? 'Trocar capa' : 'Adicionar capa'}</Button><input ref={coverInputRef} className="profile-cover-file-input" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Selecionar imagem para a capa" onChange={(event) => { void prepareCover(event.currentTarget.files?.[0]) }}/></>}</div>
    <div className="profile-heading"><Avatar user={person} size="lg"/><div className="profile-heading-main"><span className="eyebrow">{person.role === 'company' ? 'EMPRESA PARCEIRA' : 'PORTFÓLIO PROFISSIONAL'}</span><h1>{person.name}</h1><p>{person.course} · {locationLabel}</p><p className="profile-bio">{person.bio}</p></div><div className="profile-actions">{own ? <Button variant="outline" onClick={() => setEditing(true)}>Editar perfil</Button> : <><Button variant={connected ? 'secondary' : 'primary'} onClick={() => { toggleConnection(person.id); showFlash(connected ? 'Conexão removida.' : 'Convite de conexão enviado.') }}>{connected ? <><Check size={15}/> Conectado</> : 'Conectar'}</Button><Link className="button button-outline" to={`/mensagens?contact=${person.id}`}><MessageCircle size={15}/> Conversar</Link><Button variant="quiet" onClick={() => toggleFavorite(person.id)}>{data.favorites.includes(person.id) ? <Check size={15}/> : <Heart size={15}/>} {data.favorites.includes(person.id) ? 'Salvo' : 'Favoritar'}</Button><Button variant="quiet" onClick={() => { toggleBlock(person.id); showFlash('Perfil bloqueado.'); }}>Bloquear perfil</Button></>}</div></div>
    <div className="profile-stats">
      <span><strong>{canSeeSkills ? projects.length : '—'}</strong>{canSeeSkills ? 'projetos publicados' : 'portfólio privado'}</span>
      <span><strong>{visiblePosts.length}</strong>publicações visíveis</span>
      <span><strong>{person.connections + data.connections.filter((item) => item === person.id).length}</strong>conexões</span>
      <span title="Soma local de projetos autorais, colaborações, entregas de desafio e posts distintos comentados; conta apenas evidências visíveis."><strong>{personContribution.total}</strong>pontos de contribuição</span>
      <span><Pill tone={person.availability === 'Não informado' ? '' : 'green'}>{person.availability === 'Não informado' ? 'Disponibilidade não informada' : `Disponível para ${person.availability.toLocaleLowerCase('pt-BR')}`}</Pill></span>
    </div>
    <TabBar items={['Projetos / Portfólio', 'Competências', 'Comunidades', 'Sobre', 'Atividade']} value={tab} onChange={setTab} idPrefix="profile"/>
    <div className="profile-body" id="profile-panel" role="tabpanel" aria-labelledby={`profile-tab-${tabSlug(tab)}`} tabIndex={0}>
      {tab === 'Projetos / Portfólio' && <>
        <div className="profile-section-heading"><div><h2>Projetos e experiências</h2><p>Competências demonstradas em entregas práticas.</p></div>{own && <Link to="/publicar" className="button button-secondary"><Plus size={15}/> Adicionar projeto</Link>}</div>
        {projects.length ? <div className="profile-portfolio-layout"><div className="profile-project-list">{projects.map((project) => {
          const collaborators = project.collaborators.map((id) => data.users.find((item) => item.id === id)).filter((item): item is User => !!item && canViewProfile(data, user.id, item.id))
          return <article className="profile-project-item" key={project.id}>
            <ProjectTile project={project} showAuthor/>
            {project.collaborators.length > 0 && <div className="profile-project-collaborators"><UsersRound size={14}/><span>{collaborators.length ? <>Com {collaborators.map((collaborator, index) => <span key={collaborator.id}>{index > 0 && ', '}{canViewProfile(data, user.id, collaborator.id) ? <Link to={`/perfil/${collaborator.id}`}>{collaborator.name}</Link> : null}</span>)}</> : 'Projeto colaborativo'}</span></div>}
          </article>
        })}</div><aside className="profile-project-aside">
          <section className="profile-project-aside-section"><h3>Competências em evidência</h3><div className="tag-row">{skills.slice(0, 8).map((skill) => <Link key={skill} to={`/explorar?skill=${encodeURIComponent(skill)}`} className="skill-tag">{skill}</Link>)}</div>{!skills.length && <p className="muted">Nenhuma competência informada.</p>}{skills.length > 8 && <p className="muted">+ {skills.length - 8} competências no mapa completo.</p>}<button className="profile-aside-link" onClick={() => setTab('Competências')}>Ver mapa completo <ArrowUpRight size={14}/></button></section>
          <section className="profile-project-aside-section"><h3>Contribuições</h3><div className="profile-contribution-stats"><span><strong>{personContribution.authoredProjects}</strong>projetos autorais visíveis</span><span><strong>{personContribution.collaborations}</strong>colaborações visíveis</span><span><strong>{personContribution.challengeDeliveries}</strong>entregas registradas</span><span><strong>{personContribution.commentedPosts}</strong>posts distintos comentados</span><span><strong>{personContribution.total}</strong>pontos calculados</span></div><small className="muted">Cálculo local sobre evidências visíveis; não verificado pela plataforma.</small></section>
        </aside></div> : <EmptyState title={canSeeSkills ? 'Ainda sem projetos públicos' : 'Portfólio não compartilhado'} text={canSeeSkills ? 'Este perfil poderá adicionar projetos ao portfólio.' : 'A pessoa proprietária restringiu a visualização dos projetos nesta demonstração local.'}/>}
      </>}
      {tab === 'Competências' && (canSeeSkills ? <div className="profile-skill-layout"><Panel title="Mapa de competências"><p className="muted">Selecione uma competência e veja os projetos em que ela aparece.</p><div className="skill-map">{skills.map((skill) => { const linked = projects.filter((project) => project.skills.includes(skill)); return <Link key={skill} to={`/explorar?skill=${encodeURIComponent(skill)}`} className="skill-node"><span>{skill}</span><small>{linked.length} {linked.length === 1 ? 'projeto' : 'projetos'}</small></Link> })}</div></Panel><Panel title="Ferramentas"><div className="tag-row">{Array.from(new Set([...person.tools, ...projects.flatMap((project) => project.tools)])).map((tool) => <Pill key={tool} tone="blue">{tool}</Pill>)}</div></Panel>{skills.map((skill) => { const linked = projects.filter((project) => project.skills.includes(skill)); return <Panel key={skill} title={skill}><div className="evidence-list">{linked.length ? linked.map((project) => <Link to={`/perfil/${person.id}`} key={project.id}><ProjectCover project={project} compact/><span><strong>{project.title}</strong><small>{project.tools.join(' · ')}</small></span><ArrowUpRight size={15}/></Link>) : <small>Competência declarada no perfil.</small>}</div></Panel> })}</div> : <EmptyState title="Competências não compartilhadas" text="As habilidades e evidências deste perfil estão disponíveis somente para a pessoa proprietária e suas conexões."/>)}
      {tab === 'Comunidades' && (personCommunities.length ? <div className="community-grid">{personCommunities.map((community) => <CommunityCard key={community.id} community={community}/>)}</div> : <EmptyState title={own ? 'Você ainda não participa de comunidades' : 'Nenhuma comunidade para mostrar'} text={own ? 'Explore grupos de interesse e encontre pessoas para trocar experiências.' : 'As comunidades deste perfil aparecerão aqui quando houver participações visíveis.'} action={own ? <Link to="/comunidades" className="button button-outline">Explorar comunidades</Link> : undefined}/>)}
      {tab === 'Sobre' && <div className="profile-info-grid"><Panel title="Apresentação"><p>{person.bio}</p><div className="profile-detail"><MapPin size={16}/> {canSeeCity ? `${person.city}, Santa Catarina` : 'Localização não compartilhada'}</div><div className="profile-detail"><BriefcaseBusiness size={16}/> {person.course}{canSeeCity ? ` · ${person.unit}` : ''}</div><div className="profile-detail"><Sparkles size={16}/> Interesses: {person.interests.join(', ') || 'a definir'}</div>{canSeeContact && <div className="profile-detail"><MessageCircle size={16}/><a href={`mailto:${person.email}`}>{person.email}</a></div>}</Panel><Panel title="Formação e experiências"><div className="timeline-item"><b>{person.course}</b><small>{canSeeCity ? `${person.unit} · ` : ''}Em andamento</small></div>{profileExperiences.map((item, index) => <div className="timeline-item" key={`experience-${index}`}><b>{item}</b><small>Experiência informada</small></div>)}{profileCourses.length > 0 && <section aria-label="Cursos complementares"><h3>Cursos complementares</h3>{profileCourses.map((item, index) => <div className="timeline-item" key={`course-${index}`}><b>{item}</b></div>)}</section>}{profileCertificates.length > 0 && <section aria-label="Certificados informados"><h3>Certificados</h3>{profileCertificates.map((item, index) => <div className="timeline-item" key={`certificate-${index}`}><b>{item}</b></div>)}<small className="muted">Informações declaradas pela pessoa; não verificadas pela plataforma.</small></section>}<div className="timeline-item"><b>Projetos acadêmicos</b><small>{canSeeSkills ? `${projects.length} entregas registradas no portfólio` : 'Portfólio não compartilhado'}</small></div><h3>Conquistas</h3>{personAchievements.length ? <div className="tag-row">{personAchievements.map((achievement) => <span key={achievement.id} title={achievement.description}><Pill tone={achievement.id === 'real-collaboration' ? 'green' : 'orange'}><Star size={12}/> {achievement.title}</Pill></span>)}</div> : <p className="muted">Nenhum marco de contribuição registrado nas evidências visíveis.</p>}<small className="muted">Marcos derivados de projetos e entregas registradas; não são credenciais verificadas.</small></Panel></div>}
      {tab === 'Atividade' && <div className="feed-column">{visiblePosts.map((post) => <PostCard key={post.id} post={post}/>)}</div>}
    </div>
    {editing && <Modal title="Editar meu perfil" onClose={() => setEditing(false)}><form className="stack-form" onSubmit={saveProfile}><label>Nome<input value={editName} onChange={(event) => setEditName(event.target.value)}/></label><label>Apresentação<textarea rows={3} value={editBio} onChange={(event) => setEditBio(event.target.value)}/></label><label>Competências<input value={editSkills} onChange={(event) => setEditSkills(event.target.value)}/></label><label>Ferramentas<input value={editTools} onChange={(event) => setEditTools(event.target.value)}/></label><label>Disponibilidade profissional<select value={editAvailability} onChange={(event) => setEditAvailability(event.target.value as User['availability'])}><option>Estágio</option><option>Emprego</option><option>Projetos</option><option>Não informado</option></select></label>{canEditCareerDetails && <><h3>Experiência e formação complementar</h3><p className="muted">Campos opcionais, uma entrada por linha. Os dados ficam salvos neste navegador. Certificados são informados pela pessoa e não são verificados pela plataforma.</p><label>Experiências<textarea rows={3} value={editExperiences} onChange={(event) => setEditExperiences(event.target.value)} placeholder="Ex.: estágio em suporte técnico"/></label><label>Cursos complementares<textarea rows={3} value={editCourses} onChange={(event) => setEditCourses(event.target.value)} placeholder="Ex.: Fundamentos de UX"/></label><label>Certificados informados<textarea rows={3} value={editCertificates} onChange={(event) => setEditCertificates(event.target.value)} placeholder="Ex.: nome do certificado ou curso concluído"/></label></>}<div className="form-actions"><Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button><Button type="submit">Salvar alterações</Button></div></form></Modal>}
    {coverPreviewOpen && <Modal title="Prévia da nova capa" onClose={closeCoverPreview}><div className="profile-cover-preview"><img src={coverDraft} alt="Prévia da imagem escolhida para a capa do perfil"/></div><p className="muted">A imagem será redimensionada e comprimida para ser salva somente neste navegador.</p><div className="form-actions"><Button variant="outline" onClick={closeCoverPreview}>Cancelar</Button><Button onClick={saveCover}>Salvar capa</Button></div></Modal>}
    {toast}
  </>
}

function PrivacyAwareTalentCard({ person }: { person: User }) {
  const { data, user, toggleFavorite, toggleConnection } = useVibeup()
  const connected = areConnected(data, user.id, person.id)
  const saved = data.favorites.includes(person.id)
  const canSeeSkills = canViewUserSkills(data, user.id, person.id)
  const canSeeCity = canViewCity(data, user.id, person.id)
  const projects = data.projects.filter((project) => project.ownerId === person.id && canViewProject(data, user.id, project))
  const contribution = getContributionSummary(data, person.id, user.id)
  const skills = canSeeSkills ? Array.from(new Set([...person.skills, ...projects.flatMap((project) => project.skills)])) : []
  const suggestedOpportunity = user.role === 'company' ? data.opportunities.find((item) => item.companyId === user.id && !['Concluída', 'Encerrada'].includes(item.stage)) : undefined
  const match = suggestedOpportunity ? getCompatibility(suggestedOpportunity.requirements, skills) : undefined
  return <article className="talent-card">
    <div className="talent-card-top"><Avatar user={person} size="lg"/><button className={`save-button ${saved ? 'is-saved' : ''}`} onClick={() => toggleFavorite(person.id)} aria-label={saved ? 'Remover dos favoritos' : 'Salvar talento'}>{saved ? <Check size={17}/> : <Heart size={17}/>}</button></div>
    <Link to={`/perfil/${person.id}`}><h3>{person.name}</h3></Link>
    <p className="talent-course">{person.course}</p>
    <span className="location-line"><MapPin size={14}/>{canSeeCity ? `${person.city} · ${person.unit}` : 'Localização não compartilhada'}</span>
    <p className="talent-bio">{person.bio}</p>
    <div className="tag-row">{canSeeSkills ? skills.slice(0, 3).map((skill) => <Pill key={skill}>{skill}</Pill>) : <small>Competências não compartilhadas</small>}</div>
    <div className="talent-stats"><span><BriefcaseBusiness size={14}/> {canSeeSkills ? `${projects.length} projetos` : 'Portfólio privado'}</span><span title={`Projetos autorais: ${contribution.authoredProjects} · colaborações: ${contribution.collaborations} · entregas: ${contribution.challengeDeliveries} · posts comentados: ${contribution.commentedPosts}`}><Star size={14}/> {contribution.total} pts</span></div>
    {match && canSeeSkills && <div className="talent-match"><strong>{match.score}%</strong><span><b>compatibilidade técnica</b><small>{match.matched.length} competências visíveis no perfil e nos projetos</small></span><Link to={`/perfil/${person.id}`} aria-label="Ver projetos relacionados"><ArrowUpRight size={14}/></Link></div>}
    <div className="talent-card-actions"><Button variant={connected ? 'secondary' : 'primary'} onClick={() => toggleConnection(person.id)}>{connected ? <><Check size={16}/> Conectado</> : 'Conectar'}</Button><Link to={`/mensagens?contact=${person.id}`} className="circle-action" aria-label={`Conversar com ${person.name}`}><MessageCircle size={17}/></Link></div>
  </article>
}

export function ExplorePage() {
  const { data, user, isCompany } = useVibeup()
  const [params, setParams] = useSearchParams()
  const [tab, setTab] = useState('Talentos')
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [skill, setSkill] = useState(params.get('skill') ?? '')
  const [course, setCourse] = useState(params.get('course') ?? '')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [tool, setTool] = useState('')
  const [unit, setUnit] = useState('')
  const [collaboration, setCollaboration] = useState(false)
  const [availability, setAvailability] = useState('')
  const [sort, setSort] = useState('Relevância')
  const [showFilters, setShowFilters] = useState(false)
  const normalized = (value: string) => value.trim().toLocaleLowerCase('pt-BR')
  const students = data.users.filter((person) => person.role === 'student' && !data.blocked.includes(person.id) && canViewProfile(data, user.id, person.id))
  const getProjectCourse = (project: (typeof data.projects)[number]) => project.course?.trim() || data.users.find((person) => person.id === project.ownerId)?.course || ''
  const visibleProjects = data.projects.filter((project) => canViewProject(data, user.id, project))
  const courseOptions = Array.from(new Set([
    ...students.map((person) => person.course),
    ...visibleProjects.map(getProjectCourse),
  ].map((item) => item.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  const talents = students.filter((person) => {
    const visibleProjects = data.projects.filter((project) => project.ownerId === person.id && canViewProject(data, user.id, project))
    const skillsVisible = canViewUserSkills(data, user.id, person.id)
    const locationVisible = canViewCity(data, user.id, person.id)
    const visibleSkills = skillsVisible ? [...person.skills, ...visibleProjects.flatMap((project) => project.skills)] : []
    const visibleTools = skillsVisible ? [...person.tools, ...visibleProjects.flatMap((project) => project.tools)] : []
    const corpus = [person.name, person.bio, person.course, person.area, ...(locationVisible ? [person.city, person.unit] : []), ...visibleSkills, ...visibleTools].join(' ').toLocaleLowerCase('pt-BR')
    return (!query || corpus.includes(normalized(query))) && (!skill || visibleSkills.some((item) => normalized(item).includes(normalized(skill)))) && (!course || normalized(person.course) === normalized(course)) && (!city || locationVisible && normalized(person.city).includes(normalized(city))) && (!area || normalized(person.area) === normalized(area)) && (!tool || visibleTools.some((item) => normalized(item).includes(normalized(tool)))) && (!unit || locationVisible && person.unit === unit) && (!collaboration || visibleProjects.some((project) => project.collaborators.length > 0)) && (!availability || person.availability === availability)
  }).sort((a, b) => sort === 'Mais projetos' ? data.projects.filter((project) => project.ownerId === b.id && canViewProject(data, user.id, project)).length - data.projects.filter((project) => project.ownerId === a.id && canViewProject(data, user.id, project)).length : sort === 'Mais recentes' ? b.id.localeCompare(a.id) : getContributionSummary(data, b.id, user.id).total - getContributionSummary(data, a.id, user.id).total)
  const normalizeAffinitySignal = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/[^a-z0-9]+/g, ' ').trim()
  const genericAffinitySignals = new Set(['aprendizado pratico', 'colaboracao', 'projeto', 'projetos', 'estagio'])
  const toAffinitySignals = (values: string[]) => {
    const unique = new Map<string, { normalized: string; label: string }>()
    values.forEach((label) => {
      const normalizedSignal = normalizeAffinitySignal(label)
      if (normalizedSignal && !genericAffinitySignals.has(normalizedSignal) && !unique.has(normalizedSignal)) unique.set(normalizedSignal, { normalized: normalizedSignal, label: label.trim() })
    })
    return Array.from(unique.values())
  }
  const activeInterestSignals = toAffinitySignals(user.interests ?? [])
  const ownVisibleProjects = data.projects.filter((project) => project.ownerId === user.id && canViewProject(data, user.id, project))
  const activeCompetencySignals = toAffinitySignals([...(user.skills ?? []), ...ownVisibleProjects.flatMap((project) => project.skills)])
  const filteredTalentIds = new Set(talents.map((person) => person.id))
  const talentRecommendations = data.users.filter((person) => filteredTalentIds.has(person.id)
    && person.role === 'student'
    && person.id !== user.id
    && !data.blocked.includes(person.id)
    && getUserPrivacy(data, person.id).profilePublic
    && canViewProfile(data, user.id, person.id)
    && !areConnected(data, user.id, person.id))
    .map((person) => {
      const skillsVisible = canViewUserSkills(data, user.id, person.id)
      const visibleProjects = skillsVisible ? data.projects.filter((project) => project.ownerId === person.id && canViewProject(data, user.id, project)) : []
      const candidateInterestSignals = toAffinitySignals(person.interests ?? [])
      const candidateCompetencySignals = toAffinitySignals(skillsVisible ? [...(person.skills ?? []), ...visibleProjects.flatMap((project) => project.skills)] : [])
      const sharedInterests = activeInterestSignals.filter((signal) => candidateInterestSignals.some((candidate) => candidate.normalized === signal.normalized))
      const sharedCompetencies = activeCompetencySignals.filter((signal) => candidateCompetencySignals.some((candidate) => candidate.normalized === signal.normalized))
      return { person, sharedInterests, sharedCompetencies, affinityScore: sharedInterests.length * 2 + sharedCompetencies.length * 3 }
    })
    .filter((item) => item.affinityScore > 0)
    .sort((left, right) => right.affinityScore - left.affinityScore || getContributionSummary(data, right.person.id, user.id).total - getContributionSummary(data, left.person.id, user.id).total)
    .slice(0, 4)
  const projects = data.projects.filter((project) => {
    if (!canViewProject(data, user.id, project)) return false
    const owner = data.users.find((person) => person.id === project.ownerId)
    const locationVisible = owner ? canViewCity(data, user.id, owner.id) : false
    const corpus = [project.title, project.description, project.category, ...(owner ? [owner.name, ...(locationVisible ? [owner.city, owner.unit] : [])] : []), ...project.skills, ...project.tools].join(' ').toLocaleLowerCase('pt-BR')
    return (!query || corpus.includes(normalized(query))) && (!skill || project.skills.some((item) => normalized(item).includes(normalized(skill)))) && (!course || normalized(getProjectCourse(project)) === normalized(course)) && (!city || locationVisible && owner?.city === city) && (!area || project.category === area) && (!tool || project.tools.some((item) => normalized(item).includes(normalized(tool)))) && (!unit || locationVisible && owner?.unit === unit) && (!collaboration || project.collaborators.length > 0)
  })
  const communities = data.communities.filter((item) => !query || `${item.name} ${item.category} ${item.description}`.toLocaleLowerCase('pt-BR').includes(normalized(query)))
  const opportunities = data.opportunities.filter((item) => !query || `${item.title} ${item.description} ${item.requirements.join(' ')}`.toLocaleLowerCase('pt-BR').includes(normalized(query)))
  const count = tab === 'Talentos' ? talents.length : tab === 'Projetos' ? projects.length : tab === 'Comunidades' ? communities.length : opportunities.length
  function syncSearchParams() { const next = new URLSearchParams(); if (query) next.set('q', query); if (skill) next.set('skill', skill); if (course && (tab === 'Talentos' || tab === 'Projetos')) next.set('course', course); setParams(next) }
  function updateSearch(event: FormEvent) { event.preventDefault(); syncSearchParams() }
  function applyFilters(event: FormEvent) { event.preventDefault(); syncSearchParams(); setShowFilters(false) }
  return <><PageHeader eyebrow={isCompany ? 'PORTAL DE DESCOBERTA' : 'ENCONTRE SEU PRÓXIMO PARCEIRO'} title={isCompany ? 'Competências com evidências reais.' : 'Explore pessoas, projetos e possibilidades.'} description={isCompany ? 'Pesquise talentos por habilidade demonstrada, ferramentas e disponibilidade.' : 'Encontre comunidades e pessoas que complementam o que você está construindo.'} action={isCompany && <Link className="button button-outline" to="/relatorios"><TrendingUp size={15}/> Ver painel de talentos</Link>}/>
    <form className="explore-search" onSubmit={updateSearch}><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tente React, Figma, Chapecó ou gastronomia" aria-label="Buscar pessoas, projetos, comunidades ou oportunidades"/><Button type="submit">Buscar</Button></form>
    <TabBar items={['Talentos', 'Projetos', 'Comunidades', 'Oportunidades']} value={tab} onChange={setTab} idPrefix="explore"/>
    <div className="explore-toolbar"><div><strong>{count}</strong> {tab.toLocaleLowerCase('pt-BR')} encontrados{(query || skill || course || city || area || tool || unit || collaboration || availability) && <button className="clear-filters" onClick={() => { setQuery(''); setSkill(''); setCourse(''); setCity(''); setArea(''); setTool(''); setUnit(''); setCollaboration(false); setAvailability(''); setParams({}) }}>Limpar filtros</button>}</div><div className="explore-sort"><button className="button button-outline filter-trigger" onClick={() => setShowFilters(!showFilters)}><Filter size={15}/> Filtros</button><label><ArrowDownWideNarrow size={14}/><select value={sort} onChange={(event) => setSort(event.target.value)}><option>Relevância</option><option>Mais projetos</option><option>Mais recentes</option></select></label></div></div>
    {showFilters && <form className="filter-panel" onSubmit={applyFilters}><label>Competência<input value={skill} onChange={(event) => setSkill(event.target.value)} placeholder="Ex.: React"/></label>{(tab === 'Talentos' || tab === 'Projetos') && <label>Curso<select value={course} onChange={(event) => setCourse(event.target.value)}><option value="">Todos os cursos</option>{courseOptions.map((item) => <option key={item}>{item}</option>)}</select></label>}<label>Cidade<input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Ex.: Chapecó" list="sc-cities"/><datalist id="sc-cities"><option>Chapecó</option><option>Joinville</option><option>Florianópolis</option><option>Blumenau</option></datalist></label><label>Área<select value={area} onChange={(event) => setArea(event.target.value)}><option value="">Todas as áreas</option>{['Tecnologia','Design','Gestão','Gastronomia','Saúde','Comunicação','Logística','Comércio','Beleza'].map((item) => <option key={item}>{item}</option>)}</select></label><label>Ferramenta<input value={tool} onChange={(event) => setTool(event.target.value)} placeholder="Excel, Figma..."/></label>{tab === 'Talentos' && <><label>Unidade Senac<select value={unit} onChange={(event) => setUnit(event.target.value)}><option value="">Todas as unidades</option>{Array.from(new Set(students.filter((person) => canViewCity(data, user.id, person.id)).map((person) => person.unit))).map((item) => <option key={item}>{item}</option>)}</select></label><label>Disponibilidade<select value={availability} onChange={(event) => setAvailability(event.target.value)}><option value="">Qualquer disponibilidade</option><option>Estágio</option><option>Emprego</option><option>Projetos</option></select></label></>}{(tab === 'Talentos' || tab === 'Projetos') && <label className="filter-check"><input type="checkbox" checked={collaboration} onChange={(event) => setCollaboration(event.target.checked)}/> Em projetos colaborativos</label>}<Button type="submit"><Check size={15}/> Aplicar filtros</Button></form>}
    <div id="explore-panel" className="tab-panel" role="tabpanel" aria-labelledby={`explore-tab-${tabSlug(tab)}`} tabIndex={0}>
    {tab === 'Talentos' && <><div className="discovery-note"><Sparkles size={16}/><span><strong>Mapa de Competências ativo</strong> — os resultados consideram apenas informações compartilhadas pelo perfil.</span></div><Panel className="feed-people-panel explore-affinity-panel" title="Pessoas com afinidade"><p className="muted">Afinidade estimada: 2 pontos por interesse em comum e 3 por competência compartilhada. Cidade e localização não entram no cálculo; a busca e os filtros continuam delimitando sugestões e resultados.</p>{talentRecommendations.length ? <div className="feed-people-list">{talentRecommendations.map(({ person, sharedInterests, sharedCompetencies }) => <article className="feed-person-suggestion" key={person.id}><Link to={`/perfil/${person.id}`} className="feed-person-link"><Avatar user={person} size="sm"/><span><strong>{person.name}</strong><small>{person.course}</small></span></Link>{sharedInterests.length > 0 && <p><strong>Interesses em comum:</strong> {sharedInterests.map((signal) => signal.label).join(', ')}</p>}{sharedCompetencies.length > 0 && <p><strong>Competências em comum:</strong> {sharedCompetencies.map((signal) => signal.label).join(', ')}</p>}<small className="talent-affinity-count">{sharedInterests.length} {sharedInterests.length === 1 ? 'interesse' : 'interesses'} · {sharedCompetencies.length} {sharedCompetencies.length === 1 ? 'competência' : 'competências'}</small></article>)}</div> : <p className="feed-people-empty">{activeInterestSignals.length || activeCompetencySignals.length ? 'Nenhum perfil público e desconectado com afinidade dentro dos filtros atuais.' : 'Adicione interesses ou competências ao seu perfil para receber sugestões por afinidade.'}</p>}</Panel>{talents.length ? <div className="talent-grid">{talents.map((person) => <PrivacyAwareTalentCard key={person.id} person={person}/>)}</div> : <EmptyState title={course ? `Nenhum talento em ${course}` : 'Nenhum talento com esses filtros'} text={course ? 'Tente outro curso ou limpe o filtro.' : 'Tente remover um filtro ou ampliar os termos da busca.'}/>}</>}
    {tab === 'Projetos' && (projects.length ? <div className="project-grid">{projects.map((project) => <ProjectTile project={project} key={project.id}/>)}</div> : <EmptyState title={course ? `Nenhum projeto em ${course}` : 'Nenhum projeto com esses filtros'} text={course ? 'Tente outro curso ou limpe o filtro.' : 'Tente remover um filtro ou ampliar os termos da busca.'}/>)}
    {tab === 'Comunidades' && <div className="community-grid">{communities.map((community) => <CommunityCard key={community.id} community={community}/>)}</div>}
    {tab === 'Oportunidades' && <div className="opportunity-list">{opportunities.map((item) => <OpportunityCard key={item.id} opportunity={item}/>)}</div>}
    </div>
  </>
}

function CommunityCard({ community }: { community: Community }) {
  const { user, toggleCommunity } = useVibeup()
  const joined = community.members.includes(user.id)
  return <article className="community-card"><div className="community-card-art" style={{ backgroundColor: community.color }}><span className="cover-orbit orbit-one"/><BrandIcon name={community.category === "Tecnologia" ? "code" : community.category === "Carreira" || community.category === "Gestão" ? "learning" : community.category === "Design" || community.category === "Comunicação" || community.category === "Gastronomia" ? "creative" : "community"} className="community-symbol"/><Pill>{community.category}</Pill></div><div className="community-card-body"><h3>{community.name}</h3><p>{community.description}</p><div className="community-meta"><span><UsersRound size={14}/>{community.members.length} participantes</span><span><MessageCircle size={14}/>Ativa hoje</span></div><div className="community-latest"><span className="eyebrow">CONVERSA RECENTE</span><p>{community.post}</p></div><Button variant={joined ? 'secondary' : 'primary'} onClick={() => toggleCommunity(community.id)}>{joined ? <><Check size={15}/> Participando</> : 'Participar da comunidade'}</Button></div></article>
}

export function CommunitiesPage() {
  const { data, user, createCommunity } = useVibeup()
  const [createOpen, setCreateOpen] = useState(false)
  const [category, setCategory] = useState('Todas')
  const { showFlash, toast } = useFlash()
  const list = category === 'Todas' ? data.communities : data.communities.filter((item) => item.category === category)
  const normalizeSignal = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/[^a-z0-9]+/g, ' ').trim()
  const genericSignals = new Set(['aprendizado pratico', 'colaboracao', 'projeto', 'projetos', 'estagio'])
  const uniqueSignals = (values: string[]) => Array.from(new Map(values.map((value) => [normalizeSignal(value), value.trim()])).entries())
    .filter(([normalized]) => normalized && !genericSignals.has(normalized))
    .map(([normalized, label]) => ({ normalized, label }))
  const interests = uniqueSignals(user.interests)
  const competencies = uniqueSignals([
    ...user.skills,
    ...data.projects.filter((project) => project.ownerId === user.id).flatMap((project) => project.skills),
  ])
  const rankedCommunities = data.communities.map((community) => {
    const text = normalizeSignal(`${community.name} ${community.category} ${community.description} ${community.post}`)
    const matchedInterests = interests.filter((signal) => ` ${text} `.includes(` ${signal.normalized} `))
    const matchedCompetencies = competencies.filter((signal) => ` ${text} `.includes(` ${signal.normalized} `))
    const score = matchedInterests.length * 3 + matchedCompetencies.length * 2
    const reasons = [
      ...matchedInterests.slice(0, 1).map((signal) => `interesse em ${signal.label}`),
      ...matchedCompetencies.slice(0, 1).map((signal) => `competência ${signal.label}`),
    ]
    return { community, score, reason: reasons.length ? `Afinidade: ${reasons.join(' · ')}` : '' }
  }).sort((a, b) => b.score - a.score || b.community.members.length - a.community.members.length)
  const hasAffinity = rankedCommunities.some((item) => item.score > 0)
  const recommendations = hasAffinity
    ? rankedCommunities.filter((item) => item.score > 0).slice(0, 3)
    : data.communities.slice().sort((a, b) => b.members.length - a.members.length).slice(0, 3)
      .map((community) => ({ community, score: 0, reason: `Opção popular · ${community.members.length} participantes` }))
  return <><PageHeader eyebrow="APRENDER JUNTO MUDA TUDO" title="Comunidades" description="Encontre pessoas que compartilham interesses, cursos e desafios." action={<Button onClick={() => setCreateOpen(true)}><Plus size={15}/> Criar comunidade</Button>}/>
    <div className="community-hero"><div><span className="eyebrow">SUGESTÕES PARA VOCÊ</span><h2>Boas conversas começam com interesses em comum.</h2><p>{hasAffinity ? 'Sugestões calculadas pelos interesses e competências do seu perfil ativo; a localização não participa.' : 'Não encontramos afinidades diretas. Estas comunidades populares são opções para explorar; a localização não participa.'}</p><div className="recommend-chip-row">{recommendations.map((item) => <button key={item.community.id} title={item.reason} aria-label={`${item.community.name}. ${item.reason}`} onClick={() => setCategory(item.community.category)}>{item.community.name} · {item.reason} <ArrowUpRight size={13}/></button>)}</div></div><div className="community-orb"><BrandIcon name="community"/></div></div>
    <div className="community-filters"><span>{data.communities.length} comunidades</span><div>{['Todas', ...Array.from(new Set(data.communities.map((item) => item.category)))].map((item) => <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
    <div className="community-grid">{list.map((community) => <CommunityCard key={community.id} community={community}/>)}</div>
    {createOpen && <Modal title="Criar comunidade" onClose={() => setCreateOpen(false)}><form className="stack-form" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); createCommunity({ name: String(form.get('name')), category: String(form.get('category')), description: String(form.get('description')), color: '#e9efff' }); setCreateOpen(false); showFlash('Comunidade criada e adicionada à lista.') }}><label>Nome da comunidade<input name="name" required placeholder="Ex.: Mulheres em Tecnologia SC"/></label><label>Categoria<select name="category"><option>{user.area}</option><option>Tecnologia</option><option>Design</option><option>Gastronomia</option><option>Carreira</option><option>Comunidade</option></select></label><label>Descrição<textarea name="description" rows={3} required placeholder="O que as pessoas vão encontrar aqui?"/></label><div className="form-actions"><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button><Button type="submit">Criar comunidade</Button></div></form></Modal>}{toast}</>
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const { data, user, toggleFavorite, applyOpportunity } = useVibeup()
  const company = data.users.find((item) => item.id === opportunity.companyId)
  const topMatch = data.users.filter((person) => person.role === 'student' && canViewProfile(data, user.id, person.id) && canViewUserSkills(data, user.id, person.id)).map((person) => {
    const projects = data.projects.filter((project) => project.ownerId === person.id && canViewProject(data, user.id, project))
    const skills = canViewUserSkills(data, user.id, person.id) ? [...person.skills, ...projects.flatMap((project) => project.skills)] : []
    const compatibility = getCompatibility(opportunity.requirements, skills)
    return { person, projects, compatibility }
  }).sort((a,b) => b.compatibility.score - a.compatibility.score)[0]
  const targetPerson = user.role === 'student' ? user : topMatch?.person
  const normalizeSkill = (skill: string) => skill.trim().toLocaleLowerCase('pt-BR')
  const requirementSet = new Set(opportunity.requirements.map(normalizeSkill))
  const visibleTargetProjects = targetPerson ? data.projects.filter((project) => project.ownerId === targetPerson.id && canViewProject(data, user.id, project)) : []
  const relatedProjects = visibleTargetProjects.filter((project) => project.skills.some((skill) => requirementSet.has(normalizeSkill(skill))))
  const demonstratedSkills = visibleTargetProjects.flatMap((project) => project.skills)
  const profileSkillsVisible = targetPerson ? canViewUserSkills(data, user.id, targetPerson.id) : false
  const results = user.role === 'company' && topMatch
    ? topMatch.compatibility
    : getCompatibility(opportunity.requirements, [...(profileSkillsVisible ? targetPerson?.skills ?? [] : []), ...demonstratedSkills])
  const requirementCount = opportunity.requirements.length
  const canCompareSkills = user.role === 'student' || !!targetPerson
  const saved = data.favorites.includes(opportunity.id)
  const applied = data.applications.includes(`${user.id}:${opportunity.id}`)
  return <article className="opportunity-card"><div className="company-mark">{company?.name.split(' ').map((part) => part[0]).slice(0,2).join('') ?? 'OP'}</div><div className="opportunity-main"><div className="opportunity-heading"><div><span className="eyebrow">{company?.name}</span><h3>{opportunity.title}</h3></div><button className={`save-button ${saved ? 'is-saved' : ''}`} onClick={() => toggleFavorite(opportunity.id)} aria-label="Salvar oportunidade">{saved ? <Check size={16}/> : <Heart size={16}/>}</button></div><p>{opportunity.description}</p><div className="opportunity-meta"><Pill tone="blue">{opportunity.type}</Pill><span><MapPin size={13}/>{opportunity.city}</span><span>{opportunity.mode}</span>{opportunity.salary && <span>{opportunity.salary}</span>}</div><div className="opportunity-skill-groups" aria-label="Correspondência entre competências e requisitos">{!requirementCount ? <p className="opportunity-match-unavailable">Esta oportunidade não informa requisitos de competência para comparação.</p> : !canCompareSkills ? <p className="opportunity-match-unavailable">Não há perfil com competências visíveis para comparar no momento.</p> : <><section className="opportunity-skill-group opportunity-skill-group-matched"><strong>Correspondências visíveis</strong><div className="opportunity-skills">{results.matched.length ? results.matched.map((skill) => <Pill key={`matched-${skill}`} tone="green"><Check size={11}/> {skill}</Pill>) : <small>Nenhuma identificada nas informações visíveis.</small>}</div></section><section className="opportunity-skill-group opportunity-skill-group-unidentified"><strong>Ainda não identificadas</strong><div className="opportunity-skills">{results.missing.length ? results.missing.map((skill) => <Pill key={`unidentified-${skill}`}>{skill}</Pill>) : <small>Todos os requisitos aparecem nos dados visíveis.</small>}</div></section></>}</div><div className="opportunity-related">{user.role === 'student' && relatedProjects.length > 0 && <span><Sparkles size={12}/> Projetos relacionados: {relatedProjects.slice(0,2).map((project) => project.title).join(' · ')}</span>}{user.role === 'company' ? (topMatch && <Link to={`/perfil/${topMatch.person.id}`}>Top sugestão: {topMatch.person.name} · {topMatch.compatibility.score}% <ArrowUpRight size={13}/></Link>) : <button className={`interest-button ${applied ? 'applied' : ''}`} onClick={() => applyOpportunity(opportunity.id)} disabled={applied}>{applied ? <><Check size={13}/> Interesse enviado</> : 'Tenho interesse'}</button>}</div></div><div className="compatibility"><div className="compatibility-ring" role="img" aria-label={canCompareSkills && requirementCount ? `${results.score}% de compatibilidade por competências visíveis` : 'Compatibilidade indisponível'} style={{ '--score': `${results.score}%` } as React.CSSProperties}><span>{canCompareSkills && requirementCount ? `${results.score}%` : '—'}</span></div><small>compatibilidade<br/>de competências</small><span className="compatibility-detail">{canCompareSkills ? requirementCount ? `${results.matched.length} de ${requirementCount} requisitos` : 'Sem requisitos informados' : 'Sem dados visíveis para comparar'}</span>{canCompareSkills && requirementCount > 0 && <><small className="opportunity-compatibility-formula">{results.matched.length} ÷ {requirementCount} × 100 = {results.score}%</small><details className="opportunity-compatibility-explainer"><summary>Como calculamos</summary><p>Percentual = requisitos identificados ÷ requisitos totais × 100, arredondado ao inteiro mais próximo.</p><p>Contamos apenas competências visíveis no perfil e em projetos visíveis para quem consulta. Cidade e localização não entram na pontuação. Requisitos não identificados podem estar ocultos ou não registrados.</p></details></>}{!canCompareSkills && <small className="opportunity-compatibility-explainer-note">A pontuação aparece quando há competências visíveis para comparar.</small>}{canCompareSkills && !requirementCount && <small className="opportunity-compatibility-explainer-note">Sem requisitos de competência, não há cálculo percentual.</small>}</div></article>
}

export function ChallengesPage() {
  const { data, user, toggleChallenge, submitChallenge, createChallenge } = useVibeup()
  const [tab, setTab] = useState('Todos os desafios')
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const { showFlash, toast } = useFlash()
  const challengeSubmissions = data.challengeSubmissions ?? []
  const challenges = tab === 'Meus desafios' ? data.challenges.filter((item) =>
    item.companyId === user.id || item.participants.includes(user.id) || challengeSubmissions.some((submission) =>
      submission.challengeId === item.id && (submission.userId === user.id || submission.teamMemberIds?.includes(user.id)),
    ),
  ) : data.challenges
  const contributionLeaderboard = data.users
    .filter((person) => person.role === 'student' && !data.blocked.includes(person.id) && canViewProfile(data, user.id, person.id))
    .map((person) => ({ person, contribution: getContributionSummary(data, person.id, user.id) }))
    .sort((left, right) => right.contribution.total - left.contribution.total || left.person.name.localeCompare(right.person.name, 'pt-BR'))
    .slice(0, 5)

  function availableTeamMembers(challenge: Challenge) {
    const submittedMemberIds = new Set(challengeSubmissions.filter((item) => item.challengeId === challenge.id).flatMap((item) => [item.userId, ...(item.teamMemberIds ?? [])]))
    return challenge.participants
      .map((memberId) => data.users.find((person) => person.id === memberId))
      .filter((person): person is User => person !== undefined && person.role === 'student' && person.id !== user.id && !submittedMemberIds.has(person.id))
  }

  function sendResult(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!activeChallenge) return
    const form = new FormData(event.currentTarget)
    const title = String(form.get('title') ?? '').trim()
    const context = String(form.get('context') ?? '').trim()
    const link = String(form.get('link') ?? '').trim()
    const teamMemberIds = form.getAll('teamMemberIds').map(String)
    if (!title || !context) return showFlash('Informe o título e o contexto da entrega.')
    submitChallenge(activeChallenge.id, { title, context, ...(link ? { link } : {}), ...(teamMemberIds.length ? { teamMemberIds } : {}) })
    setActiveChallenge(null)
    showFlash('Entrega enviada. A avaliação está pendente.')
  }

  function saveChallenge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const points = Number(form.get('points'))
    createChallenge({
      title: String(form.get('title') ?? ''),
      category: String(form.get('category') ?? ''),
      description: String(form.get('description') ?? ''),
      deadline: String(form.get('deadline') ?? ''),
      points: Number.isFinite(points) ? points : 0,
      mode: String(form.get('mode') ?? 'Individual') as Challenge['mode'],
    })
    setCreateOpen(false)
    showFlash('Desafio criado e disponível na lista.')
  }

  const activeTeamMembers = activeChallenge ? availableTeamMembers(activeChallenge) : []

  return <>
    <PageHeader eyebrow="APRENDER FAZENDO" title="Desafios" description="Responda a desafios acadêmicos e empresariais. Cada entrega pode virar projeto no seu portfólio." action={user.role === 'company' ? <Button onClick={() => setCreateOpen(true)}><Plus size={15}/> Criar desafio</Button> : undefined} />
    {data.challenges[0] && <div className="challenge-highlight">
      <div>
        <span className="eyebrow">DESAFIO EM DESTAQUE</span>
        <h2>{data.challenges[0].title}</h2>
        <p>{data.challenges[0].description}</p>
        <div className="challenge-meta">
          <Pill tone="orange">{data.challenges[0].mode}</Pill>
          <span><Clock3 size={14} /> Entrega até {dateLabel(data.challenges[0].deadline)}</span>
          <span><Star size={14} /> {data.challenges[0].points} pontos</span>
        </div>
        {user.role === 'company' && data.challenges[0].companyId === user.id
          ? <p className="muted">Você organiza este desafio.</p>
          : (() => {
            const joined = data.challenges[0].participants.includes(user.id)
            return <Button variant={joined ? 'secondary' : 'primary'} onClick={() => { toggleChallenge(data.challenges[0].id); showFlash(joined ? 'Inscrição cancelada.' : 'Inscrição confirmada.') }}>{joined ? 'Cancelar inscrição' : 'Participar do desafio'} <ArrowRight size={15} /></Button>
          })()}
      </div>
      <div className="challenge-number">01<span>/{String(data.challenges.length).padStart(2, '0')}</span></div>
    </div>}
    <TabBar items={['Todos os desafios', 'Meus desafios']} value={tab} onChange={setTab} idPrefix="challenge" />
    <div id="challenge-panel" className="challenge-grid" role="tabpanel" aria-labelledby={`challenge-tab-${tabSlug(tab)}`} tabIndex={0}>
      {challenges.map((challenge, index) => {
        const organizer = data.users.find((person) => person.id === challenge.companyId)
        const joined = challenge.participants.includes(user.id)
        const challengeEntries = challengeSubmissions.filter((item) => item.challengeId === challenge.id).sort((a, b) => a.submittedAt.localeCompare(b.submittedAt))
        const submittedParticipantIds = new Set(challengeEntries.flatMap((item) => [item.userId, ...(item.teamMemberIds ?? [])]))
        const waitingParticipants = challenge.participants.filter((memberId) => !submittedParticipantIds.has(memberId))
        const ownChallenge = user.role === 'company' && challenge.companyId === user.id
        const submission = challengeEntries.find((item) => item.userId === user.id || item.teamMemberIds?.includes(user.id))
        const visiblePersonName = (personId: string) => data.blocked.includes(personId) ? 'Pessoa bloqueada' : getPersonName(data.users, personId)
        const teamNames = submission?.teamMemberIds?.map(visiblePersonName) ?? []
        const submitterName = submission ? visiblePersonName(submission.userId) : ''
        return <article key={challenge.id} className={`challenge-card challenge-tone-${index % 4}`}>
          <div className="challenge-card-top"><Pill tone="blue">{challenge.category}</Pill><span>{challenge.mode}</span></div>
          <h3>{challenge.title}</h3>
          <p>{challenge.description}</p>
          <div className="challenge-owner"><Avatar user={organizer} size="sm" /><span><strong>{organizer?.name}</strong><small>Desafio empresarial</small></span></div>
          <div className="challenge-meta">
            <span><Clock3 size={14} /> {dateLabel(challenge.deadline)}</span>
            <span><UsersRound size={14} /> {challenge.participants.length} participando</span>
            <span><Star size={14} /> {challenge.points} pts</span>
          </div>
          <div className="challenge-actions">
            {ownChallenge ? <span className="muted">Você organiza este desafio.</span> : submission ? <Button variant="secondary" disabled><Check size={14} /> Entrega enviada</Button> : <>{joined ? <Button variant="secondary" onClick={() => { toggleChallenge(challenge.id); showFlash('Inscrição cancelada.') }}><Check size={14} /> Inscrito</Button> : <Button onClick={() => { toggleChallenge(challenge.id); showFlash('Inscrição confirmada.') }}>Participar</Button>}{joined && <Button variant="outline" onClick={() => setActiveChallenge(challenge)}>Enviar resultado</Button>}</>}
          </div>
          <details className="panel challenge-ranking">
            <summary>Ranking do desafio · {challengeEntries.length} entrega(s)</summary>
            {challengeEntries.length ? <div className="leaderboard-list">
              {challengeEntries.map((entry, rankIndex) => {
                const names = [visiblePersonName(entry.userId), ...(entry.teamMemberIds ?? []).map(visiblePersonName)]
                const memberLabel = names.length > 2 ? `${names[0]} + ${names.length - 1}` : names.join(' + ')
                return <div className="leaderboard-row" key={entry.id}>
                  <b className={`rank rank-${rankIndex + 1}`}>{String(rankIndex + 1).padStart(2, '0')}</b>
                  <span title={names.join(', ')}>{memberLabel}<small>{entry.title} · {entry.evaluation ? 'Avaliação concluída' : 'Avaliação pendente'}</small></span>
                </div>
              })}
            </div> : <p className="muted">Ainda não há entregas registradas.</p>}
            <p className="muted">{waitingParticipants.length} participante(s) inscrito(s) aguardando entrega.</p>
            <small className="muted">Ordem por entrega registrada; não representa avaliação de mérito. Entregas sem revisão permanecem pendentes.</small>
          </details>
          {submission && <Panel title="Sua entrega" className="challenge-submission-panel">
            <Pill tone="green">Entrega enviada</Pill>
            <h3>{submission.title}</h3>
            {(teamNames.length > 0 || submitterName !== user.name) && <p className="muted"><strong>Equipe:</strong> {[submitterName, ...teamNames].filter(Boolean).join(', ')}</p>}
            <p>{submission.context}</p>
            {submission.link && <p><a href={submission.link} target="_blank" rel="noreferrer">Abrir link da entrega <ArrowUpRight size={14}/></a></p>}
            {submission.evaluation ? <div><strong>Avaliação concluída</strong>{submission.evaluation.score !== undefined && <p>Nota: {submission.evaluation.score}</p>}{submission.evaluation.feedback && <p>{submission.evaluation.feedback}</p>}</div> : <p className="muted">Avaliação pendente. Nenhum feedback foi registrado.</p>}
            <small>Enviada em {new Date(submission.submittedAt).toLocaleDateString('pt-BR')}</small>
          </Panel>}
        </article>
      })}
    </div>
    <Panel className="leaderboard-panel" title="Contribuições da comunidade" action={<span className="muted">Cálculo local, sem trilha antifraude</span>}>
      <p className="muted">Fórmula: projeto autoral 20 pts · colaboração registrada 10 pts · entrega de desafio 15 pts · comentário em post distinto 2 pts. Só entram projetos e posts visíveis para quem consulta; não é uma avaliação de mérito.</p>
      <div className="leaderboard-list">
        {contributionLeaderboard.map(({ person, contribution }, index) => <div className="leaderboard-row" key={person.id}>
          <b className={`rank rank-${index + 1}`}>{String(index + 1).padStart(2, '0')}</b>
          <Avatar user={person} size="sm" />
          <span>{person.name}<small>{person.course} · baseado em evidências visíveis</small></span>
          <strong title={`Projetos: ${contribution.authoredProjects} · colaborações: ${contribution.collaborations} · entregas: ${contribution.challengeDeliveries} · posts comentados: ${contribution.commentedPosts}`}>{contribution.total} pts</strong>
        </div>)}
      </div>
    </Panel>
    {activeChallenge && <Modal title="Enviar resultado do desafio" onClose={() => setActiveChallenge(null)}><p className="modal-copy"><strong>{activeChallenge.title}</strong></p><p className="modal-copy">{activeChallenge.description}</p><form className="stack-form" onSubmit={sendResult}><label>Título da entrega<input name="title" required maxLength={100} placeholder="Dê um nome ao que você realizou"/></label><label>Contexto e resultado<textarea name="context" rows={5} required maxLength={2000} placeholder="Descreva o que você fez, suas decisões e o resultado alcançado."/></label>{activeChallenge.mode === 'Coletivo' && <div className="team-member-picker"><strong id="team-member-picker-label">Equipe (opcional)</strong><p className="muted">Inclua estudantes já inscritos neste desafio. Você será incluído automaticamente.</p>{activeTeamMembers.length ? <div role="group" aria-labelledby="team-member-picker-label">{activeTeamMembers.map((person) => <label key={person.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}><input type="checkbox" name="teamMemberIds" value={person.id} style={{ width: 16, minHeight: 16, padding: 0, flex: 'none' }}/><span>{person.name}</span></label>)}</div> : <p className="muted">Não há outros participantes inscritos disponíveis para esta equipe.</p>}</div>}<label>Link da entrega (opcional)<input name="link" type="url" placeholder="https://"/><small>Você pode incluir um link para o projeto, protótipo ou apresentação.</small></label><div className="form-actions"><Button variant="outline" onClick={() => setActiveChallenge(null)}>Cancelar</Button><Button type="submit"><Check size={15}/> Enviar entrega</Button></div></form></Modal>}
    {createOpen && <Modal title="Criar desafio" onClose={() => setCreateOpen(false)}><p className="modal-copy">Publique um desafio para estudantes e acompanhe as entregas registradas.</p><form className="stack-form" onSubmit={saveChallenge}><label>Título do desafio<input name="title" required maxLength={100} placeholder="Ex.: Solução digital para comércio local"/></label><label>Categoria<select name="category"><option>Tecnologia</option><option>Design</option><option>Gestão</option><option>Gastronomia</option><option>Comunicação</option><option>Saúde</option><option>Logística</option></select></label><label>Descrição<textarea name="description" rows={4} required maxLength={2000} placeholder="Explique o problema e o que espera como entrega."/></label><div className="form-grid"><label>Prazo<input name="deadline" type="date" required defaultValue="2026-12-05"/></label><label>Pontos<input name="points" type="number" min="0" max="1000" required defaultValue="100"/></label></div><label>Formato<select name="mode"><option>Individual</option><option>Coletivo</option></select></label><div className="form-actions"><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button><Button type="submit"><Plus size={15}/> Publicar desafio</Button></div></form></Modal>}
    {toast}
  </>
}
export function EventsPage() {
  const { data, user, toggleEvent, createEvent } = useVibeup()
  const [view, setView] = useState('Agenda')
  const [month, setMonth] = useState(10)
  const [category, setCategory] = useState('Todas as categorias')
  const [createOpen, setCreateOpen] = useState(false)
  const [promoImage, setPromoImage] = useState('')
  const [imageProcessing, setImageProcessing] = useState(false)
  const { showFlash, toast } = useFlash()
  async function preparePromoImage(file?: File) {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      showFlash('Escolha uma imagem JPG, PNG ou WebP.')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      showFlash('A imagem deve ter até 8 MB antes da compressão.')
      return
    }
    setImageProcessing(true)
    let bitmap: ImageBitmap | undefined
    try {
      bitmap = await createImageBitmap(file)
      if (!bitmap.width || !bitmap.height || bitmap.width * bitmap.height > 40_000_000) throw new Error('Dimensões inválidas')
      let width = Math.max(1, Math.round(bitmap.width * Math.min(1, 1440 / bitmap.width, 900 / bitmap.height)))
      let height = Math.max(1, Math.round(bitmap.height * Math.min(1, 1440 / bitmap.width, 900 / bitmap.height)))
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas indisponível')
      for (let pass = 0; pass < 8; pass += 1) {
        canvas.width = width
        canvas.height = height
        context.fillStyle = '#fff'
        context.fillRect(0, 0, width, height)
        context.drawImage(bitmap, 0, 0, width, height)
        for (const quality of [0.82, 0.74, 0.66, 0.58, 0.5]) {
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
          if (!blob || blob.size > 180_000) continue
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Falha ao ler a imagem'))
            reader.onerror = () => reject(reader.error ?? new Error('Falha ao ler a imagem'))
            reader.readAsDataURL(blob)
          })
          setPromoImage(dataUrl)
          return
        }
        width = Math.max(1, Math.round(width * 0.8))
        height = Math.max(1, Math.round(height * 0.8))
      }
      throw new Error('Imagem acima do limite local')
    } catch {
      showFlash('Não foi possível reduzir esta imagem ao limite local. Tente um arquivo menor.')
    } finally {
      bitmap?.close()
      setImageProcessing(false)
    }
  }
  const events = data.events.slice().sort((a,b) => a.date.localeCompare(b.date))
  const visibleEvents = category === 'Todas as categorias' ? events : events.filter((item) => item.category === category)
  const daysInMonth = new Date(2026, month + 1, 0).getDate()
  const firstDay = new Date(2026, month, 1).getDay()
  const eventForDay = (day: number) => visibleEvents.filter((item) => Number(item.date.slice(8,10)) === day && Number(item.date.slice(5,7)) === month + 1)
  const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  return <><PageHeader eyebrow="ENCONTROS QUE MOVEM IDEIAS" title="Eventos e encontros" description="Feiras, workshops e conversas para fazer novas conexões." action={<Button onClick={() => setCreateOpen(true)}><Plus size={15}/> Criar evento</Button>}/><div className="event-header-row"><div className="event-view-toggle"><button className={view === 'Agenda' ? 'active' : ''} onClick={() => setView('Agenda')}>Agenda</button><button className={view === 'Calendário' ? 'active' : ''} onClick={() => setView('Calendário')}>Calendário</button></div><select className="select-compact" value={category} onChange={(event) => setCategory(event.target.value)}><option>Todas as categorias</option>{Array.from(new Set(events.map((item) => item.category))).map((item) => <option key={item}>{item}</option>)}</select></div>
    {view === 'Agenda' ? <div className="events-layout"><div className="event-list">{visibleEvents.map((item) => { const organizer = data.users.find((person) => person.id === item.organizerId); const joined = item.attendees.includes(user.id); return <article className="event-card" key={item.id}><div className="event-date-block" style={{ backgroundColor: item.color }}><span>{months[Number(item.date.slice(5,7))-1].slice(0,3)}</span><strong>{item.date.slice(8,10)}</strong></div><div className="event-card-main"><div className="event-card-top"><Pill tone="orange">{item.category}</Pill><span>{item.time}</span></div>{item.promoImage && <img className="event-promo-image" src={item.promoImage} alt={`Imagem de divulgação de ${item.title}`} loading="lazy"/>}<h3>{item.title}</h3><p>{item.description}</p><div className="event-card-details"><span><MapPin size={14}/>{item.location}</span><span><UsersRound size={14}/>{item.attendees.length} participantes</span><span>por {organizer?.name}</span></div></div><Button variant={joined ? 'secondary' : 'outline'} onClick={() => { toggleEvent(item.id); showFlash(joined ? 'Participação cancelada.' : 'Você confirmou presença.') }}>{joined ? 'Vou participar ✓' : 'Participar'}</Button></article>})}</div><aside className="events-aside"><Panel title="Esta semana"><p className="muted">Encontros próximos para colocar no calendário.</p>{visibleEvents.slice(0,3).map((item) => <div className="mini-event-row" key={item.id}><span style={{backgroundColor:item.color}}>{item.date.slice(8,10)}</span><div><strong>{item.title}</strong><small>{item.time} · {item.category}</small></div></div>)}</Panel><Panel title="Sugestões para você"><div className="suggested-event"><Sparkles size={16}/><p>Workshops de portfólio e feiras profissionais são populares entre estudantes de {user.area}.</p></div><Button variant="outline" onClick={() => setView('Calendário')}>Ver calendário</Button></Panel></aside></div> : <section className="calendar-panel"><div className="calendar-heading"><button className="circle-action" onClick={() => setMonth((month + 11) % 12)} aria-label="Mês anterior"><ArrowLeft size={16}/></button><h2>{months[month]} 2026</h2><button className="circle-action" onClick={() => setMonth((month + 1) % 12)} aria-label="Próximo mês"><ArrowRight size={16}/></button></div><div className="calendar-grid calendar-weekdays">{['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{Array.from({length:firstDay}, (_,i) => <span key={`blank-${i}`} className="calendar-day blank"/>)}{Array.from({length:daysInMonth}, (_,i) => { const day = i + 1; const dayEvents = eventForDay(day); return <button key={day} className={`calendar-day ${dayEvents.length ? 'has-event' : ''}`} onClick={() => dayEvents[0] && showFlash(`${dayEvents[0].title} · ${dayEvents[0].time}`)}><span>{day}</span>{dayEvents.map((item) => <i key={item.id} title={item.title} style={{backgroundColor:item.color}}>{item.title}</i>)}</button>})}</div></section>}
    {createOpen && <Modal title="Criar evento ou compromisso" onClose={() => { setCreateOpen(false); setPromoImage('') }}><form className="stack-form" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); createEvent({ title: String(form.get('title')), category: String(form.get('category')), description: String(form.get('description')), date: String(form.get('date')), time: String(form.get('time')), location: String(form.get('location')), color: '#eaf0ff', ...(promoImage ? { promoImage } : {}) }); setCreateOpen(false); setPromoImage(''); showFlash('Evento adicionado à agenda.') }}><label>Nome do evento<input name="title" required placeholder="Ex.: Encontro de portfólios"/></label><div className="form-grid"><label>Categoria<select name="category"><option>Workshop</option><option>Feira profissional</option><option>Palestra</option><option>Hackathon</option><option>Encontro</option></select></label><label>Localização<input name="location" required placeholder="Senac Chapecó · Auditório"/></label></div><div className="form-grid"><label>Data<input name="date" type="date" required defaultValue="2026-11-28"/></label><label>Horário<input name="time" type="time" required defaultValue="18:00"/></label></div><label>Descrição<textarea name="description" rows={3} required/></label><label>Imagem de divulgação (opcional)<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Imagem de divulgação do evento" disabled={imageProcessing} onChange={(event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ''; void preparePromoImage(file) }}/><small>JPG, PNG ou WebP, até 8 MB. A imagem será comprimida e salva neste navegador.</small></label>{imageProcessing && <p role="status">Comprimindo imagem…</p>}{promoImage && <div className="event-promo-preview" role="group" aria-label="Prévia da imagem promocional"><img src={promoImage} alt="Prévia da imagem de divulgação do evento"/><Button variant="quiet" onClick={() => setPromoImage('')}>Remover imagem</Button></div>}<div className="form-actions"><Button variant="outline" onClick={() => { setCreateOpen(false); setPromoImage('') }}>Cancelar</Button><Button type="submit" disabled={imageProcessing}>Salvar evento</Button></div></form></Modal>}{toast}</>
}

export function MessagesPage() {
  const { data, user, sendMessage, mutate } = useVibeup()
  const [params, setParams] = useSearchParams()
  const requestedContact = params.get('contact') ?? ''
  const mobileView = requestedContact ? 'conversation' : 'list'
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [attachment, setAttachment] = useState('')
  const requestedContactBlocked = !!requestedContact && data.blocked.includes(requestedContact)
  const contacts = data.users.filter((person) => person.id !== user.id && !data.blocked.includes(person.id) && (person.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')) || !search))
  const conversations = contacts.map((person) => ({ person, conversation: data.conversations.find((item) => item.participants.includes(user.id) && item.participants.includes(person.id)) })).filter((item) => item.conversation)
  const activeContact = requestedContact ? contacts.find((person) => person.id === requestedContact) : conversations[0]?.person ?? contacts[0]
  const activeConversation = activeContact ? data.conversations.find((item) => item.participants.includes(user.id) && item.participants.includes(activeContact.id)) : undefined
  function submit(event: FormEvent) { event.preventDefault(); if (!activeContact || data.blocked.includes(activeContact.id) || (!message.trim() && !attachment)) return; sendMessage(activeContact.id, `${message.trim()}${attachment ? `  📎 ${attachment}` : ''}`); setMessage(''); setAttachment('') }
  return <div className="messages-page">
    <div className="messages-title"><div><span className="eyebrow">CONEXÕES DIRETAS</span><h1>Mensagens</h1><p>Converse sobre projetos, oportunidades e ideias em andamento.</p></div><button className="button button-outline" onClick={() => { setSearch(''); setParams({}) }}><Plus size={15}/> Nova conversa</button></div>
    <section className={`messenger messenger-${requestedContactBlocked ? 'list' : mobileView}-mode`} aria-label="Mensagens">
      <aside className="conversation-list" aria-label="Conversas e contatos">
        <div className="conversation-search"><Search size={15} aria-hidden="true"/><input aria-label="Buscar contatos" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar contatos"/></div>
        {contacts.length ? contacts.map((person) => {
          const convo = data.conversations.find((item) => item.participants.includes(user.id) && item.participants.includes(person.id))
          const last = convo?.messages.at(-1)
          return <button className={`conversation-row ${activeContact?.id === person.id ? 'active' : ''}`} aria-pressed={activeContact?.id === person.id} key={person.id} onClick={() => setParams({ contact: person.id })}>
            <div className="message-avatar"><Avatar user={person}/>{person.online && <i/>}</div>
            <span><strong>{person.name}</strong><small>{last?.text ?? 'Inicie uma conversa'}</small></span>
            <time>{last?.time ?? ''}</time>
          </button>
        }) : <p className="conversation-empty">Nenhum contato encontrado.</p>}
      </aside>
      <section className="conversation-view" aria-label={activeContact ? `Conversa com ${activeContact.name}` : 'Conversa'}>
        {activeContact ? <>
          <header className="conversation-header">
            <button className="conversation-back-button" type="button" onClick={() => setParams({})} aria-label="Voltar à lista de conversas"><ArrowLeft size={17}/></button>
            <Avatar user={activeContact}/>
            <div><strong>{activeContact.name}</strong><span><i className={activeContact.online ? 'online-dot' : ''}/>{activeContact.online ? 'Online agora' : activeContact.course}</span></div>
            <Link className="circle-action" to={`/perfil/${activeContact.id}`} aria-label={`Ver perfil de ${activeContact.name}`}><ArrowUpRight size={16}/></Link>
          </header>
          <div className="message-history">{(activeConversation?.messages ?? []).map((item) => <div className={`message-bubble ${item.authorId === user.id ? 'mine' : ''}`} key={item.id}><p>{item.text}</p><time>{item.time}</time><button aria-label="Reagir com coração" onClick={() => mutate((draft) => { const current = draft.conversations.flatMap((conversation) => conversation.messages).find((candidate) => candidate.id === item.id); if (current) current.reaction = current.reaction ? undefined : '💛' })}>{item.reaction ?? '♡'}</button></div>)}</div>
          <form className="composer" onSubmit={submit}><label className="attach-icon" title="Anexar imagem ou vídeo"><Image size={17}/><input type="file" accept="image/*,video/*" onChange={(event) => setAttachment(event.target.files?.[0]?.name ?? '')} hidden/></label><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder={attachment || 'Escreva uma mensagem...'} aria-label="Escreva uma mensagem"/><button className="emoji-button" type="button" onClick={() => setMessage((value) => `${value} ✨`)} aria-label="Adicionar emoji">☺</button><button className="send-button" aria-label="Enviar mensagem"><Send size={17}/></button></form>
        </> : <EmptyState title={requestedContactBlocked ? 'Conversa indisponível' : 'Selecione uma conversa'} text={requestedContactBlocked ? 'Este perfil está bloqueado. O histórico foi preservado e ficará acessível novamente após desbloquear.' : 'Escolha alguém para iniciar uma troca.'}/>}
      </section>
    </section>
  </div>
}

export function NotificationsPage() {
  const { data, user, markNotice } = useVibeup()
  const { showFlash, toast } = useFlash()
  const notices = data.notifications.filter((item) => item.userId === user.id)
  const groups = [
    ['Empresa NorteLab publicou Estágio Front-end, com 3 competências em comum com você.', 'Oportunidade'],
    ['Marina Costa começou a seguir seus projetos.', 'Conexão'],
    ['Seu projeto Painel de indicadores recebeu um novo comentário.', 'Comentário'],
    ['A comunidade Dev SC em Formação publicou um novo tópico.', 'Comunidade'],
  ] as const
  return <><PageHeader eyebrow="VOCÊ ESTÁ EM DIA" title="Notificações" description="Acompanhe as conversas, projetos e oportunidades que cruzam seu caminho." action={<button type="button" className="button button-outline" aria-label="Marcar todas as notificações como lidas" onClick={() => { markNotice(); showFlash('Todas as notificações foram marcadas como lidas.') }}><CheckCheck size={15}/> Marcar todas como lidas</button>}/><div className="notification-toolbar"><span>{notices.filter((item) => !item.read).length} não lidas</span></div><div className="notification-list">{[...notices, ...groups.map(([text, kind], index) => ({ id: `suggestion-${index}`, userId: user.id, text, kind, time: `há ${index + 2} h`, read: index > 1 }))].map((item) => <article className={`notification-card ${item.read ? '' : 'unread'}`} key={item.id}><span className={`notification-symbol symbol-${item.kind.toLocaleLowerCase('pt-BR')}`}>{item.kind === 'Oportunidade' ? <BriefcaseBusiness size={16}/> : item.kind === 'Conexão' ? <UsersRound size={16}/> : item.kind === 'Comentário' ? <MessageCircle size={16}/> : <Sparkles size={16}/>}</span><div><p>{item.text}</p><time>{item.time}</time></div><button className="notification-action" onClick={() => { markNotice(item.id); showFlash('Notificação marcada como lida.') }}>{item.read ? <Check size={15}/> : 'Marcar como lida'}</button></article>)}</div>{toast}</>
}

export function SettingsPage() {
  const { data, user, updateProfile, mutate, reset, switchRole, toggleBlock, toggleCommunity } = useVibeup()
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio)
  const [city, setCity] = useState(user.city)
  const [blockTargetId, setBlockTargetId] = useState('')
  const visibility = getUserPrivacy(data, user.id)
  const [emailNotifications, setEmailNotifications] = useState(data.notifyByEmail)
  const [showDelete, setShowDelete] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)
  const { showFlash, toast } = useFlash()
  const joinedCommunities = data.communities.filter((community) => community.members.includes(user.id))
  const availableBlockTargets = data.users.filter((person) => person.id !== user.id && !data.blocked.includes(person.id))
  const blockedProfiles = data.blocked.filter((id) => id !== user.id).map((id) => ({ id, person: data.users.find((person) => person.id === id) }))
  const visibilityOptions: { key: keyof typeof visibility; title: string; description: string }[] = [
    { key: 'profilePublic', title: 'Perfil público', description: 'Permite encontrar seu perfil na busca.' },
    { key: 'projectsPublic', title: 'Projetos públicos', description: 'Exibe projetos e competências no portfólio.' },
    { key: 'showCity', title: 'Mostrar localização', description: 'Compartilha cidade e unidade Senac.' },
    { key: 'showContact', title: 'Mostrar contato', description: 'Exibe canais de contato no perfil.' },
  ]
  function saveProfile(event: FormEvent) {
    event.preventDefault()
    updateProfile({ name, bio, city })
    showFlash('Dados pessoais atualizados.')
  }
  function blockSelectedProfile(event: FormEvent) {
    event.preventDefault()
    const person = data.users.find((item) => item.id === blockTargetId && item.id !== user.id)
    if (!person || data.blocked.includes(person.id)) return
    toggleBlock(person.id)
    setBlockTargetId('')
    showFlash(person.name + ' foi bloqueado neste navegador.')
  }
  return <>
    <PageHeader eyebrow="CONTROLE SEU ESPAÇO" title="Configurações e privacidade" description="Ajuste como seu perfil e seus projetos aparecem na VibeUp."/>
    <div className="settings-layout">
      <nav className="settings-nav" aria-label="Seções de configurações">
        <a className="active" href="#dados">Dados pessoais</a><a href="#privacidade">Visibilidade</a><a href="#notificacoes">Notificações</a><a href="#seguranca">Segurança</a><a href="#comunidades">Comunidades</a><a href="#conta">Sua conta</a>
      </nav>
      <div className="settings-sections">
        <Panel title="Dados pessoais" className="settings-panel" id="dados">
          <form className="stack-form" onSubmit={saveProfile}>
            <label>Nome de exibição<input value={name} onChange={(event) => setName(event.target.value)}/></label>
            <label>Apresentação<textarea rows={3} value={bio} onChange={(event) => setBio(event.target.value)}/></label>
            <label>Cidade<input value={city} onChange={(event) => setCity(event.target.value)}/></label>
            <label>Foto de perfil<input type="file" accept="image/*" onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              if (file.size > 2_000_000) { showFlash('Escolha uma imagem de até 2 MB.'); event.target.value = ''; return }
              const reader = new FileReader()
              reader.onload = () => { if (typeof reader.result === 'string') { updateProfile({ avatar: reader.result }); showFlash('Foto de perfil atualizada neste navegador.') } }
              reader.readAsDataURL(file)
            }}/><small>Imagem demonstrativa armazenada somente neste navegador (até 2 MB).</small></label>
            <div className="form-actions"><Button type="submit">Salvar alterações</Button></div>
          </form>
        </Panel>
        <Panel title="Visibilidade do perfil" className="settings-panel" id="privacidade">
          <p className="muted">Você define que informações ficam visíveis para empresas e outros estudantes. Estes controles organizam a demonstração local neste navegador; não são controles de segurança.</p>
          {visibilityOptions.map(({ key, title, description }) => <div className="setting-row" key={key}><span><strong>{title}</strong><small>{description}</small></span><button className={'switch ' + (visibility[key] ? 'on' : '')} onClick={() => { const next = { ...visibility, [key]: !visibility[key] }; mutate((draft) => { draft.privacyByUser ??= {}; draft.privacyByUser[user.id] = next; draft.privacy = next }) }} aria-label={title} aria-pressed={visibility[key]}><i/></button></div>)}
        </Panel>
        <Panel title="Notificações" className="settings-panel" id="notificacoes">
          <div className="setting-row"><span><strong>Resumo por e-mail</strong><small>Receba um resumo de oportunidades e conversas importantes.</small></span><button className={'switch ' + (emailNotifications ? 'on' : '')} onClick={() => { const next = !emailNotifications; setEmailNotifications(next); mutate((draft) => { draft.notifyByEmail = next }) }} aria-label="Resumo por e-mail" aria-pressed={emailNotifications}><i/></button></div>
        </Panel>
        <Panel title="Segurança e privacidade" className="settings-panel" id="seguranca">
          <div className="setting-row"><span><strong>Senha</strong><small>Alteração simulada para apresentação.</small></span><Button variant="outline" onClick={() => showFlash('Alteração de senha demonstrativa disponível nesta versão.')}>Alterar senha</Button></div>
          <div className="stack-form">
            <form className="form-grid" onSubmit={blockSelectedProfile}>
              <label>Bloquear perfil<select aria-label="Escolha um perfil para bloquear" value={blockTargetId} onChange={(event) => setBlockTargetId(event.target.value)}><option value="">Selecione uma pessoa</option>{availableBlockTargets.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
              <div className="form-actions"><Button type="submit" variant="outline" disabled={!blockTargetId}>Bloquear</Button></div>
            </form>
            <div aria-live="polite">
              <strong>Perfis bloqueados</strong>
              {blockedProfiles.length ? blockedProfiles.map(({ id, person }) => <div className="setting-row" key={id}><span><strong>{person?.name ?? 'Pessoa indisponível'}</strong><small>Conteúdo e contatos ocultos enquanto o bloqueio estiver ativo.</small></span><Button variant="outline" onClick={() => { toggleBlock(id); showFlash('Perfil desbloqueado.') }}>Desbloquear</Button></div>) : <p className="muted">Nenhum perfil bloqueado.</p>}
            </div>
          </div>
        </Panel>
        <Panel title="Comunidades" className="settings-panel" id="comunidades">
          <p className="muted">Gerencie suas participações. Sair remove apenas sua associação local; publicações e dados anteriores da comunidade permanecem disponíveis.</p>
          {joinedCommunities.length ? joinedCommunities.map((community) => <div className="setting-row" key={community.id}><span><strong>{community.name}</strong><small>{community.category} · {community.members.length} participantes</small></span><Button variant="outline" onClick={() => { toggleCommunity(community.id); showFlash('Você saiu de ' + community.name + '.') }}>Sair</Button></div>) : <p className="muted">Você ainda não participa de comunidades.</p>}
          <Link className="button button-outline" to="/comunidades">Explorar comunidades <ArrowUpRight size={14}/></Link>
        </Panel>
        <Panel title="Conta demonstrativa" className="settings-panel" id="conta">
          <div className="setting-row"><span><strong>Restaurar dados de demonstração</strong><small>Descarta as alterações locais e restaura o conjunto original.</small></span><Button variant="outline" onClick={() => setResetConfirm(true)}><ArrowLeft size={14}/> Restaurar dados</Button></div>
          <div className="setting-row"><span><strong>Desativar conta (simulação)</strong><small>Encerra a sessão deste perfil neste protótipo.</small></span><Button variant="outline" onClick={() => { switchRole('student'); showFlash('Conta demonstrativa desconectada.') }}>Desativar</Button></div>
          <div className="setting-row"><span><strong>Excluir conta (simulação)</strong><small>Nenhum dado é enviado ou excluído de um servidor.</small></span><Button variant="danger" onClick={() => setShowDelete(true)}>Excluir conta</Button></div>
        </Panel>
      </div>
    </div>
    {resetConfirm && <Modal title="Restaurar dados demonstrativos?" onClose={() => setResetConfirm(false)}><p className="modal-copy">As alterações guardadas neste navegador serão substituídas pelos dados fictícios originais.</p><div className="form-actions"><Button variant="outline" onClick={() => setResetConfirm(false)}>Cancelar</Button><Button variant="danger" onClick={() => { reset(); setResetConfirm(false); showFlash('Dados de demonstração restaurados.') }}>Restaurar</Button></div></Modal>}
    {showDelete && <Modal title="Excluir conta demonstrativa" onClose={() => setShowDelete(false)}><p className="modal-copy">Esta ação apenas simula a exclusão e desconecta o perfil atual. Os dados da demonstração permanecem disponíveis para apresentação.</p><div className="form-actions"><Button variant="outline" onClick={() => setShowDelete(false)}>Cancelar</Button><Button variant="danger" onClick={() => { switchRole('student'); setShowDelete(false); showFlash('Exclusão simulada concluída.') }}>Simular exclusão</Button></div></Modal>}
    {toast}
  </>
}

export function OpportunitiesPage() {
  const { data, user, isCompany, createOpportunity, mutate } = useVibeup()
  const [createOpen, setCreateOpen] = useState(false)
  const [view, setView] = useState('Oportunidades')
  const [filter, setFilter] = useState('Todas')
  const [stageFilter, setStageFilter] = useState('Todas as etapas')
  const { showFlash, toast } = useFlash()
  const stages: Opportunity['stage'][] = ['Nova','Em análise','Entrevista','Finalista','Concluída','Encerrada']
  const visible = data.opportunities.filter((item) => (filter === 'Todas' || item.type === filter) && (stageFilter === 'Todas as etapas' || item.stage === stageFilter))
  return <><PageHeader eyebrow={isCompany ? 'PORTAL DE EMPRESAS' : 'SEU PRÓXIMO PASSO'} title={isCompany ? 'Oportunidades e talentos' : 'Oportunidades profissionais'} description={isCompany ? 'Publique vagas e projetos, acompanhe contatos e encontre competências alinhadas.' : 'Vagas, estágios e projetos pensados para quem está começando.'} action={isCompany ? <Button onClick={() => setCreateOpen(true)}><Plus size={15}/> Publicar oportunidade</Button> : <Link className="button button-outline" to="/explorar?tab=Oportunidades"><Search size={15}/> Descobrir talentos</Link>}/><div className="opportunities-toolbar"><div className="event-view-toggle"><button className={view === 'Oportunidades' ? 'active' : ''} onClick={() => setView('Oportunidades')}>Oportunidades</button><button className={view === 'Pipeline' ? 'active' : ''} onClick={() => setView('Pipeline')}>Pipeline</button>{isCompany && <Link to="/relatorios" className="button button-quiet"><TrendingUp size={14}/> Métricas</Link>}</div><div className="filter-inline"><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>Todas</option><option>Estágio</option><option>Emprego</option><option>Projeto</option></select>{view === 'Pipeline' && <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}><option>Todas as etapas</option>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select>}</div></div>{view === 'Oportunidades' ? <div className="opportunity-list">{visible.map((item) => <OpportunityCard key={item.id} opportunity={item}/>)}</div> : <div className="pipeline-board">{stages.map((stage,index) => <section className="pipeline-column" key={stage}><header><span className={`stage-marker stage-${index}`}/>{stage}<b>{visible.filter((item) => item.stage === stage).length}</b></header>{visible.filter((item) => item.stage === stage).map((item) => { const company = data.users.find((person) => person.id === item.companyId); return <article className="pipeline-card" key={item.id}><Pill tone={item.type === 'Estágio' ? 'blue' : ''}>{item.type}</Pill><h3>{item.title}</h3><p>{company?.name}</p><small>{item.city} · {item.mode}</small><select aria-label={`Etapa de ${item.title}`} value={item.stage} onChange={(event) => { mutate((draft) => { const opportunity = draft.opportunities.find((candidate) => candidate.id === item.id); if (opportunity) opportunity.stage = event.target.value as Opportunity['stage'] }); showFlash('Etapa atualizada.') }}>{stages.map((option) => <option key={option}>{option}</option>)}</select></article>})}{!visible.some((item) => item.stage === stage) && <div className="pipeline-empty">Nenhuma oportunidade</div>}</section>)}</div>}
    {isCompany && <Panel title="Talentos salvos recentemente" className="saved-talents-panel"><div className="saved-talent-strip">{data.users.filter((person) => data.favorites.includes(person.id) && canViewProfile(data, user.id, person.id)).map((person) => <Link to={`/perfil/${person.id}`} key={person.id}><Avatar user={person}/><span><strong>{person.name}</strong><small>{person.course}</small></span></Link>)}{data.favorites.filter((id) => data.users.some((person) => person.id === id && canViewProfile(data, user.id, person.id))).length === 0 && <p className="muted">Salve perfis de estudantes na área Explorar para montar sua lista de talentos.</p>}<Link className="button button-outline" to="/explorar">Encontrar talentos <ArrowUpRight size={14}/></Link></div></Panel>}
    {createOpen && <Modal title="Publicar oportunidade" onClose={() => setCreateOpen(false)}><form className="stack-form" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); createOpportunity({ title: String(form.get('title')), type: String(form.get('type')) as Opportunity['type'], city: String(form.get('city')), mode: String(form.get('mode')) as Opportunity['mode'], description: String(form.get('description')), requirements: commaList(String(form.get('requirements'))), deadline: String(form.get('deadline')), stage: 'Nova' }); setCreateOpen(false); showFlash('Oportunidade publicada e disponível para pesquisa.') }}><label>Título da vaga, estágio ou projeto<input name="title" required/></label><div className="form-grid"><label>Tipo<select name="type"><option>Estágio</option><option>Emprego</option><option>Projeto</option></select></label><label>Modalidade<select name="mode"><option>Híbrido</option><option>Presencial</option><option>Remoto</option></select></label></div><div className="form-grid"><label>Cidade<input name="city" required defaultValue={user.city}/></label><label>Prazo de candidatura<input name="deadline" type="date" required defaultValue="2026-12-05"/></label></div><label>Descrição<textarea name="description" rows={3} required/></label><label>Competências desejadas<input name="requirements" placeholder="Figma, React, Excel" required/><small>Separe os requisitos por vírgula. A compatibilidade compara habilidades declaradas e demonstradas em projetos.</small></label><div className="form-actions"><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button><Button type="submit">Salvar oportunidade</Button></div></form></Modal>}{toast}</>
}

export function ReportsPage() {
  const { data, user } = useVibeup()
  const now = useNow()
  const [area, setArea] = useState('Todas as áreas')
  const [companyId, setCompanyId] = useState('Todas as empresas')
  const [period, setPeriod] = useState('Últimos 30 dias')
  const days = period === 'Últimos 30 dias' ? 30 : period === 'Últimos 90 dias' ? 90 : 0
  const cutoff = days ? new Date(now - days * 24 * 60 * 60 * 1000) : null
  const inPeriod = (value?: string) => { if (!cutoff) return true; const date = new Date(`${value ?? '2026-11-17'}T12:00:00`); return !Number.isNaN(date.getTime()) && date >= cutoff }
  const filteredStudents = data.users.filter((person) => person.role === 'student' && canViewProfile(data, user.id, person.id) && (area === 'Todas as áreas' || person.area === area) && inPeriod(person.createdAt))
  const filteredProjects = data.projects.filter((project) => canViewProject(data, user.id, project) && (area === 'Todas as áreas' || project.category === area) && inPeriod(project.createdAt))
  const filteredOpportunities = data.opportunities.filter((item) => inPeriod(item.createdAt) && (companyId === 'Todas as empresas' || item.companyId === companyId))
  const visibleSkills = (person: User) => [...(canViewUserSkills(data, user.id, person.id) ? person.skills : []), ...filteredProjects.filter((project) => project.ownerId === person.id).flatMap((project) => project.skills)]
  const matchCount = filteredOpportunities.reduce((count, opportunity) => count + filteredStudents.filter((person) => getCompatibility(opportunity.requirements, visibleSkills(person)).score >= 60).length, 0)
  const barData = ['Tecnologia','Design','Gestão','Gastronomia','Comunicação','Logística'].map((label) => ({ label, value: filteredStudents.filter((person) => person.area === label).length + filteredProjects.filter((project) => project.category === label).length }))
  const maxBar = Math.max(...barData.map((item) => item.value))
  function exportCsv() { const rows = [['Métrica','Valor'],['Estudantes encontrados',filteredStudents.length.toString()],['Projetos publicados',filteredProjects.length.toString()],['Oportunidades publicadas',filteredOpportunities.filter((item) => item.stage !== 'Encerrada').length.toString()],['Compatibilidades acima de 60%',matchCount.toString()],['Áreas',area],['Empresa responsável',companyId === 'Todas as empresas' ? companyId : data.users.find((item) => item.id === companyId)?.name ?? companyId],['Período',period]]; const blob = new Blob([rows.map((row) => row.map((value) => `"${value.replaceAll('"','""')}"`).join(',')).join('\n')],{type:'text/csv;charset=utf-8'}); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'vibeup-relatorio-talentos.csv'; anchor.click(); URL.revokeObjectURL(url) }
  return <><PageHeader eyebrow="VISÃO DO MERCADO DE TALENTOS" title="Indicadores de descoberta" description="Métricas demonstrativas calculadas sobre os perfis, projetos e oportunidades da VibeUp." action={<Button variant="outline" onClick={exportCsv}><ArrowUpRight size={15}/> Exportar CSV</Button>}/><div className="report-filters"><label>Período<select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Últimos 30 dias</option><option>Últimos 90 dias</option><option>Todo o período</option></select></label><label>Área profissional<select value={area} onChange={(event) => setArea(event.target.value)}><option>Todas as áreas</option>{Array.from(new Set(filteredStudents.map((person) => person.area))).map((item) => <option key={item}>{item}</option>)}</select></label><label>Empresa responsável<select value={companyId} onChange={(event) => setCompanyId(event.target.value)}><option>Todas as empresas</option>{data.users.filter((person) => person.role === 'company').map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select></label><span className="muted">Filtro: {period} · {area} · {companyId === 'Todas as empresas' ? companyId : data.users.find((item) => item.id === companyId)?.name}</span></div><div className="report-metrics"><Metric value={filteredStudents.length} label="talentos no radar" icon={<UsersRound size={17}/>} note="Perfis demonstrativos ativos"/><Metric value={filteredProjects.length} label="projetos mapeados" icon={<Sparkles size={17}/>} note="Evidências práticas de competências"/><Metric value={filteredOpportunities.length} label="oportunidades publicadas" icon={<BriefcaseBusiness size={17}/>} note="Vagas, estágios e projetos"/><Metric value={matchCount} label="compatibilidades sugeridas" icon={<TrendingUp size={17}/>} note="Recomendação auxiliar, não avaliação"/></div><div className="report-charts"><Panel title="Talentos e projetos por área" className="chart-panel"><div className="bar-chart">{barData.map((item) => <div className="bar-column" key={item.label}><span>{item.value}</span><div><i style={{height:`${Math.max(12, (item.value/maxBar)*100)}%`}}/></div><small>{item.label}</small></div>)}</div><div className="chart-legend"><span><i/> Perfis e projetos em conjunto</span><span>Dados fictícios do protótipo</span></div></Panel><Panel title="Atividade da plataforma" className="activity-panel"><div className="activity-figure"><strong>{data.posts.filter((post) => canViewPost(data, user.id, post)).length}</strong><span>publicações compartilhadas</span><i style={{width:`${Math.min(100, data.posts.filter((post) => canViewPost(data, user.id, post)).length * 3)}%`}}/></div><div className="activity-figure"><strong>{data.events.reduce((count,event) => count + event.attendees.length, 0)}</strong><span>participações em eventos</span><i style={{width:'64%'}}/></div><div className="activity-figure"><strong>{data.communities.reduce((count,community) => count + community.members.length, 0)}</strong><span>participações em comunidades</span><i style={{width:'78%'}}/></div><p className="report-caveat">A compatibilidade apoia a descoberta. Não representa avaliação definitiva nem critério automático de contratação.</p></Panel></div><Panel title="Recomendações por competências" className="recommendations-panel"><div className="recommendation-rows">{filteredOpportunities.slice(0,4).map((opportunity) => { const company = data.users.find((person) => person.id === opportunity.companyId); const matches = filteredStudents.map((person) => ({person, score:getCompatibility(opportunity.requirements,visibleSkills(person)).score})).sort((a,b) => b.score-a.score).slice(0,3); return <div className="recommendation-row" key={opportunity.id}><span><strong>{opportunity.title}</strong><small>{company?.name} · {opportunity.requirements.join(', ')}</small></span><div>{matches.map(({person,score}) => <Link to={`/perfil/${person.id}`} key={person.id}><Avatar user={person} size="sm"/><strong>{score}%</strong><small>{person.name.split(' ')[0]}</small></Link>)}</div></div>})}</div></Panel></>
}

export function NotFoundPage() {
  return <div className="not-found"><span className="eyebrow">404 · CAMINHO NÃO ENCONTRADO</span><h1>Essa rota ainda não existe.</h1><p>Volte para o início e continue explorando talentos e projetos.</p><Link to="/feed" className="button button-primary"><ArrowLeft size={15}/> Voltar ao início</Link></div>
}
