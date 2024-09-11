import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Notifications from "../pages/Notifications";
import Messaging from "../pages/Messaging";
import Admin from "../pages/Admin";
import Network from "../pages/Network";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import Jobs from "../pages/Jobs";
import ViewProfile from "../pages/ViewProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <ProtectedRoute element={Home} allowedRoles={["ROLE_USER"]} />,
  },
  {
    path: "/network",
    element: <ProtectedRoute element={Network} allowedRoles={["ROLE_USER"]} />,
  },
  {
    path: "/jobs",
    element: <ProtectedRoute element={Jobs} allowedRoles={["ROLE_USER"]} />,
  },
  {
    path: "/profile",
    element: <ProtectedRoute element={Profile} allowedRoles={["ROLE_USER"]} />,
  },
  {
    path: "/settings",
    element: <ProtectedRoute element={Settings} allowedRoles={["ROLE_USER"]} />,
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute element={Notifications} allowedRoles={["ROLE_USER"]} />
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <ProtectedRoute
        element={ViewProfile}
        allowedRoles={["ROLE_USER", "ROLE_ADMIN"]}
      />
    ),
  },
  {
    path: "/messaging",
    element: (
      <ProtectedRoute element={Messaging} allowedRoles={["ROLE_USER"]} />
    ),
  },
  {
    path: "/admin",
    element: <ProtectedRoute element={Admin} allowedRoles={["ROLE_ADMIN"]} />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
]);
