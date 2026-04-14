import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/layout";
import Home from "../pages/home";
import Contact from "../pages/contact";
import About from "../pages/about";
import NotFound from "../pages/notFound";
import LayoutGuest from "@/layouts/layoutGuest";
import Login from "@/pages/login";
import LayoutClient from "@/layouts/layoutClient";
import GuestRoute from "@/components/ProRoutes/GuestRoute";
import ProtectedRoute from "@/components/ProRoutes/ProtectedRoute";
import LayoutRoute from "@/components/ProRoutes/LayoutRoute";
import Register from "@/pages/register";
import ResetPassword from "@/pages/resetPassword";
import ForgotPassword from "@/pages/forgetPassword";
import { Hotel } from "@/pages/services/hotel";

export const LOGIN_ROUTE = "/login";

export const route = createBrowserRouter([
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/password-reset/:token",
    element: <ResetPassword />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    element: (
      <LayoutRoute>
        <Layout />
      </LayoutRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/services",
        element: <Hotel/>
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
  {
    element: (
      <GuestRoute>
        <LayoutGuest />
      </GuestRoute>
    ),
    children: [
      {
        path: LOGIN_ROUTE,
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <LayoutClient />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/client/dashboard",
        element: <h1>dashboard client </h1>,
      },
      {
        path: "/client/profile",
        element: <h1>Client Profile</h1>,
      },
      {
        path: "/client/orders",
        element: <h1>My Orders</h1>,
      },
    ],
  },
]);
