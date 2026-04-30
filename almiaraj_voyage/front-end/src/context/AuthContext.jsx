// AuthContext.jsx
import AuthApi from "@/services/Api/AuthApi";
import { createContext, useContext, useState, useEffect } from "react";

const stateContext = createContext({
    user: null,
    clientProfile: null,
    authenticated: false,
    allDestinations: [],
    destinations: [],
    voyages: [],
    hotels: [],
    billets: [],
    hajjOmras: [],
    hotelsMeta: {},
    voyagesMeta: {},
    destinationsMeta: {},
    setUser: () => { },
    getClientProfile: () => { },
    updateClientProfile: () => { },
    logout: () => { },
    getDestination: () => { },
    getAllDestinations: () => { },
    getVoyages: () => { },
    getHotels: () => { },
    getBillets: () => { },
    getHajjOmras: () => { },
    setAuthenticated: () => { },
    login: (email, password) => { },
    register: (data) => { },
    createVoyageReservation: (data) => { },
    getMyReservations: () => { },
    getReservationDetails: (id) => { },
    cancelReservation: (id) => { },
    getDestinationServices: (id) => { },
    getHotelDetails: (id) => { },
    getBilletsDetails: (id) => { },
    getVoyageDetails: (id) => { },
    getHajjOmraDetails: (id) => { },
    createHotelReservation: (data) => {},
    loading: true,
    initialLoading: true,
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [destinations, setDestination] = useState([]);
    const [allDestinations, setAllDestination] = useState([]);
    const [voyages, setVoyage] = useState([]);
    const [hajjOmras, setHajjOmras] = useState([]);
    const [clientProfile, setClientProfile] = useState(null);
    const [billets, setBillets] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const createHotelReservation = async (data) => {
    try {
        const response = await AuthApi.createHotelReservation(data);
        return response.data;
    } catch (error) {
        console.error("Error creating hotel reservation:", error);
        throw error;
    }
};

    // ✅ Meta data for pagination
    const [hotelsMeta, setHotelsMeta] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });
    const [voyagesMeta, setVoyagesMeta] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });
    const [destinationsMeta, setDestinationsMeta] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await AuthApi.getUser();
                if (data) {
                    setUser(data);
                    setAuthenticated(true);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    setAuthenticated(false);
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // ✅ جلب البيانات الأساسية فقط أولاً
    useEffect(() => {
        const fetchAllData = async () => {
            if (loading) return;
            setInitialLoading(true);
            await Promise.all([getDestination(), getVoyages(), getHotels()]);
            setInitialLoading(false);
        };
        fetchAllData();
    }, [loading]);

    const login = async (email, password) => {
        try {
            await AuthApi.getCsrfToken();
            const response = await AuthApi.login(email, password);
            if (response.status === 200 || response.status === 204) {
                const userResponse = await AuthApi.getUser();
                setUser(userResponse.data);
                setAuthenticated(true);
            }
            return response;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (data) => {
        try {
            await AuthApi.getCsrfToken();
            const response = await AuthApi.register(data);
            if (
                response.status === 200 ||
                response.status === 201 ||
                response.status === 204
            ) {
                const userResponse = await AuthApi.getUser();
                setUser(userResponse.data);
                setAuthenticated(true);
            }
            return response;
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        }
    };

    const updateClientProfile = async (data) => {
        try {
            const response = await AuthApi.updateClientProfile(data);
            console.log("Update response:", response.data);
            if (response.status === 200 && response.data) {
                return response.data;
            }
        } catch (error) {
            console.error("Error updating client profile:", error);
            throw error;
        }
    };

    const getClientProfile = async () => {
        try {
            const response = await AuthApi.getClientProfile();
            console.log("Client profile response:", response.data);
            if (response.status === 200 && response.data) {
                setClientProfile(response.data);
                return response.data;
            }
        } catch (error) {
            console.error("Error fetching client profile:", error);
            return null;
        }
    };

    // ✅ Destination avec Pagination
    const getDestination = async (page = 1) => {
        try {
            const response = await AuthApi.getDestination(page);
            if (response.status === 200) {
                if (response.data?.destinations) {
                    setDestination(response.data.destinations);
                    setDestinationsMeta({
                        current_page: response.data.current_page || 1,
                        last_page: response.data.last_page || 1,
                        total: response.data.total || 0,
                    });
                } else if (response.data?.data) {
                    setDestination(response.data.data);
                    setDestinationsMeta({
                        current_page: response.data.current_page || 1,
                        last_page: response.data.last_page || 1,
                        total: response.data.total || 0,
                    });
                } else if (Array.isArray(response.data)) {
                    setDestination(response.data);
                }
            }
            return response;
        } catch (error) {
            console.error("Recuperation error:", error);
            throw error;
        }
    };

    // ✅ ADMIN destination
    const getAllDestinations = async () => {
        try {
            const response = await AuthApi.getAllDestination();
            if (response.status === 200) {
                if (response.data?.data) {
                    setAllDestination(response.data.data);
                }
                else if (Array.isArray(response.data)) {
                    setAllDestination(response.data);
                }
            }
            return response;
        } catch (error) {
            console.error("Admin destinations error:", error);
            throw error;
        }
    };

    // ✅ Voyages avec Pagination
    const getVoyages = async (page = 1) => {
        try {
            const response = await AuthApi.getVoyages(page);
            if (response.status === 200) {
                if (response.data?.data) {
                    setVoyage(response.data.data);
                    setVoyagesMeta({
                        current_page: response.data.current_page || 1,
                        last_page: response.data.last_page || 1,
                        total: response.data.total || 0,
                    });
                } else if (Array.isArray(response.data)) {
                    setVoyage(response.data);
                }
            }
            return response;
        } catch (error) {
            console.error("Recuperation error:", error);
            throw error;
        }
    };

    // ✅ Hotels avec Pagination
    const getHotels = async (page = 1) => {
        try {
            const response = await AuthApi.getHotels(page);
            if (response.status === 200) {
                if (page === 1) {
                    setHotels([]);
                }
                if (response.data?.data) {
                    setHotels((prev) => [...prev, ...response.data.data]);
                    setHotelsMeta({
                        current_page: response.data.current_page || 1,
                        last_page: response.data.last_page || 1,
                        total: response.data.total || 0,
                    });
                } else if (Array.isArray(response.data)) {
                    setHotels((prev) => [...prev, ...response.data]);
                }
            }
            return response;
        } catch (error) {
            console.error("Recuperation error:", error);
            throw error;
        }
    };

    // ✅ Billets avec Pagination
    const getBillets = async (page = 1) => {
        try {
            const response = await AuthApi.getBillets(page);
            if (response.status === 200) {
                if (response.data?.data) {
                    setBillets(response.data.data);
                } else if (Array.isArray(response.data)) {
                    setBillets(response.data);
                }
            }
            return response;
        } catch (error) {
            console.error("Recuperation error:", error);
            throw error;
        }
    };

    // ✅ Hajj Omras avec Pagination
    const getHajjOmras = async (page = 1) => {
        try {
            const response = await AuthApi.getOmraHajj(page);
            if (response.status === 200) {
                if (response.data?.data) {
                    setHajjOmras(response.data.data);
                } else if (Array.isArray(response.data)) {
                    setHajjOmras(response.data);
                }
            }
            return response;
        } catch (error) {
            console.error("Recuperation error:", error);
            throw error;
        }
    };

    const getDestinationServices = async (id) => {
        try {
            console.log("Fetching services for destination:", id);
            const response = await AuthApi.getDestinationServices(id);
            return response.data;
        } catch (error) {
            console.error("Error fetching services:", error);
            return null;
        }
    };

    const getHotelDetails = async (id) => {
        try {
            const response = await AuthApi.getHotelDetails(id);
            return response.data;
        } catch (error) {
            console.error("Error fetching hotel details:", error);
            return null;
        }
    };

    const getHajjOmraDetails = async (id) => {
        try {
            const response = await AuthApi.getOmraHajjDetails(id);
            return response.data;
        } catch (error) {
            console.error("Error fetching hajj/omra details:", error);
            return null;
        }
    };

    const getBilletsDetails = async (id) => {
        try {
            const response = await AuthApi.getBilletsDetails(id);
            return response.data;
        } catch (error) {
            console.error("Error fetching billet details:", error);
            return null;
        }
    };

    const getVoyageDetails = async (id) => {
        try {
            const response = await AuthApi.getVoyageDetails(id);
            return response.data;
        } catch (error) {
            console.error("Error fetching voyage details:", error);
            return null;
        }
    };

    const logout = async () => {
        try {
            await AuthApi.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setAuthenticated(false);
            setUser(null);
            setDestination([]);
            setVoyage([]);
            setHotels([]);
            setBillets([]);
            setHajjOmras([]);
        }
    };

    const createVoyageReservation = async (data) => {
        try {
            const response = await AuthApi.createVoyageReservation(data);
            return response.data;
        } catch (error) {
            console.error("Error creating reservation:", error);
            throw error;
        }
    };

    const getMyReservations = async () => {
        try {
            const response = await AuthApi.getMyReservations();
            return response.data;
        } catch (error) {
            console.error("Error fetching reservations:", error);
            return null;
        }
    };

    const getReservationDetails = async (id) => {
        try {
            const response = await AuthApi.getReservationDetails(id);
            return response.data;
        } catch (error) {
            console.error("Error fetching reservation details:", error);
            return null;
        }
    };

    const cancelReservation = async (id) => {
        try {
            const response = await AuthApi.cancelReservation(id);
            return response.data;
        } catch (error) {
            console.error("Error cancelling reservation:", error);
            throw error;
        }
    };

    return (
        <stateContext.Provider
            value={{
                user,
                clientProfile,
                getClientProfile,
                login,
                setUser,
                authenticated,
                setAuthenticated,
                logout,
                register,
                loading,
                updateClientProfile,
                initialLoading,
                getDestination,
                getAllDestinations,
                allDestinations,
                destinations,
                destinationsMeta,
                getVoyages,
                voyages,
                voyagesMeta,
                hotels,
                createHotelReservation,
                hotelsMeta,
                billets,
                hajjOmras,
                getHotels,
                getBillets,
                getHajjOmras,
                getDestinationServices,
                getVoyageDetails,
                getHotelDetails,
                getBilletsDetails,
                getHajjOmraDetails,
                createVoyageReservation,
                getMyReservations,
                cancelReservation,
                getReservationDetails,
            }}
        >
            {children}
        </stateContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(stateContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};