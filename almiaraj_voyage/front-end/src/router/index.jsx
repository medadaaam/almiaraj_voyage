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
import DashboardClient from "@/pages/clientPages/DashboardClient";
import DestinationOffres from "@/pages/DestinationServices";
import VoyageDetailsCl from "@/pages/VoyageDetails";
import HotelDetailsCl from "@/pages/HotelDetails";
import BilletDetailsCl from "@/pages/services/BilletDetails";
import HajjOmraDetailsCl from "@/pages/services/HajjOmraDetails";
import AdminVoyages from "@/pages/adminDashboard/voyage";
import AdminHotels from "@/pages/adminDashboard/hotel";
import AdminHajjOmra from "@/pages/adminDashboard/hajjOmra";
import AdminBillets from "@/pages/adminDashboard/billiet";
import ClientProfile from "@/pages/clientPages/ClientProfile";
import VoyageReservation from "@/pages/reservation/VoyageReservation";
import ClientOrders from "@/pages/clientPages/MesCommandes";
import ModifierVoyage from "@/pages/adminDashboard/voyage/modifier";
import VoyageDetails from "@/pages/adminDashboard/voyage/details";
import ModifierHotel from "@/pages/adminDashboard/hotel/modifier";
import HotelDetails from "@/pages/adminDashboard/hotel/details";
import ModifierHajjOmra from "@/pages/adminDashboard/hajjOmra/modifier";
import HajjOmraDetails from "@/pages/adminDashboard/hajjOmra/details";
import BilletDetails from "@/pages/adminDashboard/billiet/details";
import ModifierBillet from "@/pages/adminDashboard/billiet/modifier";
import HotelReservation from "@/pages/reservation/hotelReservation";
import BilletReservation from "@/pages/reservation/BilletReservation";
import HajjOmraDetailsRes from "@/pages/reservation/HajjOmraReservation";
import ReservationDetails from "@/pages/reservation/ReservationDetails";
import MessageDetails from "@/pages/clientPages/MessageDetails";

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
        path: "/services/circuits",
        element: <CircuitsTouristiques />,
      },
      {
        path: "/services/hotels",
        element: <HotelsSejours />,
      },
      {
        path: "/services/flights",
        element: <VolsBillets />,
      },
      {
        path: "/services/hotelsReservation/:idH",
        element: <Reservation />,
      },
      {
        path: "/reserver/voyage/:id",
        element: <VoyageReservation />,
      },

      {
        path: "/voyages/:id",
        element: <VoyageDetailsCl />,
      },
      {
        path: "/hotels/:id",
        element: <HotelDetailsCl />,
      },

      {
        path: "/billets/:id",
        element: <BilletDetailsCl />,
      },
      {
        path: "/hajj-omra/:id",
        element: <HajjOmraDetailsCl />,
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
        path: "/admin/editVoyage/:id",
        element: <ModifierVoyage />,
      },
      {
        path: "/admin/showVoyage/:id",
        element: <VoyageDetails />,
        path: "/admin/editVoyage/:id",
        element: <ModifierVoyage />,
      },
      {
        path: "/admin/showVoyage/:id",
        element: <VoyageDetails />,
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
        path: "/admin/editHotel/:id",
        element: <ModifierHotel />,
      },
      {
        path: "/admin/showHotel/:id",
        element: <HotelDetails />,
      },

      {
        path: "/admin/hajj-omras",
        element: <AdminHajjOmra />,
      },
      {
        path: "/admin/ajouterHajj-omra",
        element: <AjouterHajjOmra />,
      },
      {
        path: "/admin/editHajj-omra/:id",
        element: <ModifierHajjOmra />,
      },
      {
        path: "/admin/showHajj-omra/:id",
        element: <HajjOmraDetails />,
      },

      {
        path: "/admin/billets",
        element: <AdminBillets />,
      },
      {
        path: "/admin/ajouterBillet",
        element: <AjouterBillet />,
      },
      {
        path: "/admin/editBillet/:id",
        element: <ModifierBillet />,
      },
      {
        path: "/admin/showBillet/:id",
        element: <BilletDetails />,
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
        path: "/voyages/:id/reserver",
        element: <VoyageReservation />,
      },
      {
        path: "/hotels/:id/reserver",
        element: <HotelReservation />,
      },
      {
        path: "/billets/:id/reserver",
        element: <BilletReservation />,
      },
            {
        path: "/client/reservations/:id",
        element: <ReservationDetails  />,
      },
      {
        path: "/hajj-omra/:id/reserver",
        element: <HajjOmraDetailsRes />,
      },
      {
        path: "/client/orders",
        element: <ClientOrders />,
      },
      {
        path: "/client/messages/:id",
        element: <MessageDetails  />,
      },
    ],
  },
]);
