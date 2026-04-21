// src/pages/reservation.jsx
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Users, Hotel, CreditCard, Plus, Trash2, UserPlus, IdCard, ChevronDown, ChevronRight, CheckCircle, Edit } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { LOGIN_ROUTE } from "@/router";
import { axiosClient } from "@/api/axios";

// Schéma pour un passager individuel
const passagerSchema = z.object({
  nom: z.string().min(2, "Nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Prénom doit contenir au moins 2 caractères"),
  cin: z.string().min(6, "CIN doit contenir au moins 6 caractères").max(20, "CIN trop long"),
  nationalite: z.string().optional(), // Make nationalite optional
});

// Schéma principal pour la réservation
const formSchema = z.object({
  nom: z.string().min(2, "Nom doit contenir au moins 2 caractères").max(50),
  prenom: z.string().min(2, "Prénom doit contenir au moins 2 caractères").max(50),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(10, "Téléphone invalide").max(15),
  cin: z.string().min(6, "CIN doit contenir au moins 6 caractères").max(20, "CIN trop long"),
  checkIn: z.string().min(1, "Date d'arrivée requise"),
  checkOut: z.string().min(1, "Date de départ requise"),
  typeChambre: z.string().min(1, "Veuillez sélectionner un type de chambre"),
  passagers: z.array(passagerSchema),
  demandesSpeciales: z.string().optional(),
  terms: z.literal(true, {
    errorMap: () => ({
      message: "Vous devez accepter les conditions de réservation",
    }),
  }),
}).refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
  message: "La date de départ doit être postérieure à la date d'arrivée",
  path: ["checkOut"],
});

export default function Reservation() {
    const { authenticated } = useAuth();
    const navigate = useNavigate();
    useEffect(()=>{
      if (!authenticated){
      navigate(LOGIN_ROUTE);
    };
    },[authenticated]);
    
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedPassagers, setExpandedPassagers] = useState({});
  const [confirmedPassagers, setConfirmedPassagers] = useState({});
  const { user } = useAuth();
  const location = useLocation();
  
  const hotelId = location.state?.hotelId || new URLSearchParams(location.search).get('hotelId');
  const hotelData = location.state?.hotelData || null;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: user?.nom || "",
      prenom: user?.prenom || "",
      email: user?.email || "",
      telephone: user?.telephone || "",
      cin: user?.cin || "",
      checkIn: "",
      checkOut: "",
      typeChambre: "",
      passagers: [],
      demandesSpeciales: "",
      terms: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "passagers",
  });

  const typesChambre = [
    { value: "single", label: "Single (1 personne)", prix: 800, maxPersonnes: 1 },
    { value: "double", label: "Double (2 personnes)", prix: 1200, maxPersonnes: 2 },
    { value: "suite", label: "Suite (4 personnes)", prix: 2000, maxPersonnes: 4 },
    { value: "family", label: "Familiale (6 personnes)", prix: 2500, maxPersonnes: 6 },
  ];

  const countries = [
    { value: "ma", label: "Maroc 🇲🇦" },
    { value: "fr", label: "France 🇫🇷" },
    { value: "es", label: "Espagne 🇪🇸" },
    { value: "it", label: "Italie 🇮🇹" },
    { value: "de", label: "Allemagne 🇩🇪" },
    { value: "us", label: "États-Unis 🇺🇸" },
    { value: "uk", label: "Royaume-Uni 🇬🇧" },
    { value: "ca", label: "Canada 🇨🇦" },
    { value: "tn", label: "Tunisie 🇹🇳" },
    { value: "dz", label: "Algérie 🇩🇿" },
  ];

  const watchCheckIn = form.watch("checkIn");
  const watchCheckOut = form.watch("checkOut");
  const watchTypeChambre = form.watch("typeChambre");

  const calculerPrixTotal = () => {
    if (watchCheckIn && watchCheckOut && watchTypeChambre) {
      const checkInDate = new Date(watchCheckIn);
      const checkOutDate = new Date(watchCheckOut);
      const nuits = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const chambre = typesChambre.find(c => c.value === watchTypeChambre);
      if (chambre && nuits > 0) {
        return chambre.prix * nuits;
      }
    }
    return 0;
  };

  const isNombrePassagersValide = () => {
    const chambre = typesChambre.find(c => c.value === watchTypeChambre);
    if (chambre && fields.length > 0) {
      return fields.length <= chambre.maxPersonnes;
    }
    return true;
  };

  const ajouterPassager = () => {
    const newIndex = fields.length;
    append({
      nom: "",
      prenom: "",
      cin: "",
      nationalite: "",
    });
    // Auto-expand the new passager
    setExpandedPassagers({ ...expandedPassagers, [newIndex]: true });
    setConfirmedPassagers({ ...confirmedPassagers, [newIndex]: false });
  };

  const supprimerPassager = (index) => {
    remove(index);
    // Clean up states
    const newExpanded = { ...expandedPassagers };
    const newConfirmed = { ...confirmedPassagers };
    delete newExpanded[index];
    delete newConfirmed[index];
    // Re-index remaining passagers
    const reindexedExpanded = {};
    const reindexedConfirmed = {};
    Object.keys(newExpanded).forEach(key => {
      if (parseInt(key) > index) {
        reindexedExpanded[parseInt(key) - 1] = newExpanded[key];
      } else if (parseInt(key) < index) {
        reindexedExpanded[key] = newExpanded[key];
      }
    });
    Object.keys(newConfirmed).forEach(key => {
      if (parseInt(key) > index) {
        reindexedConfirmed[parseInt(key) - 1] = newConfirmed[key];
      } else if (parseInt(key) < index) {
        reindexedConfirmed[key] = newConfirmed[key];
      }
    });
    setExpandedPassagers(reindexedExpanded);
    setConfirmedPassagers(reindexedConfirmed);
  };

  const togglePassager = (index) => {
    if (confirmedPassagers[index]) {
      // If confirmed, allow editing
      setConfirmedPassagers({ ...confirmedPassagers, [index]: false });
      setExpandedPassagers({ ...expandedPassagers, [index]: true });
    } else {
      setExpandedPassagers({ 
        ...expandedPassagers, 
        [index]: !expandedPassagers[index] 
      });
    }
  };

  const confirmPassager = async (index) => {
    // Validate the specific passager fields
    const passagerData = form.getValues(`passagers.${index}`);
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
      return `${passager.prenom} ${passager.nom}`;
    }
    return "Informations incomplètes";
  };

  const onSubmit = async (values) => {
    setLoading(true);
    setError("");

    // Check if all passagers are confirmed
    const allConfirmed = fields.every((_, index) => confirmedPassagers[index]);
    if (!allConfirmed) {
        setError("Veuillez confirmer tous les passagers avant de continuer");
        setLoading(false);
        return;
    }

    if (!isNombrePassagersValide()) {
        const chambre = typesChambre.find(c => c.value === watchTypeChambre);
        setError(`Le type de chambre sélectionné ne peut accueillir que ${chambre.maxPersonnes} personne(s). Vous avez ajouté ${fields.length} passager(s).`);
        setLoading(false);
        return;
    }

    try {
        const reservationData = {
            hotel_id: parseInt(hotelId), // Ensure it's a number
            client_principal: {
                nom: values.nom,
                prenom: values.prenom,
                email: values.email,
                telephone: values.telephone,
                cin: values.cin,
                nationalite: values.nationalite,
            },
            reservation: {
                check_in: values.checkIn,
                check_out: values.checkOut,
                type_chambre: values.typeChambre,
                nombre_passagers: values.passagers.length,
                prix_total: calculerPrixTotal(),
                demandes_speciales: values.demandesSpeciales || "",
            },
            passagers: values.passagers.map(p => ({
                nom: p.nom,
                prenom: p.prenom,
                cin: p.cin,
                nationalite: p.nationalite || null
            })),
        };

        const response = await axiosClient.post('/reservations', reservationData );

        if (response.status === 201 || response.status === 200) {
            navigate("/reservation-confirmation", { 
                state: { 
                    reservation: reservationData, 
                    hotel: hotelData,
                    reservationId: response.data.reservation.id
                }
            });
        }
        
    } catch (err) {
        console.error("Erreur:", err);
        
        if (err.response?.status === 401) {
            setError("Vous devez être connecté pour effectuer une réservation");
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate(LOGIN_ROUTE);
            }, 2000);
        } else if (err.response?.status === 422) {
            const errors = err.response.data.errors;
            
            // Handle validation errors
            if (errors['client_principal.nom']) {
                form.setError("nom", { message: errors['client_principal.nom'][0] });
            }
            if (errors['client_principal.prenom']) {
                form.setError("prenom", { message: errors['client_principal.prenom'][0] });
            }
            if (errors['client_principal.email']) {
                form.setError("email", { message: errors['client_principal.email'][0] });
            }
            if (errors['client_principal.telephone']) {
                form.setError("telephone", { message: errors['client_principal.telephone'][0] });
            }
            if (errors['client_principal.cin']) {
                form.setError("cin", { message: errors['client_principal.cin'][0] });
            }
            if (errors['reservation.check_in']) {
                form.setError("checkIn", { message: errors['reservation.check_in'][0] });
            }
            if (errors['reservation.check_out']) {
                form.setError("checkOut", { message: errors['reservation.check_out'][0] });
            }
            if (errors['reservation.type_chambre']) {
                form.setError("typeChambre", { message: errors['reservation.type_chambre'][0] });
            }
            if (errors.passagers) {
                setError("Veuillez vérifier les informations des passagers");
            }
            
            if (Object.keys(errors).length === 0) {
                setError(err.response.data.message || "Données incorrectes");
            }
        } else {
            setError(err.response?.data?.message || "Une erreur s'est produite");
        }
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-2">Réservation d'hôtel</h2>
      {hotelData && (
        <p className="text-center text-gray-600 mb-6">{hotelData.nom}</p>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {/* Section: Informations du client principal */}
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
                    <FormLabel>Prénom <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Votre prénom" {...field} />
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
                    <FormLabel>Nom <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Votre nom" {...field} />
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
                    <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="exemple@email.com" {...field} />
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
                    <FormLabel>Téléphone <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="0612345678" {...field} />
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
                      Numéro CIN <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Ex: AB123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Détails du séjour */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Hotel className="w-5 h-5" />
              Détails du séjour
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'arrivée <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de départ <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        min={watchCheckIn || new Date().toISOString().split('T')[0]}
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
                name="typeChambre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de chambre <span className="text-red-500">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir le type de chambre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typesChambre.map((chambre) => (
                          <SelectItem key={chambre.value} value={chambre.value}>
                            {chambre.label} - {chambre.prix} DH/nuit (Max: {chambre.maxPersonnes} pers)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section: Informations des passagers */}
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
                <p className="text-sm text-gray-400">Cliquez sur "Ajouter un passager" pour commencer</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg overflow-hidden">
                      {/* Passager Header (always visible) */}
                      <div 
                        className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          confirmedPassagers[index] ? 'bg-green-50' : 'bg-white'
                        }`}
                        onClick={() => togglePassager(index)}
                      >
                        <div className="flex items-center gap-3">
                          {expandedPassagers[index] ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                          <div>
                            <h4 className="font-medium">
                              Passager {index + 1}
                              {confirmedPassagers[index] && (
                                <CheckCircle className="w-4 h-4 text-green-500 inline ml-2" />
                              )}
                            </h4>
                            {confirmedPassagers[index] && (
                              <p className="text-sm text-gray-600">
                                {getPassagerSummary(index)}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            supprimerPassager(index);
                          }}
                          className="text-red-500 hover:text-red-700 bg-transparent hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Passager Form (expandable) */}
                      {expandedPassagers[index] && (
                        <div className="p-4 border-t bg-gray-50">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`passagers.${index}.prenom`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Prénom <span className="text-red-500">*</span></FormLabel>
                                  <FormControl>
                                    <Input placeholder="Prénom du passager" {...field} />
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
                                  <FormLabel>Nom <span className="text-red-500">*</span></FormLabel>
                                  <FormControl>
                                    <Input placeholder="Nom du passager" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="mt-4">
                            <FormField
                              control={form.control}
                              name={`passagers.${index}.cin`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    <IdCard className="w-4 h-4" />
                                    Numéro CIN <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="Numéro CIN" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            {confirmedPassagers[index] ? (
                              <Button
                                type="button"
                                onClick={() => editPassager(index)}
                                variant="outline"
                                className="flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" />
                                Modifier
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                onClick={() => confirmPassager(index)}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Confirmer le passager
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {watchTypeChambre && fields.length > 0 && (
                  <div className={`mt-4 p-3 rounded-md ${isNombrePassagersValide() ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {isNombrePassagersValide() ? (
                      <p className="text-sm">✓ {fields.length} passager(s) pour une chambre {typesChambre.find(c => c.value === watchTypeChambre)?.label}</p>
                    ) : (
                      <p className="text-sm">⚠️ La chambre {typesChambre.find(c => c.value === watchTypeChambre)?.label} ne peut accueillir que {typesChambre.find(c => c.value === watchTypeChambre)?.maxPersonnes} personne(s). Vous avez ajouté {fields.length} passager(s).</p>
                    )}
                  </div>
                )}

                {/* Show warning if not all passagers are confirmed */}
                {fields.length > 0 && !fields.every((_, index) => confirmedPassagers[index]) && (
                  <div className="mt-4 p-3 rounded-md bg-yellow-50 text-yellow-700">
                    <p className="text-sm">⚠️ Veuillez confirmer tous les passagers avant de continuer</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Section: Options supplémentaires */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Options supplémentaires
            </h3>
            
            <FormField
              control={form.control}
              name="demandesSpeciales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demandes spéciales</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="w-full border rounded-md p-2 min-h-[100px]"
                      placeholder="Régime alimentaire, besoins spécifiques, etc..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section: Récapitulatif et prix */}
          {(watchCheckIn && watchCheckOut && watchTypeChambre) && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-lg">Récapitulatif de la réservation</h3>
              <div className="space-y-2 text-sm">
                <p>📅 Nuits: <strong>{Math.ceil((new Date(watchCheckOut) - new Date(watchCheckIn)) / (1000 * 60 * 60 * 24))}</strong> nuits</p>
                <p>👥 Nombre total de passagers: <strong>{fields.length}</strong></p>
                <p>🏨 Type de chambre: <strong>{typesChambre.find(c => c.value === watchTypeChambre)?.label}</strong></p>
                <p className="text-lg font-bold mt-2">💰 Prix total: <span className="text-green-600">{calculerPrixTotal()} DH</span></p>
              </div>
            </div>
          )}

          {/* Section: Conditions */}
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
                      className="w-4 h-4 border border-gray-300 rounded"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium">
                    J'accepte les{" "}
                    <a href="/conditions" className="text-blue-600 hover:underline">
                      conditions de réservation
                    </a>
                  </FormLabel>
                </div>
                <FieldDescription>
                  En cochant cette case, vous acceptez nos conditions générales de vente et d'annulation.
                </FieldDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2f6f85] hover:bg-[#25596b] text-white font-semibold py-3"
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Réservation en cours...
              </>
            ) : (
              "Confirmer la réservation"
            )}
          </Button>
        </form>
      </Form>
      
      <p className="mt-6 text-sm/6 text-center">
        <span className="text-gray-600">
          Une question ?{" "}
        </span>
        <Link
          to="/contact"
          className="font-semibold hover:text-orange-700 text-orange-500"
        >
          Contactez-nous
        </Link>
      </p>
    </div>
  );
}