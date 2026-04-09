import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import DashboardPage from "@/pages/dashboard";
import ProposalsPage from "@/pages/proposals/index";
import ProposalDetailPage from "@/pages/proposals/detail";
import NewProposalPage from "@/pages/proposals/new";
import OrganizationsPage from "@/pages/organizations/index";
import ProjectsPage from "@/pages/projects/index";
import CofundingPage from "@/pages/cofunding/index";
import NotificationsPage from "@/pages/notifications";
import AuditPage from "@/pages/audit";
import UsersPage from "@/pages/users";
import LeaderboardPage from "@/pages/leaderboard";
import SustainabilityPage from "@/pages/sustainability";
import ProfileKYCPage from "@/pages/profile-kyc";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30,
    },
  },
});

const NO_LAYOUT_PATHS = ["/login", "/register"];

function AppRouter() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/proposals/new" component={NewProposalPage} />
            <Route path="/proposals/:id" component={ProposalDetailPage} />
            <Route path="/proposals" component={ProposalsPage} />
            <Route path="/organizations" component={OrganizationsPage} />
            <Route path="/projects" component={ProjectsPage} />
            <Route path="/cofunding" component={CofundingPage} />
            <Route path="/notifications" component={NotificationsPage} />
            <Route path="/leaderboard" component={LeaderboardPage} />
            <Route path="/sustainability" component={SustainabilityPage} />
            <Route path="/profile/kyc" component={ProfileKYCPage} />
            <Route path="/audit" component={AuditPage} />
            <Route path="/users" component={UsersPage} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRouter />
          </WouterRouter>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
