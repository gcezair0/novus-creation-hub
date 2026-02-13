import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import EducationLevels from "./pages/EducationLevels";
import News from "./pages/News";
import PostDetail from "./pages/PostDetail";
import Gallery from "./pages/Gallery";
import Videos from "./pages/Videos";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentPortal from "./pages/portal/StudentPortal";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminGrades from "./pages/admin/AdminGrades";
import AdminUsers from "./pages/admin/AdminUsers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public pages */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/ensino" element={<EducationLevels />} />
              <Route path="/noticias" element={<News />} />
              <Route path="/noticias/:id" element={<PostDetail />} />
              <Route path="/galeria" element={<Gallery />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/portal" element={<ProtectedRoute><StudentPortal /></ProtectedRoute>} />
            </Route>

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="galeria" element={<AdminGallery />} />
              <Route path="videos" element={<AdminVideos />} />
              <Route path="boletim" element={<AdminGrades />} />
              <Route path="usuarios" element={<AdminUsers />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
