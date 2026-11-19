import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './Shell'
import { useVibeup, VibeProvider } from './store'
import {
  ChallengesPage, CommunitiesPage, CreatePostPage, EventsPage, ExplorePage, FeedPage,
  LoginPage, MessagesPage, NotFoundPage, NotificationsPage, OpportunitiesPage,
  ProfilePage, ReportsPage, SettingsPage,
} from './pages'
import './App.css'
import './Features.css'
import './BrandAssets.css'
import './VisualPolish.css'

function CompanyReportsRoute() {
  const { isCompany } = useVibeup()
  return isCompany ? <ReportsPage /> : <Navigate to="/feed" replace />
}

function App() {
  return <VibeProvider><BrowserRouter><Routes>
    <Route path="/login" element={<LoginPage/>}/>
    <Route element={<AppShell/>}>
      <Route index element={<Navigate to="/feed" replace/>}/>
      <Route path="feed" element={<FeedPage/>}/>
      <Route path="publicar" element={<CreatePostPage/>}/>
      <Route path="perfil" element={<ProfilePage/>}/>
      <Route path="perfil/:id" element={<ProfilePage/>}/>
      <Route path="explorar" element={<ExplorePage/>}/>
      <Route path="comunidades" element={<CommunitiesPage/>}/>
      <Route path="desafios" element={<ChallengesPage/>}/>
      <Route path="mensagens" element={<MessagesPage/>}/>
      <Route path="eventos" element={<EventsPage/>}/>
      <Route path="notificacoes" element={<NotificationsPage/>}/>
      <Route path="configuracoes" element={<SettingsPage/>}/>
      <Route path="empresas/oportunidades" element={<OpportunitiesPage/>}/>
      <Route path="relatorios" element={<CompanyReportsRoute/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Route>
  </Routes></BrowserRouter></VibeProvider>
}

export default App
