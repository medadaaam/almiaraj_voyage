import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/layout";
import Home from "../pages/HomeSections/home";
import Contact from "../pages/HomeSections/contact";
import NotFound from "../pages/notFound";
import LayoutGuest from "@/layouts/layoutGuest";
import Login from "@/pages/auth/login";
import LayoutClient from "@/layouts/layoutClient";
import GuestRoute from "@/components/ProRoutes/GuestRoute";
import ProtectedRoute from "@/components/ProRoutes/ProtectedRoute";
import LayoutRoute from "@/components/ProRoutes/LayoutRoute";
import Register from "@/pages/auth/register";
import ResetPassword from "@/pages/auth/resetPassword";
import ForgotPassword from "@/pages/auth/forgetPassword";
import AdminLayout from "@/layouts/AdminLayout";
import AjouterHotel from "@/pages/adminDashboard/hotel/ajouter";
import Reservation from "@/pages/reservation/hotelReservation";
import AjouterVoyage from "@/pages/adminDashboard/voyage/ajouter";
import AjouterHajjOmra from "@/pages/adminDashboard/hajjOmra/ajouter";
import AjouterBillet from "@/pages/adminDashboard/billiet/ajouter";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import DestinationsPage from "@/pages/DestinationsPage";
import HajjOmra from "@/pages/services/hajjOmra";
import CircuitsTouristiques from "@/pages/services/CircuitsTouristiques";
import HotelsSejours from "@/pages/services/HotelsSejours";
import VolsBillets from "@/pages/services/VolsBillets";
import DashboardClient from "@/pages/DashboardClient";
import DestinationOffres from "@/pages/DestinationServices";
import VoyageDetails from "@/pages/VoyageDetails";
import HotelDetails from "@/pages/HotelDetails";
import BilletDetails from "@/pages/services/BilletDetails";
import HajjOmraDetails from "@/pages/services/HajjOmraDetails";

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
        path: "/destinations",
        element: <DestinationsPage />,
      },

      {
        path: "/destinations/:id/services",
        element: <DestinationOffres />,
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
        path: "/services/hajj-omra",
        element: <HajjOmra />,
      },
      {
        path: "/services/voyages",
        element: <CircuitsTouristiques />,
      }, {
        path: "/services/hotels",
        element: <HotelsSejours />,
      }, {
        path: "/services/flights",
        element: <VolsBillets />,
      },
      {
        path: "/services/hotelsReservation/{idH}",
        element: <Reservation />,
      },

      {
        path: "/voyages/:id",
        element: <VoyageDetails />,
      },
            {
        path: "/hotels/:id",
        element: <HotelDetails />,
      },

            {
        path: "/billets/:id",
        element: <BilletDetails />,
      },
                  {
        path: "/hajj-omra/:id",
        element: <HajjOmraDetails />,
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
        element: <Contact />,
      },
      {
        path: "/admin/reservations",
        element: <h1>Gestion réservations</h1>,
      },
      {
        path: "/admin/voyages",
        element: <AdminVoyages />,
      },
      {
        path: "/admin/ajouterVoyage",
        element: <AjouterVoyage />,
      },
      {
        path:"/admin/editVoyage/:id",
        element: <ModifierVoyage/>
      },
      {
        path:"/admin/showVoyage/:id",
        element: <VoyageDetails/>
      },

      {
        path: "/admin/hotels",
        element: <AdminHotels />,
      },
      {
        path: "/admin/ajouterHotel",
        element: <AjouterHotel />,
      },


      {
        path: "/admin/hajj-omra",
        element: <AdminHajjOmra />,
      },
      {
        path: "/admin/ajouterHajj-omra",
        element: <AjouterHajjOmra />,
      },


      {
        path: "/admin/billets",
        element: <AdminBillets />,
      },
      {
        path: "/admin/ajouterBillets",
        element: <AjouterBillet />,
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
        element: <DashboardClient />,
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
