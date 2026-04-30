// src/pages/reservations/VoyageReservation.jsx
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
  Plane,
  Calendar,
  MapPin,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { LOGIN_ROUTE } from "@/router";

// Schéma pour un passager individuel
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

// Schéma principal
const formSchema = z.object({
  nom: z.string().min(2, "Nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(10, "Téléphone invalide"),
  cin: z
    .string()
    .min(6, "CIN doit contenir au moins 6 caractères")
    .max(10, "CIN trop long"),
  passagers: z.array(z.any()),
  terms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions",
  }),
});

export default function VoyageReservation() {
  const { id } = useParams();
  const {
    authenticated,
    user,
    getClientProfile,
    updateClientProfile,
    clientProfile,
    createVoyageReservation,
    getVoyageDetails,
    checkReservationLimits, // ✅ Ajouté
    reservationLimits, // ✅ Ajouté
  } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedPassagers, setExpandedPassagers] = useState({});
  const [confirmedPassagers, setConfirmedPassagers] = useState({});
  const [clientLoaded, setClientLoaded] = useState(false);
  const [voyage, setVoyage] = useState(null);
  const [loadingVoyage, setLoadingVoyage] = useState(true);
  const [passagerTypes, setPassagerTypes] = useState({});
  const [limitsChecked, setLimitsChecked] = useState(false);
  const [showLimitsWarning, setShowLimitsWarning] = useState(false);

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

  // Charger le voyage
  useEffect(() => {
    const fetchVoyage = async () => {
      setLoadingVoyage(true);
      try {
        const voyageData = await getVoyageDetails(id);
        setVoyage(voyageData);
      } catch (err) {
        console.error("Error fetching voyage:", err);
        setError("Erreur lors du chargement du voyage");
      } finally {
        setLoadingVoyage(false);
      }
    };
    fetchVoyage();
  }, [id, getVoyageDetails]);

  // Charger le profil client
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
      passagers: [],
      terms: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "passagers",
  });

  // Remplir les champs avec les données du client
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

  // Rediriger si non authentifié
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

  const calculerPrixTotal = () => {
    if (voyage?.service?.prix) {
      return voyage.service.prix * (fields.length + 1);
    }
    return 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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

    // ✅ pas besoin de vérifier allConfirmed si pas de passagers
    if (fields.length > 0) {
      const allConfirmed = fields.every(
        (_, index) => confirmedPassagers[index],
      );
      if (!allConfirmed) {
        setError("Veuillez confirmer tous les passagers avant de continuer");
        setLoading(false);
        return;
      }

      // Validation: les adultes doivent avoir CIN
      for (let i = 0; i < values.passagers.length; i++) {
        const p = values.passagers[i];
        if (p.type_passager === "adulte" && (!p.cin || p.cin.length < 6)) {
          setError(`Le passager ${i + 1} (adulte) doit avoir un CIN valide`);
          setLoading(false);
          return;
        }
      }
    }

    // Mettre à jour le profil client
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
          nb_personnes: fields.length + 1,
          prix_total: calculerPrixTotal(),
          prix_unitaire: voyage?.service?.prix,
          date_depart: voyage?.dateDepartV,
          date_retour: voyage?.dateRetourV,
        },
        passagers: values.passagers,
      };

      console.log("Reservation data sent:", reservationData);

      const reservationResponse =
        await createVoyageReservation(reservationData);

      if (reservationResponse?.success) {
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
        setError(reservationResponse?.message || "Une erreur s'est produite");
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
      <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-lg">
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
    );
  }

  if (loadingVoyage || !clientLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-orange-500" size={40} />
        <p className="ml-3 text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!voyage) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Voyage non trouvé</h2>
        <Link to="/services/circuits" className="text-orange-500">
          Retour aux circuits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      {/* ✅ Avertissement limites */}
      {showLimitsWarning && reservationLimits.can_reserve && (
        <div className="mb-6 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <div className="flex items-center gap-2 text-yellow-700">
            <AlertCircle size={18} />
            <span className="text-sm">
              ⚠️ Attention : Il vous reste {reservationLimits.remaining_today} réservation(s) possible(s) aujourd'hui
              et {reservationLimits.remaining_pending} réservation(s) en attente possible(s).
            </span>
          </div>
        </div>
      )}

      {/* Carte du voyage */}
      <div className="bg-gradient-to-r from-[#2f6f85] to-[#1e4a5f] rounded-2xl p-6 text-white mb-8">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Plane size={20} />
              <span className="text-sm opacity-80">Voyage organisé</span>
              {voyage.service?.enVedette === 1 && (
                <span className="bg-yellow-500 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star size={12} className="fill-white" /> Populaire
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {voyage.service?.nomServ}
            </h1>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin size={16} />
              <span>
                {voyage.destination?.nom}, {voyage.destination?.pays}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80 mb-1">À partir de</div>
            <div className="text-3xl font-bold">{voyage.service?.prix} DH</div>
            <div className="text-sm opacity-80">/personne</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <Calendar size={18} className="opacity-70" />
            <div>
              <div className="text-xs opacity-70">Dates</div>
              <div className="text-sm font-medium">
                {formatDate(voyage.dateDepartV)} →{" "}
                {formatDate(voyage.dateRetourV)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users size={18} className="opacity-70" />
            <div>
              <div className="text-xs opacity-70">Groupe</div>
              <div className="text-sm font-medium">
                {voyage.groupSize || 20} personnes max
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-2">
        Réservation de voyage
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {/* Informations du client principal */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Informations du client principal
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        disabled
                        className="bg-gray-100"
                      />
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
                      <Input
                        type="text"
                        {...field}
                        disabled
                        className="bg-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled
                        className="bg-gray-100"
                      />
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
                      <Input
                        type="tel"
                        {...field}
                        disabled
                        className="bg-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4">
              <FormField
                control={form.control}
                name="cin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IdCard className="w-4 h-4" />
                      CIN
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ex: AB1234567"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Informations des passagers */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Informations des passagers
              </h3>
              <Button
                type="button"
                onClick={ajouterPassager}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un passager
              </Button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                <UserPlus className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Aucun passager ajouté</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div
                        className={`flex justify-between items-center p-4 cursor-pointer ${confirmedPassagers[index] ? "bg-green-50" : "bg-white"}`}
                        onClick={() => togglePassager(index)}
                      >
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">
                            Passager {index + 1}
                            {confirmedPassagers[index] && (
                              <CheckCircle className="w-4 h-4 text-green-500 inline ml-2" />
                            )}
                          </h4>
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
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {expandedPassagers[index] && (
                        <div className="p-4 border-t bg-gray-50">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
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
                                        className="w-full p-2 border rounded"
                                      >
                                        <option value="adulte">
                                          👤 Adulte
                                        </option>
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
                            </div>
                            <div>
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
                            </div>
                            <div>
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

                            {/* CIN : seulement pour adulte */}
                            {passagerTypes[index] === "adulte" && (
                              <div>
                                <FormField
                                  control={form.control}
                                  name={`passagers.${index}.cin`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center gap-2">
                                        <IdCard className="w-4 h-4" />
                                        CIN{" "}
                                        <span className="text-red-500">*</span>
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
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
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
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Confirmer
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {fields.length > 0 &&
                  !fields.every((_, index) => confirmedPassagers[index]) && (
                    <div className="mt-4 p-3 rounded-md bg-yellow-50 text-yellow-700">
                      <p className="text-sm">
                        ⚠️ Veuillez confirmer tous les passagers
                      </p>
                    </div>
                  )}
              </>
            )}
          </div>
          {/* Prix total */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                Prix total ({fields.length + 1} personne(s))
              </span>
              <span className="text-2xl font-bold text-green-600">
                {calculerPrixTotal()} DH
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {voyage.service?.prix} DH x {fields.length + 1} personne(s)
            </div>
          </div>

          {/* Conditions */}
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </FormControl>
                  <FormLabel className="text-sm">
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
            className="w-full bg-[#2f6f85] hover:bg-[#25596b] text-white py-3"
          >
            {loading ? (
              <Loader className="animate-spin mr-2" />
            ) : (
              "Confirmer la réservation"
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm">
        <Link to="/contact" className="text-orange-500 hover:underline">
          Contactez-nous
        </Link>
      </p>
    </div>
  );
}
