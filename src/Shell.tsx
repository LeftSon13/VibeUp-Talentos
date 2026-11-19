import { useEffect, useRef, useState, type FormEvent } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell, Compass, Home, MessageCircle, Plus, Search, Settings2, UsersRound,
  Trophy, CalendarDays, BriefcaseBusiness, LayoutDashboard, ChevronDown, Menu, X,
} from 'lucide-react'
import { Avatar, BrandIcon, BrandLockup } from './ui'
import { useVibeup } from './store'

const links = [
  { to: '/feed', label: 'Início', icon: Home },
  { to: '/explorar', label: 'Explorar talentos', icon: Compass },
  { to: '/comunidades', label: 'Comunidades', icon: UsersRound },
  { to: '/desafios', label: 'Desafios', icon: Trophy },
  { to: '/mensagens', label: 'Mensagens', icon: MessageCircle },
  { to: '/eventos', label: 'Eventos', icon: CalendarDays },
]

export function AppShell() {
  const { data, user, isCompany, switchRole } = useVibeup()
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileNavHidden, setMobileNavHidden] = useState(false)
  const [mobileTopbarHidden, setMobileTopbarHidden] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileNavRef = useRef<HTMLElement>(null)
  const topbarRef = useRef<HTMLElement>(null)
  const mobileMenuOpenRef = useRef(false)
  const unread = data.notifications.filter((notice) => !notice.read && notice.userId === user.id).length
  const searchShortcut = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘ K' : 'Ctrl K'

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') return
      const target = event.target instanceof HTMLElement ? event.target : null
      if (target?.closest('input, textarea, select') || target?.isContentEditable) return
      event.preventDefault()
      searchInputRef.current?.focus()
    }

    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  useEffect(() => {
    let previousY = window.scrollY
    let showTimer: number | undefined

    function clearShowTimer() {
      if (showTimer !== undefined) {
        window.clearTimeout(showTimer)
        showTimer = undefined
      }
    }

    function showNav() {
      setMobileNavHidden(false)
      setMobileTopbarHidden(false)
    }

    function handleScroll() {
      const currentY = window.scrollY
      const delta = currentY - previousY
      previousY = currentY

      if (!window.matchMedia('(max-width: 700px)').matches) {
        clearShowTimer()
        showNav()
        return
      }

      if (Math.abs(delta) > 1) {
        if (!mobileNavRef.current?.contains(document.activeElement)) {
          setMobileNavHidden(true)
        }
        const topbarHasFocus = topbarRef.current?.contains(document.activeElement)
        if (!topbarHasFocus && !mobileMenuOpenRef.current) {
          setMobileTopbarHidden(true)
        }
      }

      clearShowTimer()
      showTimer = window.setTimeout(showNav, 250)
    }

    function handleResize() {
      previousY = window.scrollY
      if (!window.matchMedia('(max-width: 700px)').matches) {
        clearShowTimer()
        showNav()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      clearShowTimer()
    }
  }, [])

  function search(event: FormEvent) {
    event.preventDefault()
    navigate(`/explorar?q=${encodeURIComponent(query)}`)
  }

  function toggleMobileMenu() {
    const nextOpen = !mobileMenuOpenRef.current
    mobileMenuOpenRef.current = nextOpen
    setMobileMenuOpen(nextOpen)
  }

  function closeMobileMenu() {
    mobileMenuOpenRef.current = false
    setMobileMenuOpen(false)
  }

  return <div className="app-layout">
    <aside className="sidebar">
      <BrandLockup />
      <div className="sidebar-note"><span className="note-dot"/><span><b>Atividade acadêmica</b><small>Proposta independente</small></span></div>
      <nav className="sidebar-nav" aria-label="Navegação principal">
        <span className="nav-label">COMUNIDADE</span>
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} aria-label={label} title={label} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{label}</span>{label === 'Mensagens' && <i className="nav-count">2</i>}</NavLink>)}
        <span className="nav-label nav-label-spaced">PARA SUA CARREIRA</span>
        <NavLink to="/publicar" aria-label="Criar publicação" title="Criar publicação" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Plus size={18} /><span>Criar publicação</span></NavLink>
        <NavLink to="/empresas/oportunidades" aria-label="Oportunidades" title="Oportunidades" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><BriefcaseBusiness size={18} /><span>Oportunidades</span></NavLink>
        {isCompany && <NavLink to="/relatorios" aria-label="Visão da empresa" title="Visão da empresa" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><LayoutDashboard size={18} /><span>Visão da empresa</span></NavLink>}
        <NavLink to="/notificacoes" title="Notificações" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} aria-label={unread > 0 ? `Notificações, ${unread} não lidas` : 'Notificações'}><Bell size={18} /><span>Notificações</span>{unread > 0 && <i className="notification-dot" aria-hidden="true" />}</NavLink>
        <NavLink to="/configuracoes" aria-label="Configurações" title="Configurações" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Settings2 size={18} /><span>Configurações</span></NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="community-promo"><BrandIcon name="portfolio" className="promo-glyph"/><strong>Talento se revela fazendo.</strong><p>Mostre o que você está construindo.</p><NavLink to="/publicar">Compartilhar projeto <span>→</span></NavLink></div>
        <button className="profile-switch" aria-label={isCompany ? `Menu do perfil da empresa ${user.name}` : `Menu do perfil de ${user.name}`} title={isCompany ? `Menu do perfil da empresa ${user.name}` : `Menu do perfil de ${user.name}`} onClick={() => setMenuOpen((open) => !open)}><Avatar user={user} size="sm" /><span><strong>{user.name.split(' ')[0]}</strong><small>{isCompany ? 'Perfil empresa' : user.course}</small></span><ChevronDown size={16} /></button>
        {menuOpen && <div className="role-menu"><button onClick={() => { switchRole('student'); setMenuOpen(false) }}>Entrar como estudante</button><button onClick={() => { switchRole('company'); setMenuOpen(false) }}>Entrar como empresa</button><button onClick={() => { navigate('/login'); setMenuOpen(false) }}>Trocar conta</button></div>}
      </div>
    </aside>
    <div className="main-column">
      <header ref={topbarRef} className={`topbar${mobileTopbarHidden ? ' is-hidden' : ''}`} onFocusCapture={() => setMobileTopbarHidden(false)}>
        <form className="global-search" onSubmit={search}><Search size={18} /><input ref={searchInputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busque pessoas, projetos e competências" aria-label="Busca global" /><kbd>{searchShortcut}</kbd></form>
        <div className="topbar-actions"><button className="role-toggle" onClick={() => switchRole(isCompany ? 'student' : 'company')}><span className={`role-toggle-dot ${isCompany ? 'company' : ''}`} />{isCompany ? 'Visão empresa' : 'Visão estudante'}<ChevronDown size={14} /></button><NavLink to="/notificacoes" className={`topbar-icon ${location.pathname === '/notificacoes' ? 'active' : ''}`} aria-label={unread > 0 ? `Notificações, ${unread} não lidas` : 'Notificações'}><Bell size={18} />{unread > 0 && <i className="notification-dot" aria-hidden="true" />}</NavLink><button className="mobile-more-button" onClick={toggleMobileMenu} aria-label={mobileMenuOpen ? 'Fechar menu complementar' : 'Abrir menu complementar'} aria-expanded={mobileMenuOpen} aria-controls="mobile-complement-menu">{mobileMenuOpen ? <X size={19}/> : <Menu size={19}/>}</button><NavLink to="/configuracoes" className="topbar-avatar" aria-label="Configurações"><Avatar user={user} size="sm" /></NavLink></div>
        {mobileMenuOpen && <div id="mobile-complement-menu" className="mobile-complement-menu"><span className="eyebrow">MAIS DA VIBEUP</span><NavLink onClick={closeMobileMenu} to="/comunidades"><UsersRound size={16}/> Comunidades</NavLink><NavLink onClick={closeMobileMenu} to="/desafios"><Trophy size={16}/> Desafios</NavLink><NavLink onClick={closeMobileMenu} to="/eventos"><CalendarDays size={16}/> Eventos</NavLink><NavLink onClick={closeMobileMenu} to="/empresas/oportunidades"><BriefcaseBusiness size={16}/> Oportunidades</NavLink>{isCompany && <NavLink onClick={closeMobileMenu} to="/relatorios"><LayoutDashboard size={16}/> Visão da empresa</NavLink>}<NavLink onClick={closeMobileMenu} to="/notificacoes"><Bell size={16}/> Notificações {unread > 0 && <i className="notification-dot"/>}</NavLink><NavLink onClick={closeMobileMenu} to="/configuracoes" aria-label="Configurações"><Settings2 size={16}/> Configurações</NavLink><button onClick={() => { switchRole(isCompany ? 'student' : 'company'); closeMobileMenu() }}>{isCompany ? 'Trocar para estudante' : 'Trocar para empresa'}</button></div>}
      </header>
      <main className="page-content"><Outlet /></main>
      <footer className="app-footer"><span>VibeUp Talentos · atividade acadêmica independente</span><span>Marcas do Senac SC e Jovem Programador são referências visuais; esta proposta não possui vínculo institucional.</span></footer>
    </div>
    <nav ref={mobileNavRef} className={`mobile-nav${mobileNavHidden ? ' is-hidden' : ''}`} aria-label="Navegação móvel" onFocusCapture={() => setMobileNavHidden(false)}>
      <NavLink to="/feed" aria-label="Início"><Home size={19} /><small>Início</small></NavLink><NavLink to="/explorar" aria-label="Explorar"><Compass size={19} /><small>Explorar</small></NavLink><NavLink to="/publicar" aria-label="Publicar"><Plus size={20} /><small>Publicar</small></NavLink><NavLink to="/mensagens" aria-label="Mensagens"><MessageCircle size={19} /><small>Mensagens</small></NavLink><NavLink to={`/perfil/${user.id}`} aria-label="Meu perfil"><Avatar user={user} size="sm"/><small>Perfil</small></NavLink>
    </nav>
  </div>
}
