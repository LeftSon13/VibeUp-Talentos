import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Challenge, Community, DemoData, EventItem, Opportunity, Post, Project, Role, User } from './domain'
import { DEFAULT_PRIVACY_SETTINGS, STORAGE_KEY } from './domain'
import { seedData } from './seed'

type NewPost = { text: string; title?: string; category?: string; course?: string; skills?: string[]; tools?: string[]; collaborators?: string[]; links?: string[]; location?: string; communityId?: string; privacy?: string; media?: string[]; project?: boolean; temporary?: boolean }

const legacyDemoTints = new Set(['#e9efff', '#fff0e7', '#e4f6f0', '#f4eaff', '#fff5d9', '#e5f4fa', '#ffebed', '#edf6e6'])
const projectTintByCategory: Record<string, string> = {
  Tecnologia: '#f2eafb', Design: '#fce8f3', Comunicação: '#f4edfb', Gastronomia: '#fff1d4',
  Gestão: '#e8e2f2', Saúde: '#f5f1f8', Logística: '#fff1d4', Carreira: '#f4edfb', Comunidade: '#f2eafb',
}

type VibeContextValue = {
  data: DemoData
  user: User
  isCompany: boolean
  switchRole: (role: Role) => void
  mutate: (recipe: (draft: DemoData) => void) => void
  reset: () => void
  addPost: (item: NewPost) => void
  likePost: (postId: string) => void
  commentPost: (postId: string, text: string) => void
  toggleFavorite: (userId: string) => void
  toggleConnection: (userId: string) => void
  toggleBlock: (userId: string) => void
  toggleCommunity: (id: string) => void
  toggleChallenge: (id: string) => void
  submitChallenge: (id: string, result: { title: string; context: string; link?: string; teamMemberIds?: string[] }) => void
  createChallenge: (item: Omit<Challenge, 'id' | 'companyId' | 'participants'>) => void
  toggleEvent: (id: string) => void
  applyOpportunity: (id: string) => void
  sendMessage: (contactId: string, text: string) => void
  markNotice: (id?: string) => void
  createOpportunity: (item: Omit<Opportunity, 'id' | 'companyId'>) => void
  createEvent: (item: Omit<EventItem, 'id' | 'organizerId' | 'attendees'>) => void
  createCommunity: (item: Omit<Community, 'id' | 'members' | 'post'>) => void
  updateProfile: (changes: Partial<User>) => void
}

const VibeContext = createContext<VibeContextValue | null>(null)

function normalizeLocalPreferences(data: DemoData): DemoData {
  const privacyByUser = {
    ...Object.fromEntries(data.users.map((person) => [person.id, { ...DEFAULT_PRIVACY_SETTINGS }])),
    ...(data.privacyByUser ?? {}),
  }
  if (!data.privacyByUser?.[data.currentUserId] && data.privacy) {
    privacyByUser[data.currentUserId] = { ...DEFAULT_PRIVACY_SETTINGS, ...data.privacy }
  }

  const connectionsByUser = {
    ...Object.fromEntries(data.users.map((person) => [person.id, [] as string[]])),
    ...(data.connectionsByUser ?? {}),
  }
  if (!data.connectionsByUser?.[data.currentUserId]) {
    connectionsByUser[data.currentUserId] = [...(data.connections ?? [])]
  }

  return {
    ...data,
    privacyByUser,
    connectionsByUser,
    privacy: { ...DEFAULT_PRIVACY_SETTINGS, ...privacyByUser[data.currentUserId] },
    connections: [...connectionsByUser[data.currentUserId]],
  }
}

function addActivityNotice(data: DemoData, actorId: string, recipientId: string, text: string, kind: string) {
  if (!recipientId || recipientId === actorId) return
  data.notifications ??= []
  data.notifications.unshift({
    id: `notice-local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    userId: recipientId,
    text,
    kind,
    time: 'agora',
    read: false,
  })
}

function readStoredData(): DemoData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as DemoData
      const baseline = seedData()
      parsed.applications ??= []
      parsed.submittedChallenges ??= []
      parsed.challengeSubmissions ??= []
      parsed.notifications ??= baseline.notifications
      parsed.blocked ??= []
      parsed.users = parsed.users.map((person) => {
        const seedPerson = baseline.users.find((item) => item.id === person.id)
        return seedPerson && legacyDemoTints.has((person.cover ?? '').toLowerCase()) ? { ...person, cover: seedPerson.cover } : person
      })
      parsed.projects = parsed.projects.map((project) => {
        if (!legacyDemoTints.has((project.cover ?? '').toLowerCase())) return project
        const seedProject = baseline.projects.find((item) => item.id === project.id)
        return { ...project, cover: seedProject?.cover ?? projectTintByCategory[project.category] ?? '#f4edfb' }
      })
      parsed.communities = parsed.communities.map((community) => {
        if (!legacyDemoTints.has((community.color ?? '').toLowerCase())) return community
        return { ...community, color: baseline.communities.find((item) => item.id === community.id)?.color ?? '#f2eafb' }
      })
      for (const person of parsed.users) {
        if (!person.createdAt) person.createdAt = baseline.users.find((item) => item.id === person.id)?.createdAt ?? '2026-11-17'
      }
      for (const opportunity of parsed.opportunities) {
        if (!opportunity.createdAt) opportunity.createdAt = baseline.opportunities.find((item) => item.id === opportunity.id)?.createdAt ?? '2026-11-17'
      }
      return normalizeLocalPreferences(parsed)
    }
  } catch { /* Fall back to the demo fixtures when storage is unavailable. */ }
  return normalizeLocalPreferences(seedData())
}

export function VibeProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoData>(readStoredData)
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }, [data])
  const user = data.users.find((item) => item.id === data.currentUserId) ?? data.users[0]

  const value = useMemo<VibeContextValue>(() => {
    const mutate = (recipe: (draft: DemoData) => void) => setData((current) => {
      const next = structuredClone(current)
      recipe(next)
      return next
    })
    return {
      data, user, isCompany: user.role === 'company', mutate,
      switchRole: (role) => mutate((draft) => {
        const nextUserId = role === 'company' ? 'company-1' : 'student-1'
        draft.currentUserId = nextUserId
        draft.privacyByUser ??= {}
        draft.privacyByUser[nextUserId] ??= { ...DEFAULT_PRIVACY_SETTINGS }
        draft.privacy = { ...DEFAULT_PRIVACY_SETTINGS, ...draft.privacyByUser[nextUserId] }
        draft.connectionsByUser ??= {}
        draft.connectionsByUser[nextUserId] ??= []
        draft.connections = [...draft.connectionsByUser[nextUserId]]
      }),
      reset: () => setData(normalizeLocalPreferences(seedData())),
      addPost: (item) => mutate((draft) => {
        const id = `project-local-${Date.now()}`
        let projectId: string | undefined
        if (item.project) {
          const project: Project = {
            id, title: item.title || 'Projeto sem título', description: item.text, category: item.category || user.area,
            ownerId: user.id, collaborators: item.collaborators ?? [], skills: item.skills ?? [], tools: item.tools ?? [], cover: projectTintByCategory[item.category || user.area] ?? '#f2eafb',
            createdAt: new Date().toISOString().slice(0, 10), likes: 0,
            course: item.course, links: item.links, location: item.location, communityId: item.communityId, privacy: item.privacy, media: item.media,
          }
          draft.projects.unshift(project)
          projectId = id
        }
        const post: Post = {
          id: `post-local-${Date.now()}`, authorId: user.id, text: item.text, projectId,
          createdAt: new Date().toISOString(), likedBy: [], comments: [],
          privacy: item.privacy, communityId: item.communityId, media: item.media,
          ...(item.temporary ? { expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() } : {}),
        }
        draft.posts.unshift(post)
        draft.notifications.unshift({ id: `notice-local-${Date.now()}`, userId: user.id, text: item.project ? 'Seu novo projeto já está no portfólio.' : 'Sua publicação foi compartilhada com a comunidade.', kind: 'Publicação', time: 'agora', read: false })
      }),
      likePost: (postId) => mutate((draft) => {
        const post = draft.posts.find((item) => item.id === postId)
        if (!post) return
        const alreadyLiked = post.likedBy.includes(user.id)
        post.likedBy = alreadyLiked ? post.likedBy.filter((id) => id !== user.id) : [...post.likedBy, user.id]
        if (!alreadyLiked) addActivityNotice(draft, user.id, post.authorId, `${user.name} curtiu sua publicação.`, 'Curtida')
      }),
      commentPost: (postId, text) => mutate((draft) => {
        const post = draft.posts.find((item) => item.id === postId)
        if (post) {
          post.comments.push({ id: `comment-local-${Date.now()}`, authorId: user.id, text })
          addActivityNotice(draft, user.id, post.authorId, `${user.name} comentou na sua publicação.`, 'Comentário')
        }
      }),
      toggleFavorite: (id) => mutate((draft) => { draft.favorites = draft.favorites.includes(id) ? draft.favorites.filter((item) => item !== id) : [...draft.favorites, id] }),
      toggleBlock: (id) => mutate((draft) => {
        if (id === user.id || !draft.users.some((person) => person.id === id)) return
        draft.blocked ??= []
        draft.blocked = draft.blocked.includes(id) ? draft.blocked.filter((blockedId) => blockedId !== id) : [...draft.blocked, id]
      }),
      toggleConnection: (id) => mutate((draft) => {
        draft.connectionsByUser ??= {}
        draft.connectionsByUser[user.id] ??= [...draft.connections]
        draft.connectionsByUser[id] ??= []
        const connected = draft.connectionsByUser[user.id].includes(id) || draft.connectionsByUser[id].includes(user.id)
        if (connected) {
          draft.connectionsByUser[user.id] = draft.connectionsByUser[user.id].filter((item) => item !== id)
          draft.connectionsByUser[id] = draft.connectionsByUser[id].filter((item) => item !== user.id)
        } else {
          if (!draft.connectionsByUser[user.id].includes(id)) draft.connectionsByUser[user.id].push(id)
          if (!draft.connectionsByUser[id].includes(user.id)) draft.connectionsByUser[id].push(user.id)
          addActivityNotice(draft, user.id, id, `${user.name} enviou um convite para se conectar.`, 'Conexão')
        }
        draft.connections = [...draft.connectionsByUser[user.id]]
      }),
      toggleCommunity: (id) => mutate((draft) => {
        const community = draft.communities.find((item) => item.id === id)
        if (community) community.members = community.members.includes(user.id) ? community.members.filter((member) => member !== user.id) : [...community.members, user.id]
      }),
      toggleChallenge: (id) => mutate((draft) => {
        const challenge = draft.challenges.find((item) => item.id === id)
        if (!challenge) return
        const alreadyJoined = challenge.participants.includes(user.id)
        challenge.participants = alreadyJoined ? challenge.participants.filter((member) => member !== user.id) : [...challenge.participants, user.id]
        if (!alreadyJoined) addActivityNotice(draft, user.id, challenge.companyId, `${user.name} se inscreveu no desafio ${challenge.title}.`, 'Desafio')
      }),
      submitChallenge: (id, result) => mutate((draft) => {
        const challenge = draft.challenges.find((item) => item.id === id)
        const title = result.title.trim()
        const context = result.context.trim()
        const link = result.link?.trim()
        if (!challenge || !title || !context) return
        draft.challengeSubmissions ??= []
        if (draft.challengeSubmissions.some((item) => item.challengeId === id && (item.userId === user.id || item.teamMemberIds?.includes(user.id)))) return
        const projectId = `project-challenge-${Date.now()}-${user.id}`
        const submittedAt = new Date().toISOString()
        const project: Project = {
          id: projectId, title, description: context, category: challenge.category, ownerId: user.id,
          collaborators: [], skills: [], tools: [], cover: projectTintByCategory[challenge.category] ?? '#f2eafb', createdAt: submittedAt.slice(0, 10), likes: 0,
          ...(link ? { links: [link] } : {}),
        }
        draft.projects.unshift(project)
        const submittedMemberIds = new Set((draft.challengeSubmissions ?? []).flatMap((submission) => [submission.userId, ...(submission.teamMemberIds ?? [])]))
        const teamMemberIds = Array.from(new Set(result.teamMemberIds ?? [])).filter((memberId) =>
          memberId !== user.id && challenge.participants.includes(memberId) && !submittedMemberIds.has(memberId) &&
          draft.users.some((person) => person.id === memberId && person.role === 'student'),
        )
        draft.challengeSubmissions.unshift({
          id: `challenge-submission-${Date.now()}-${user.id}`, challengeId: id, userId: user.id, projectId,
          title, context, ...(teamMemberIds.length ? { teamMemberIds } : {}), ...(link ? { link } : {}), submittedAt,
        })
        if (!draft.submittedChallenges.includes(id)) draft.submittedChallenges.push(id)
        addActivityNotice(draft, user.id, challenge.companyId, `${user.name} enviou uma entrega para o desafio ${challenge.title}.`, 'Desafio')
      }),
      createChallenge: (item) => mutate((draft) => {
        if (user.role !== 'company' || !item.title.trim() || !item.description.trim() || !item.deadline) return
        draft.challenges.unshift({
          ...item,
          id: `challenge-local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title: item.title.trim(),
          description: item.description.trim(),
          points: Math.max(0, Math.round(item.points)),
          companyId: user.id,
          participants: [],
        })
      }),
      toggleEvent: (id) => mutate((draft) => {
        const event = draft.events.find((item) => item.id === id)
        if (!event) return
        const alreadyAttending = event.attendees.includes(user.id)
        event.attendees = alreadyAttending ? event.attendees.filter((member) => member !== user.id) : [...event.attendees, user.id]
        if (!alreadyAttending) addActivityNotice(draft, user.id, event.organizerId, `${user.name} confirmou presença em ${event.title}.`, 'Evento')
      }),
      applyOpportunity: (id) => mutate((draft) => {
        const key = `${user.id}:${id}`
        if (draft.applications.includes(key)) return
        draft.applications.push(key)
        const opportunity = draft.opportunities.find((item) => item.id === id)
        if (opportunity && opportunity.companyId !== user.id) draft.notifications.unshift({ id: `notice-application-${Date.now()}`, userId: opportunity.companyId, text: `${user.name} demonstrou interesse na oportunidade ${opportunity.title}.`, kind: 'Candidatura', time: 'agora', read: false })
      }),
      sendMessage: (contactId, text) => mutate((draft) => {
        if (draft.blocked?.includes(contactId)) return
        let conversation = draft.conversations.find((item) => item.participants.includes(user.id) && item.participants.includes(contactId))
        const message = { id: `message-${Date.now()}`, authorId: user.id, text, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }
        if (!conversation) { conversation = { id: `conversation-${Date.now()}`, participants: [user.id, contactId], messages: [] }; draft.conversations.unshift(conversation) }
        conversation.messages.push(message)
        addActivityNotice(draft, user.id, contactId, `${user.name} enviou uma nova mensagem.`, 'Mensagem')
      }),
      markNotice: (id) => mutate((draft) => { draft.notifications.forEach((notice) => { if (!id || notice.id === id) notice.read = true }) }),
      createOpportunity: (item) => mutate((draft) => draft.opportunities.unshift({ ...item, id: `opportunity-local-${Date.now()}`, companyId: user.id, createdAt: new Date().toISOString().slice(0, 10) })),
      createEvent: (item) => mutate((draft) => draft.events.unshift({ ...item, id: `event-local-${Date.now()}`, organizerId: user.id, attendees: [user.id] })),
      createCommunity: (item) => mutate((draft) => draft.communities.unshift({ ...item, id: `community-local-${Date.now()}`, members: [user.id], post: 'Nova comunidade criada. Apresente-se e compartilhe no que está trabalhando.' })),
      updateProfile: (changes) => mutate((draft) => { const current = draft.users.find((item) => item.id === user.id); if (current) Object.assign(current, changes) }),
    }
  }, [data, user])

  return <VibeContext.Provider value={value}>{children}</VibeContext.Provider>
}

export function useVibeup() {
  const context = useContext(VibeContext)
  if (!context) throw new Error('useVibeup deve ser usado dentro de VibeProvider')
  return context
}
