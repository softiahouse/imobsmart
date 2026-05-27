import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import BotaoEmergencia from "./components/BotaoEmergencia";

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import NovaSenha from './pages/NovaSenha'
import AuthCallback from './pages/AuthCallback'
import AulaPage from './pages/AulaPage'
import Contrato from './pages/Contrato'
import Painel from './pages/Painel'
import ModuloEntry from './pages/ModuloEntry'
import CheckIn from './pages/modules/CheckIn'
import QuizPage from './pages/QuizPage'
import FamilyQuizPage from './pages/FamilyQuizPage'
import QuizResultPage from './pages/QuizResultPage'
import CertificadoPage from './pages/CertificadoPage'
import TermosPage from './pages/TermosPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import BlogAdminPage from './pages/BlogAdminPage'

function Layout({ children, noFooter }) {
  return (
    <>
      <Navbar />
      {children}
      {!noFooter && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout noFooter><LandingPage /></Layout>} />
          <Route path="/quiz" element={<Layout><QuizPage /></Layout>} />
          <Route path="/quiz/familias" element={<Layout><FamilyQuizPage /></Layout>} />
          <Route path="/resultado" element={<Layout><QuizResultPage /></Layout>} />
          <Route path="/entrar" element={<LoginPage />} />
          <Route path="/cadastrar" element={<RegisterPage />} />
          <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
          <Route path="/nova-senha" element={<NovaSenha />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/termos" element={<TermosPage />} />
          <Route path="/privacidade" element={<TermosPage />} />
          {/* Rotas /modulo/...: a rota com mais segmentos (/aula/:aulaId) deve vir ANTES de /modulo/:id */}
          <Route
            path="/modulo/:moduloId/aula/:aulaId"
            element={
              <ProtectedRoute>
                <AulaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contrato"
            element={
              <ProtectedRoute>
                <Contrato />
              </ProtectedRoute>
            }
          />
          <Route path="/painel" element={<ProtectedRoute><Painel /></ProtectedRoute>} />
          <Route path="/certificado" element={<CertificadoPage />} />
          <Route path="/modulo/:id" element={<ProtectedRoute><ModuloEntry /></ProtectedRoute>} />
          <Route path="/checkin" element={<ProtectedRoute><Layout><CheckIn /></Layout></ProtectedRoute>} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/blog/admin" element={<BlogAdminPage />} />
          <Route path="*" element={<Layout><div style={{ padding: '120px 24px', textAlign: 'center' }}><h2>Página não encontrada</h2></div></Layout>} />
        </Routes>
        <BotaoEmergencia modulosLiberados={[]} inline={false} />
      </AuthProvider>
    </BrowserRouter>
  )
}
