import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './store/slices/authSlice';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Public pages
import HomePage from './pages/public/HomePage';
import ResearchPage from './pages/public/ResearchPage';
import ResearchDetailPage from './pages/public/ResearchDetailPage';
import LandDatasetPage from './pages/public/LandDatasetPage';
import PolicyPage from './pages/public/PolicyPage';
import CaseStudyPage from './pages/public/CaseStudyPage';
import GISMapPage from './pages/public/GISMapPage';
import AnalyticsDashboard from './pages/public/AnalyticsDashboard';
import AIAssistantPage from './pages/public/AIAssistantPage';
import InnovationPage from './pages/public/InnovationPage';
import AboutPage from './pages/public/AboutPage';
import SearchPage from './pages/public/SearchPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboards
import ResearcherDashboard from './pages/dashboards/ResearcherDashboard';
import GovernmentDashboard from './pages/dashboards/GovernmentDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import UploadResearchPage from './pages/dashboards/UploadResearchPage';
import PolicySimulationPage from './pages/dashboards/PolicySimulationPage';

// Lazy-loaded pages
const LandDatasetDetailPage    = lazy(() => import('./pages/public/LandDatasetDetailPage'));
const PolicyDetailPage         = lazy(() => import('./pages/public/PolicyDetailPage'));
const CaseStudyDetailPage      = lazy(() => import('./pages/public/CaseStudyDetailPage'));
const LandVaultPage            = lazy(() => import('./pages/public/LandVaultPage'));
const ResearchPaymentPage      = lazy(() => import('./pages/public/ResearchPaymentPage'));
const OpportunityDetails       = lazy(() => import('./pages/public/OpportunityDetails'));
const InnovationApplications   = lazy(() => import('./pages/public/InnovationApplications'));
const SavedOpportunities       = lazy(() => import('./pages/public/SavedOpportunities'));
const InnovationCollaborations = lazy(() => import('./pages/public/InnovationCollaborations'));
const InnovationCertificates   = lazy(() => import('./pages/public/InnovationCertificates'));
const ProjectsPage = lazy(() => import('./pages/dashboards/ProjectsPage'));
const MyResearchPage = lazy(() => import('./pages/dashboards/MyResearchPage'));
const MyDatasetsPage = lazy(() => import('./pages/dashboards/MyDatasetsPage'));
const UploadDatasetPage = lazy(() => import('./pages/dashboards/UploadDatasetPage'));
const AdminUsersPage = lazy(() => import('./pages/dashboards/AdminUsersPage'));
const AdminResearchPage = lazy(() => import('./pages/dashboards/AdminResearchPage'));
const AIToolsPage = lazy(() => import('./pages/dashboards/AIToolsPage'));
const ProfilePage = lazy(() => import('./pages/auth/ProfilePage'));

const SuspenseFallback = () => <LoadingSpinner fullPage text="Loading..." />;

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main public layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/research/payment" element={<ResearchPaymentPage />} />
            <Route path="/research/:id" element={<ResearchDetailPage />} />
            <Route path="/datasets" element={<LandDatasetPage />} />
            <Route path="/datasets/:type" element={<LandDatasetDetailPage />} />
            <Route path="/policies" element={<PolicyPage />} />
            <Route path="/policies/:id" element={<PolicyDetailPage />} />
            <Route path="/case-studies" element={<CaseStudyPage />} />
            <Route path="/case-studies/:id" element={<CaseStudyDetailPage />} />
            <Route path="/gis-map" element={<GISMapPage />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/innovation" element={<InnovationPage />} />
            <Route path="/innovation/opportunity/:id"  element={<OpportunityDetails />} />
            <Route path="/innovation/applications"     element={<InnovationApplications />} />
            <Route path="/innovation/saved"            element={<SavedOpportunities />} />
            <Route path="/innovation/collaborations"   element={<InnovationCollaborations />} />
            <Route path="/innovation/certificates"     element={<InnovationCertificates />} />
            <Route path="/landvault"                   element={<LandVaultPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/simulation" element={<PolicySimulationPage />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Researcher Dashboard */}
          <Route path="/researcher" element={
            <ProtectedRoute allowedRoles={['researcher', 'admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ResearcherDashboard />} />
            <Route path="upload-research" element={<UploadResearchPage />} />
            <Route path="upload-dataset" element={<UploadDatasetPage />} />
            <Route path="my-research" element={<MyResearchPage />} />
            <Route path="my-datasets" element={<MyDatasetsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="ai-tools" element={<AIToolsPage />} />
          </Route>

          {/* Government Dashboard */}
          <Route path="/government" element={
            <ProtectedRoute allowedRoles={['government', 'admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<GovernmentDashboard />} />
            <Route path="policy-performance" element={<AnalyticsDashboard />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="simulation" element={<PolicySimulationPage />} />
            <Route path="decision-support" element={<AIAssistantPage />} />
          </Route>

          {/* Admin Dashboard */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="research" element={<AdminResearchPage />} />
            <Route path="datasets" element={<MyDatasetsPage />} />
            <Route path="policies" element={<PolicyPage />} />
            <Route path="case-studies" element={<CaseStudyPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
