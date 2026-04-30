// src/pages/reservations/HotelReservation.jsx
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader,
  Users,
  Plus,
  Trash2,
  UserPlus,
  IdCard,
  CheckCircle,
  Edit,
  Hotel,
  Calendar,
  MapPin,
  Star,
  Loader2,
  Phone,
  Mail,
  MessageCircle,
  CreditCard,
  Shield,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { LOGIN_ROUTE } from "@/router";
import "./hotelReservation.css";

const getPassagerSchema = (type_passager) => {
  let baseSchema = {
    nom: z.string().min(2, "Nom doit contenir au moins 2 caractères"),
    prenom: z.string().min(2, "Prénom doit contenir au moins 2 caractères"),
    type_passager: z.enum(["adulte", "enfant", "nourrisson"]),
  };

  if (type_passager === "adulte") {
    baseSchema.cin = z
      .string()
      .min(6, "CIN doit contenir au moins 6 caractères")
      .max(20, "CIN trop long");
  } else {
    baseSchema.cin = z.string().optional();
  }

  return z.object(baseSchema);
};

const formSchema = z
  .object({
    nom: z.string().min(2, "Nom doit contenir au moins 2 caractères"),
    prenom: z.string().min(2, "Prénom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    telephone: z.string().min(10, "Téléphone invalide"),
    cin: z.string().optional(),
    check_in: z.string().min(1, "Date d'arrivée requise"),
    check_out: z.string().min(1, "Date de départ requise"),
    type_chambre: z.string().min(1, "Veuillez sélectionner un type de chambre"),
    passagers: z.array(z.any()),
    demandesSpeciales: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les conditions",
    }),
  })
  .refine((data) => new Date(data.check_out) > new Date(data.check_in), {
    message: "La date de départ doit être postérieure à la date d'arrivée",
    path: ["check_out"],
  });

export default function HotelReservation() {
  const { id } = useParams();
  const {
    authenticated,
    user,
    getClientProfile,
    updateClientProfile,
    clientProfile,
    getHotelDetails,
    createHotelReservation,
    checkReservationLimits, // ✅ Ajouté
    reservationLimits, // ✅ Ajouté
  } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedPassagers, setExpandedPassagers] = useState({});
  const [confirmedPassagers, setConfirmedPassagers] = useState({});
  const [clientLoaded, setClientLoaded] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [loadingHotel, setLoadingHotel] = useState(true);
  const [passagerTypes, setPassagerTypes] = useState({});
  const [typesChambre, setTypesChambre] = useState([]);
  const [limitsChecked, setLimitsChecked] = useState(false);
  const [showLimitsWarning, setShowLimitsWarning] = useState(false);

  const fetchedHotelRef = useRef(false);
  const fetchedClientRef = useRef(false);

  // ✅ Vérifier les limites de réservation au chargement
  useEffect(() => {
    const checkLimits = async () => {
      if (authenticated && !limitsChecked) {
        await checkReservationLimits();
        setLimitsChecked(true);

        // Afficher un avertissement si les limites sont proches
        if (reservationLimits.remaining_today <= 1 || reservationLimits.remaining_pending <= 1) {
          setShowLimitsWarning(true);
        }
      }
    };
    checkLimits();
  }, [authenticated, limitsChecked, checkReservationLimits, reservationLimits]);

  useEffect(() => {
    const fetchHotel = async () => {
      if (fetchedHotelRef.current) return;
      fetchedHotelRef.current = true;
      setLoadingHotel(true);
      try {
        const hotelData = await getHotelDetails(id);
        if (hotelData && hotelData.id) {
          setHotel(hotelData);
          if (hotelData.chambre_types && hotelData.chambre_types.length > 0) {
            setTypesChambre(hotelData.chambre_types);
          }
        } else {
          setError("Hôtel non trouvé");
        }
      } catch (err) {
        console.error("Error fetching hotel:", err);
        setError("Erreur lors du chargement de l'hôtel");
      } finally {
        setLoadingHotel(false);
      }
    };
    if (id) {
      fetchHotel();
    } else {
      setLoadingHotel(false);
      setError("ID de l'hôtel manquant");
    }
  }, [id, getHotelDetails]);

  useEffect(() => {
    const loadClient = async () => {
      if (fetchedClientRef.current) return;
      fetchedClientRef.current = true;
      try {
        await getClientProfile();
      } catch (err) {
        console.error("Error loading client:", err);
      } finally {
        setClientLoaded(true);
      }
    };
    loadClient();
  }, [getClientProfile]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      cin: "",
      check_in: "",
      check_out: "",
      type_chambre: "",
      passagers: [],
      demandesSpeciales: "",
      terms: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "passagers",
  });

  const watchCheckIn = form.watch("check_in");
  const watchCheckOut = form.watch("check_out");
  const watchTypeChambre = form.watch("type_chambre");

  useEffect(() => {
    if (clientLoaded && clientProfile?.client) {
      form.setValue("nom", clientProfile.client.nomCl || "");
      form.setValue("prenom", clientProfile.client.prenomCl || "");
      form.setValue("email", clientProfile.client.email || user?.email || "");
      form.setValue("telephone", clientProfile.client.numTelCl || "");
      form.setValue("cin", clientProfile.client.cin || "");
    } else if (user && clientLoaded) {
      const nameParts = user.name?.split(" ") || [];
      form.setValue("nom", nameParts[0] || "");
      form.setValue("prenom", nameParts.slice(1).join(" ") || "");
      form.setValue("email", user.email || "");
    }
  }, [clientProfile, clientLoaded, user, form]);

  useEffect(() => {
    if (!authenticated && !loading) {
      navigate(LOGIN_ROUTE);
    }
  }, [authenticated, loading, navigate]);

  // ✅ Vérification des limites avant soumission
  const canProceedWithReservation = () => {
    if (!reservationLimits.can_reserve) {
      setError(reservationLimits.message || "Vous ne pouvez pas faire de nouvelle réservation pour le moment");
      return false;
    }

    if (reservationLimits.remaining_today <= 0) {
      setError(`Vous avez atteint la limite de ${reservationLimits.max_per_day} réservations par jour. Veuillez réessayer demain.`);
      return false;
    }

    if (reservationLimits.remaining_pending <= 0) {
      setError(`Vous avez trop de réservations en attente (${reservationLimits.pending_count}/${reservationLimits.max_pending}). Veuillez finaliser ou annuler certaines réservations.`);
      return false;
    }

    return true;
  };

  const calculerNuits = () => {
    if (watchCheckIn && watchCheckOut) {
      const start = new Date(watchCheckIn);
      const end = new Date(watchCheckOut);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculerPrixTotal = () => {
    const chambre = typesChambre.find((c) => c.value === watchTypeChambre);
    const nuits = calculerNuits();
    if (chambre && nuits > 0) {
      return chambre.prix * nuits;
    }
    return 0;
  };

  const isNombrePassagersValide = () => {
    const chambre = typesChambre.find((c) => c.value === watchTypeChambre);
    if (chambre && fields.length > 0) {
      return fields.length <= (chambre.max_personnes || chambre.maxPersonnes);
    }
    return true;
  };

  const ajouterPassager = () => {
    const newIndex = fields.length;
    const defaultType = "adulte";
    setPassagerTypes((prev) => ({ ...prev, [newIndex]: defaultType }));

    append({
      nom: "",
      prenom: "",
      cin: "",
      type_passager: defaultType,
    });

    setExpandedPassagers({ ...expandedPassagers, [newIndex]: true });
    setConfirmedPassagers({ ...confirmedPassagers, [newIndex]: false });
  };

  const supprimerPassager = (index) => {
    remove(index);
    const newExpanded = { ...expandedPassagers };
    const newConfirmed = { ...confirmedPassagers };
    const newTypes = { ...passagerTypes };
    delete newExpanded[index];
    delete newConfirmed[index];
    delete newTypes[index];

    const reindexedExpanded = {};
    const reindexedConfirmed = {};
    const reindexedTypes = {};
    Object.keys(newExpanded).forEach((key) => {
      const numKey = parseInt(key);
      if (numKey > index) reindexedExpanded[numKey - 1] = newExpanded[key];
      else if (numKey < index) reindexedExpanded[key] = newExpanded[key];
    });
    Object.keys(newConfirmed).forEach((key) => {
      const numKey = parseInt(key);
      if (numKey > index) reindexedConfirmed[numKey - 1] = newConfirmed[key];
      else if (numKey < index) reindexedConfirmed[key] = newConfirmed[key];
    });
    Object.keys(newTypes).forEach((key) => {
      const numKey = parseInt(key);
      if (numKey > index) reindexedTypes[numKey - 1] = newTypes[key];
      else if (numKey < index) reindexedTypes[key] = newTypes[key];
    });

    setExpandedPassagers(reindexedExpanded);
    setConfirmedPassagers(reindexedConfirmed);
    setPassagerTypes(reindexedTypes);
  };

  const updatePassagerType = (index, value) => {
    setPassagerTypes((prev) => ({ ...prev, [index]: value }));
    form.setValue(`passagers.${index}.type_passager`, value);
    if (value !== "adulte") {
      form.setValue(`passagers.${index}.cin`, "");
    }
  };

  const togglePassager = (index) => {
    if (confirmedPassagers[index]) {
      setConfirmedPassagers({ ...confirmedPassagers, [index]: false });
      setExpandedPassagers({ ...expandedPassagers, [index]: true });
    } else {
      setExpandedPassagers({
        ...expandedPassagers,
        [index]: !expandedPassagers[index],
      });
    }
  };

  const confirmPassager = async (index) => {
    const isValid = await form.trigger(`passagers.${index}`);
    if (isValid) {
      setConfirmedPassagers({ ...confirmedPassagers, [index]: true });
      setExpandedPassagers({ ...expandedPassagers, [index]: false });
    }
  };

  const editPassager = (index) => {
    setConfirmedPassagers({ ...confirmedPassagers, [index]: false });
    setExpandedPassagers({ ...expandedPassagers, [index]: true });
  };

  const getPassagerSummary = (index) => {
    const passager = form.getValues(`passagers.${index}`);
    if (passager && passager.prenom && passager.nom) {
      const type =
        passager.type_passager === "adulte"
          ? "👤 Adulte"
          : passager.type_passager === "enfant"
            ? "🧒 Enfant"
            : "🍼 Nourrisson";
      return `${passager.prenom} ${passager.nom} (${type})`;
    }
    return "Informations incomplètes";
  };

  const onSubmit = async (values) => {
    setLoading(true);
    setError("");

    // ✅ Vérifier les limites de réservation avant tout
    if (!canProceedWithReservation()) {
      setLoading(false);
      return;
    }

    // Rafraîchir les limites pour être sûr
    const freshLimits = await checkReservationLimits();
    if (!freshLimits?.allowed) {
      setError(freshLimits?.message || "Vous ne pouvez pas faire cette réservation pour le moment");
      setLoading(false);
      return;
    }

    if (!values.check_in || !values.check_out) {
      setError("Veuillez sélectionner les dates d'arrivée et de départ");
      setLoading(false);
      return;
    }

    const start = new Date(values.check_in);
    const end = new Date(values.check_out);
    if (isNaN(start) || isNaN(end)) {
      setError("Dates invalides");
      setLoading(false);
      return;
    }

    const allConfirmed = fields.every((_, index) => confirmedPassagers[index]);
    if (!allConfirmed && fields.length > 0) {
      setError("Veuillez confirmer tous les passagers avant de continuer");
      setLoading(false);
      return;
    }

    if (!isNombrePassagersValide()) {
      const chambre = typesChambre.find((c) => c.value === watchTypeChambre);
      setError(
        `Le type de chambre sélectionné ne peut accueillir que ${chambre?.max_personnes || chambre?.maxPersonnes} personne(s).`,
      );
      setLoading(false);
      return;
    }

    for (let i = 0; i < values.passagers.length; i++) {
      const p = values.passagers[i];
      if (p.type_passager === "adulte" && (!p.cin || p.cin.length < 6)) {
        setError(`Le passager ${i + 1} (adulte) doit avoir un CIN valide`);
        setLoading(false);
        return;
      }
    }

    try {
      await updateClientProfile({
        nomCl: values.nom,
        prenomCl: values.prenom,
        email: values.email,
        numTelCl: values.telephone,
        cin: values.cin,
      });
      await getClientProfile();
    } catch (updateErr) {
      console.warn("Profile update failed:", updateErr);
    }

    try {
      const startDate = new Date(values.check_in);
      const endDate = new Date(values.check_out);
      const nuits = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const chambre = typesChambre.find((c) => c.value === values.type_chambre);
      const prixUnitaire = chambre ? chambre.prix : 0;
      const prixTotal = prixUnitaire * nuits;

      const reservationData = {
        service_id: parseInt(id),
        client_principal: {
          nom: values.nom,
          prenom: values.prenom,
          email: values.email,
          telephone: values.telephone,
          cin: values.cin,
        },
        reservation: {
          check_in: values.check_in,
          check_out: values.check_out,
          type_chambre: values.type_chambre,
          nb_personnes: fields.length + 1,
          prix_total: prixTotal,
          prix_unitaire: prixUnitaire,
          demandes_speciales: values.demandesSpeciales || "",
        },
        passagers: values.passagers,
      };

      const response = await createHotelReservation(reservationData);

      if (response?.success) {
        // ✅ Rafraîchir les limites après réservation réussie
        await checkReservationLimits();

        navigate("/client/orders", {
          state: {
            message:
              "✅ Votre réservation a été envoyée avec succès ! Notre équipe la traitera dans les plus brefs délais et vous contactera pour confirmation.",
            type: "success",
          },
        });
      } else {
        setError(response?.message || "Une erreur s'est produite");
      }
    } catch (err) {
      console.error("Reservation error:", err);
      // ✅ Gérer l'erreur de limite depuis le backend
      if (err.response?.status === 429) {
        setError(err.response?.data?.message || "Limite de réservations atteinte");
        await checkReservationLimits(); // Rafraîchir les limites
      } else {
        setError(err.response?.data?.message || "Une erreur s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Afficher un message d'avertissement si les limites sont atteintes
  if (!reservationLimits.can_reserve && limitsChecked && authenticated) {
    return (
      <div className="hotel-reservation-page">
        <div className="hotel-reservation-container">
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-6 py-6 rounded-lg text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-yellow-500" />
            <h2 className="text-xl font-bold mb-2">Limite de réservations atteinte</h2>
            <p className="mb-4">{reservationLimits.message || "Vous avez atteint la limite de réservations autorisées."}</p>
            <div className="bg-white rounded-lg p-4 mb-4 text-left">
              <p className="font-semibold mb-2">📊 Vos limites actuelles :</p>
              <ul className="space-y-1 text-sm">
                <li>📅 Réservations aujourd'hui : {reservationLimits.used_today} / {reservationLimits.max_per_day}</li>
                <li>⏳ Réservations en attente : {reservationLimits.pending_count} / {reservationLimits.max_pending}</li>
              </ul>
            </div>
            <Link to="/client" className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
              Retour au dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loadingHotel || !clientLoaded) {
    return (
      <div className="hotel-reservation-loading">
        <div className="hotel-reservation-loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error && !hotel) {
    return (
      <div className="hotel-reservation-error">
        <div className="error-icon">🏨</div>
        <h2>Erreur</h2>
        <p>{error}</p>
        <Link to="/services/hotels">Retour aux hôtels</Link>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="hotel-reservation-error">
        <div className="error-icon">🏨</div>
        <h2>Hôtel non trouvé</h2>
        <Link to="/services/hotels">Retour aux hôtels</Link>
      </div>
    );
  }

  return (
    <div className="hotel-reservation-page">
      <div className="hotel-reservation-container">
        {/* Hotel Card */}
        <div className="hotel-reservation-card">
          <div className="hotel-reservation-header">
            <div className="hotel-reservation-type">
              <Hotel size={20} />
              <span>Hôtel</span>
              {hotel.service?.enVedette === 1 && (
                <span className="hotel-reservation-badge">
                  <Star size={12} />
                  Populaire
                </span>
              )}
            </div>
            <div className="hotel-reservation-price">
              <span className="price-label">À partir de</span>
              <span className="price-value">{hotel.service?.prix} DH</span>
              <span className="price-period">/nuit</span>
            </div>
          </div>

          <h1 className="hotel-reservation-title">{hotel.service?.nomServ}</h1>

          <div className="hotel-reservation-location">
            <MapPin size={16} />
            <span>{hotel.villeHotel}</span>
          </div>

          <div className="hotel-reservation-rating">
            <Star size={14} />
            <span>{hotel.service?.rating} / 5</span>
          </div>
        </div>

        {/* Form */}
        <div className="hotel-reservation-form-container">
          {/* ✅ Avertissement limites */}
          {showLimitsWarning && reservationLimits.can_reserve && (
            <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="flex items-center gap-2 text-yellow-700">
                <AlertCircle size={18} />
                <span className="text-sm">
                  ⚠️ Attention : Il vous reste {reservationLimits.remaining_today} réservation(s) possible(s) aujourd'hui
                  et {reservationLimits.remaining_pending} réservation(s) en attente possible(s).
                </span>
              </div>
            </div>
          )}

          <h2 className="hotel-reservation-form-title">Réservation d'hôtel</h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="hotel-reservation-form"
            >
              {error && (
                <div className="hotel-reservation-error-message">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Client Principal */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <Users size={18} />
                  Informations du client principal
                </h3>
                <div className="form-grid-2">
                  <FormField
                    control={form.control}
                    name="prenom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input {...field} disabled className="bg-gray-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input {...field} disabled className="bg-gray-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="form-grid-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled className="bg-gray-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input {...field} disabled className="bg-gray-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="cin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IdCard size={14} /> CIN
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: AB1234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Détails du séjour */}
              <div className="form-section">
                <h3 className="form-section-title">
                  <Calendar size={18} />
                  Détails du séjour
                </h3>
                <div className="form-grid-2">
                  <FormField
                    control={form.control}
                    name="check_in"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check In *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="check_out"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Check Out *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            min={
                              watchCheckIn ||
                              new Date().toISOString().split("T")[0]
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="type_chambre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de chambre *</FormLabel>
                      <FormControl>
                        <select {...field} className="hotel-reservation-select">
                          <option value="">
                            Sélectionner un type de chambre
                          </option>
                          {typesChambre.map((chambre) => (
                            <option key={chambre.value} value={chambre.value}>
                              {chambre.label} - {chambre.prix} DH/nuit (Max:{" "}
                              {chambre.max_personnes || chambre.maxPersonnes}{" "}
                              pers)
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Passagers */}
              <div className="form-section">
                <div className="form-section-header">
                  <h3 className="form-section-title">
                    <UserPlus size={18} />
                    Informations des passagers
                  </h3>
                  <Button
                    type="button"
                    onClick={ajouterPassager}
                    variant="outline"
                    className="add-passenger-btn"
                    disabled={!reservationLimits.can_reserve}
                  >
                    <Plus size={14} />
                    Ajouter un passager
                  </Button>
                </div>

                {fields.length === 0 ? (
                  <div className="empty-passengers">
                    <UserPlus size={48} />
                    <p>Aucun passager ajouté</p>
                    <span>
                      Cliquez sur "Ajouter un passager" pour ajouter des enfants
                    </span>
                  </div>
                ) : (
                  <div className="passengers-list">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className={`passenger-item ${confirmedPassagers[index] ? "confirmed" : ""}`}
                      >
                        <div
                          className="passenger-header"
                          onClick={() => togglePassager(index)}
                        >
                          <div className="passenger-header-left">
                            <h4>Passager {index + 1}</h4>
                            {confirmedPassagers[index] && (
                              <CheckCircle size={16} className="check-icon" />
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              supprimerPassager(index);
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>

                        {expandedPassagers[index] && (
                          <div className="passenger-form">
                            <FormField
                              control={form.control}
                              name={`passagers.${index}.type_passager`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Type de passager</FormLabel>
                                  <FormControl>
                                    <select
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        updatePassagerType(
                                          index,
                                          e.target.value,
                                        );
                                      }}
                                      className="passenger-type-select"
                                    >
                                      <option value="adulte">👤 Adulte</option>
                                      <option value="enfant">
                                        🧒 Enfant (2-12 ans)
                                      </option>
                                      <option value="nourrisson">
                                        🍼 Nourrisson (-2 ans)
                                      </option>
                                    </select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="form-grid-2">
                              <FormField
                                control={form.control}
                                name={`passagers.${index}.prenom`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Prénom *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Prénom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`passagers.${index}.nom`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nom *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Nom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            {passagerTypes[index] === "adulte" && (
                              <FormField
                                control={form.control}
                                name={`passagers.${index}.cin`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                      <IdCard size={14} /> CIN *
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="AA123456"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                            <div className="passenger-actions">
                              {confirmedPassagers[index] ? (
                                <Button
                                  type="button"
                                  onClick={() => editPassager(index)}
                                  variant="outline"
                                >
                                  Modifier
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  onClick={() => confirmPassager(index)}
                                  className="confirm-btn"
                                >
                                  Confirmer
                                </Button>
                              )}
                            </div>
                          </div>
                        )}

                        {confirmedPassagers[index] &&
                          !expandedPassagers[index] && (
                            <div className="passenger-summary">
                              <span>{getPassagerSummary(index)}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => editPassager(index)}
                              >
                                Modifier
                              </Button>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}

                {watchTypeChambre && fields.length > 0 && (
                  <div
                    className={`capacity-warning ${isNombrePassagersValide() ? "valid" : "invalid"}`}
                  >
                    {isNombrePassagersValide() ? (
                      <span>
                        ✓ {fields.length} passager(s) pour cette chambre
                      </span>
                    ) : (
                      <span>
                        ⚠️ La chambre ne peut accueillir que{" "}
                        {typesChambre.find((c) => c.value === watchTypeChambre)
                          ?.max_personnes ||
                          typesChambre.find((c) => c.value === watchTypeChambre)
                            ?.maxPersonnes}{" "}
                        personne(s).
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Prix total */}
              {watchCheckIn && watchCheckOut && watchTypeChambre && (
                <div className="price-summary">
                  <div className="price-summary-row">
                    <span>
                      Prix total ({calculerNuits()} nuit(s), {fields.length + 1}{" "}
                      personne(s))
                    </span>
                    <span className="price-summary-value">
                      {calculerPrixTotal()} DH
                    </span>
                  </div>
                  <div className="price-summary-detail">
                    {
                      typesChambre.find((c) => c.value === watchTypeChambre)
                        ?.prix
                    }{" "}
                    DH × {calculerNuits()} nuits
                  </div>
                </div>
              )}

              {/* Terms */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="terms-item">
                    <div className="terms-checkbox">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <FormLabel>
                        J'accepte les conditions de réservation
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading || !reservationLimits.can_reserve}
                className="submit-btn"
              >
                {loading ? (
                  <Loader className="animate-spin" />
                ) : (
                  <CreditCard size={18} />
                )}
                {loading
                  ? "Réservation en cours..."
                  : "Confirmer la réservation"}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm">
            <Link to="/contact" className="text-orange-500 hover:underline">
              Contactez-nous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
