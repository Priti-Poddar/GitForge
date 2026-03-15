import React, {useEffect} from 'react';
import { useNavigate, useRoutes, useLocation } from "react-router-dom";
// Auth Context
import { useAuth } from './authContext';

// Pages List 
import Dashboard from "./components/dashboard/Dashboard";
import Profile from './components/user/Profile';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Explore from './components/explore/Explore';
import Settings from './components/user/Settings';
import CreateRepo from './components/repo/Createrepo';
import RepoDetail from './components/repo/RepoDetails';
import PublicRepoView from "./components/repo/PublicRepoView";
// Issue pages
import IssueList from './components/issue/IssueList';
import IssueDetail from './components/issue/IssueDetails';
import CreateIssue from './components/issue/CreateIssue';
import EditIssue from './components/issue/EditIssue';
 

const PUBLIC_PATHS = ["/auth", "/signup", "/explore"];

const ProjectRoutes = () => {
    const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

    useEffect(() => {
      const userIdFromStorage = localStorage.getItem("userId");

      if (userIdFromStorage && !currentUser) {
        setCurrentUser(userIdFromStorage);
      }

      const isPublic = PUBLIC_PATHS.some((p) =>
        location.pathname.startsWith(p),
      );

      if (!userIdFromStorage && !isPublic) {
        navigate("/auth");
      }

      if (userIdFromStorage && location.pathname === "/auth") {
        navigate("/");
      }
    }, [currentUser, navigate, setCurrentUser, location.pathname]);

    const element = useRoutes([
      { path: "/", element: <Dashboard /> },
      { path: "/auth", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/profile", element: <Profile /> },
      { path: "/settings", element: <Settings /> },
      { path: "/explore", element: <Explore /> },
      { path: "/search", element: <Explore /> }, // /search?q=... → same Explore page
      { path: "/repo/new", element: <CreateRepo /> },
      { path: "/repo/:id", element: <RepoDetail /> },
      { path: "/repo/:id/view", element: <PublicRepoView /> },
      // Issues — standalone (global issue list / detail)
      { path: "/issues", element: <IssueList /> },
      { path: "/issues/new", element: <CreateIssue /> },
      { path: "/issues/:id", element: <IssueDetail /> },
      { path: "/issues/:id/edit", element: <EditIssue /> },

      // Issues — scoped to a repo
      { path: "/repo/:repoId/issues", element: <IssueList /> },
      { path: "/repo/:repoId/issues/new", element: <CreateIssue /> },
    ]);
 

    return element;
}

export default ProjectRoutes;