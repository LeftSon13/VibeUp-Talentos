export type Role = 'student' | 'company' | 'educator'

export type PrivacySettings = {
  profilePublic: boolean
  projectsPublic: boolean
  showCity: boolean
  showContact: boolean
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  profilePublic: true,
  projectsPublic: true,
  showCity: true,
  showContact: false,
}

export type User = {
  id: string
  name: string
  role: Role
  email: string
  city: string
  unit: string
  course: string
  area: string
  avatar: string
  cover: string
  bio: string
  skills: string[]
  tools: string[]
  interests: string[]
  experiences?: string[]
  courses?: string[]
  certificates?: string[]
  availability: 'Estágio' | 'Emprego' | 'Projetos' | 'Não informado'
  /** Legacy persisted score retained only while older localStorage payloads migrate. */
  reputation?: number
  connections: number
  online?: boolean
  createdAt?: string
}

export type Project = {
  id: string
  title: string
  description: string
  category: string
  ownerId: string
  collaborators: string[]
  skills: string[]
  tools: string[]
  cover: string
  createdAt: string
  likes: number
  course?: string
  links?: string[]
  location?: string
  communityId?: string
  privacy?: string
  media?: string[]
}

export type Post = {
  id: string
  authorId: string
  text: string
  projectId?: string
  createdAt: string
  expiresAt?: string
  likedBy: string[]
  comments: { id: string; authorId: string; text: string }[]
  privacy?: string
  communityId?: string
  media?: string[]
}

export type Opportunity = {
  id: string
  companyId: string
  title: string
  type: 'Estágio' | 'Emprego' | 'Projeto'
  city: string
  mode: 'Presencial' | 'Híbrido' | 'Remoto'
  description: string
  requirements: string[]
  deadline: string
  stage: 'Nova' | 'Em análise' | 'Entrevista' | 'Finalista' | 'Concluída' | 'Encerrada'
  salary?: string
  createdAt?: string
}

export type Community = {
  id: string
  name: string
  category: string
  description: string
  members: string[]
  color: string
  post: string
}

export type Challenge = {
  id: string
  title: string
  companyId: string
  category: string
  description: string
  deadline: string
  points: number
  participants: string[]
  mode: 'Individual' | 'Coletivo'
}

export type ChallengeSubmission = {
  id: string
  challengeId: string
  userId: string
  /** Other registered student participants sharing this delivery, absent on legacy local records. */
  teamMemberIds?: string[]
  projectId: string
  title: string
  context: string
  link?: string
  submittedAt: string
  evaluation?: { feedback?: string; score?: number; evaluatedAt: string }
}

export type EventItem = {
  id: string
  title: string
  category: string
  description: string
  date: string
  time: string
  location: string
  organizerId: string
  attendees: string[]
  color: string
  promoImage?: string
}

export type Message = { id: string; authorId: string; text: string; time: string; reaction?: string }
export type Conversation = { id: string; participants: string[]; messages: Message[] }
export type Notice = { id: string; userId: string; text: string; kind: string; time: string; read: boolean }

export type DemoData = {
  currentUserId: string
  users: User[]
  projects: Project[]
  posts: Post[]
  opportunities: Opportunity[]
  communities: Community[]
  challenges: Challenge[]
  /** Student-authored challenge deliveries; absent in older localStorage payloads. */
  challengeSubmissions?: ChallengeSubmission[]
  events: EventItem[]
  conversations: Conversation[]
  notifications: Notice[]
  submittedChallenges: string[]
  favorites: string[]
  applications: string[]
  connections: string[]
  blocked: string[]
  /** Legacy setting for the active demo user. Kept so older localStorage remains readable. */
  privacy: PrivacySettings
  /** Per-profile visibility; optional while older stored payloads are migrated. */
  privacyByUser?: Record<string, PrivacySettings>
  /** Symmetric simulated connections, while `connections` remains the active-user legacy view. */
  connectionsByUser?: Record<string, string[]>
  notifyByEmail: boolean
}

export const CONTRIBUTION_POINTS = {
  authoredProject: 20,
  collaboration: 10,
  challengeDelivery: 15,
  commentedPost: 2,
} as const

export type ContributionSummary = {
  authoredProjects: number
  collaborations: number
  challengeDeliveries: number
  commentedPosts: number
  total: number
}

export type ContributionAchievement = {
  id: 'first-project' | 'real-collaboration' | 'challenge-delivery'
  title: string
  description: string
}

/** Derives contribution points only from projects and posts visible to this viewer; project posts are not counted separately. */
export function getContributionSummary(data: DemoData, userId: string, viewerId: string = userId): ContributionSummary {
  const visibleProjects = data.projects.filter((project) => canViewProject(data, viewerId, project)
    && (project.ownerId === viewerId || !data.blocked.includes(project.ownerId)))
  const visiblePosts = data.posts.filter((post) => canViewPost(data, viewerId, post)
    && (post.authorId === viewerId || !data.blocked.includes(post.authorId)))
  const authoredProjects = new Set(visibleProjects.filter((project) => project.ownerId === userId).map((project) => project.id)).size
  const collaborations = new Set(visibleProjects
    .filter((project) => project.ownerId !== userId && project.collaborators.includes(userId))
    .map((project) => project.id)).size
  const challengeDeliveries = new Set((data.challengeSubmissions ?? [])
    .filter((submission) => submission.userId === userId || submission.teamMemberIds?.includes(userId))
    .map((submission) => submission.id)).size
  const commentedPosts = new Set(visiblePosts
    .filter((post) => post.comments.some((comment) => comment.authorId === userId))
    .map((post) => post.id)).size

  return {
    authoredProjects,
    collaborations,
    challengeDeliveries,
    commentedPosts,
    total: authoredProjects * CONTRIBUTION_POINTS.authoredProject
      + collaborations * CONTRIBUTION_POINTS.collaboration
      + challengeDeliveries * CONTRIBUTION_POINTS.challengeDelivery
      + commentedPosts * CONTRIBUTION_POINTS.commentedPost,
  }
}

/** Returns earned milestones only, each backed by evidence visible to this viewer. */
export function getContributionAchievements(data: DemoData, userId: string, viewerId: string = userId): ContributionAchievement[] {
  const summary = getContributionSummary(data, userId, viewerId)
  const achievements: ContributionAchievement[] = []

  if (summary.authoredProjects > 0) achievements.push({
    id: 'first-project',
    title: 'Primeiro projeto publicado',
    description: 'Há pelo menos um projeto autoral registrado no portfólio.',
  })

  if (summary.collaborations > 0) achievements.push({
    id: 'real-collaboration',
    title: 'Colaboração registrada',
    description: 'Você aparece como colaborador em um projeto de outra pessoa.',
  })

  if (summary.challengeDeliveries > 0) achievements.push({
    id: 'challenge-delivery',
    title: 'Entrega enviada',
    description: 'Há uma entrega de desafio registrada em seu nome ou equipe.',
  })

  return achievements
}

export const STORAGE_KEY = 'vibeup-demo-v1'

export function getUserPrivacy(data: Pick<DemoData, 'currentUserId' | 'privacy' | 'privacyByUser'>, userId: string): PrivacySettings {
  const stored = data.privacyByUser?.[userId]
  if (stored) return { ...DEFAULT_PRIVACY_SETTINGS, ...stored }
  if (data.currentUserId === userId && data.privacy) return { ...DEFAULT_PRIVACY_SETTINGS, ...data.privacy }
  return { ...DEFAULT_PRIVACY_SETTINGS }
}

export function areConnected(data: Pick<DemoData, 'currentUserId' | 'connections' | 'connectionsByUser'>, firstId: string, secondId: string): boolean {
  if (firstId === secondId) return true
  if (data.connectionsByUser?.[firstId]?.includes(secondId) || data.connectionsByUser?.[secondId]?.includes(firstId)) return true
  return firstId === data.currentUserId && data.connections.includes(secondId)
}

export function canViewProfile(data: Pick<DemoData, 'currentUserId' | 'privacy' | 'privacyByUser' | 'connections' | 'connectionsByUser'>, viewerId: string, ownerId: string): boolean {
  if (viewerId === ownerId) return true
  return getUserPrivacy(data, ownerId).profilePublic || areConnected(data, viewerId, ownerId)
}

export function canViewCity(data: Pick<DemoData, 'currentUserId' | 'privacy' | 'privacyByUser' | 'connections' | 'connectionsByUser'>, viewerId: string, ownerId: string): boolean {
  if (viewerId === ownerId) return true
  return getUserPrivacy(data, ownerId).showCity && canViewProfile(data, viewerId, ownerId)
}

export function canViewContact(data: Pick<DemoData, 'currentUserId' | 'privacy' | 'privacyByUser' | 'connections' | 'connectionsByUser'>, viewerId: string, ownerId: string): boolean {
  if (viewerId === ownerId) return true
  return canViewProfile(data, viewerId, ownerId) && getUserPrivacy(data, ownerId).showContact
}

export function canViewUserSkills(data: Pick<DemoData, 'currentUserId' | 'privacy' | 'privacyByUser' | 'connections' | 'connectionsByUser'>, viewerId: string, ownerId: string): boolean {
  if (viewerId === ownerId || areConnected(data, viewerId, ownerId)) return true
  return canViewProfile(data, viewerId, ownerId) && getUserPrivacy(data, ownerId).projectsPublic
}

export function canViewProject(
  data: Pick<DemoData, 'currentUserId' | 'privacy' | 'privacyByUser' | 'connections' | 'connectionsByUser'>,
  viewerId: string,
  project: Project,
): boolean {
  if (viewerId === project.ownerId) return true
  if (!canViewProfile(data, viewerId, project.ownerId)) return false
  const connected = areConnected(data, viewerId, project.ownerId)
  const settings = getUserPrivacy(data, project.ownerId)
  const projectPrivacy = project.privacy?.trim().toLocaleLowerCase('pt-BR')
  if (projectPrivacy === 'privado') return false
  if (projectPrivacy === 'somente conexões' && !connected) return false
  if (!settings.projectsPublic && !connected) return false
  return true
}

export function canViewPost(
  data: Pick<DemoData, 'currentUserId' | 'privacy' | 'privacyByUser' | 'connections' | 'connectionsByUser'>,
  viewerId: string,
  post: Post,
): boolean {
  if (viewerId === post.authorId) return true
  if (!canViewProfile(data, viewerId, post.authorId)) return false
  const postPrivacy = post.privacy?.trim().toLocaleLowerCase('pt-BR')
  if (postPrivacy === 'privado') return false
  if (postPrivacy === 'somente conexões' && !areConnected(data, viewerId, post.authorId)) return false
  return true
}

export const tabSlug = (item: string) => item.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/[^a-z0-9]+/g, '-')

export function getCompatibility(requirements: string[], skills: string[]) {
  const normalized = (value: string) => value.trim().toLocaleLowerCase('pt-BR')
  const own = new Set(skills.map(normalized))
  const matched = requirements.filter((skill) => own.has(normalized(skill)))
  const missing = requirements.filter((skill) => !own.has(normalized(skill)))
  return { matched, missing, score: requirements.length ? Math.round((matched.length / requirements.length) * 100) : 0 }
}
