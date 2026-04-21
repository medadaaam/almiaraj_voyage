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
import Hotels from "@/pages/services/hotels";
import AdminLayout from "@/layouts/AdminLayout";
import AjouterHotel from "@/pages/adminDashboard/hotel/ajouter";
import Reservation from "@/pages/hotelReservation";
import AjouterVoyage from "@/pages/adminDashboard/voyage/ajouter";
import AjouterHajjOmra from "@/pages/adminDashboard/hajjOmra/ajouter";
import AjouterBillet from "@/pages/adminDashboard/billiet/ajouter";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";

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
        element: <Hotels />
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
       {
        path: "/services/reservation",
        element: <Reservation />,
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
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/admin",
        element: <h1>Dashboard Admin</h1>,
      },
      {
        path: "/admin/users",
        element: <Contact />
      },
      {
        path: "/admin/reservations",
        element: <h1>Gestion réservations</h1>,
      },
      {
        path: "/admin/voyages",
        element: <AjouterVoyage/>,
      },
      {
        path: "/admin/hotels",
        element: <AjouterHotel />,
      },
      {
        path: "/admin/hajj-omra",
        element: <AjouterHajjOmra/>
      },
      {
        path: "/admin/billets",
        element: <AjouterBillet/>
      },
    ],
  },
  {
    element: (
      <ProtectedRoute role="user">
        <LayoutClient />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/client",
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
