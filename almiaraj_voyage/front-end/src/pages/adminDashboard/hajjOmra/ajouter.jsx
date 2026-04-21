import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "@/api/axios";

export default function AjouterHajjOmra() {
  const [form, setForm] = useState({
    nomServ: "",
    description: "",
    prix: "",
    type: "",
    formule: "",
    dateDepartHO: "",
    dateRetourHO: "",
    duree: "",
    typeChambre: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Calculate duration when dates change
  useEffect(() => {
    if (form.dateDepartHO && form.dateRetourHO) {
      const startDate = new Date(form.dateDepartHO);
      const endDate = new Date(form.dateRetourHO);
      
      if (endDate >= startDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setForm(prev => ({ ...prev, duree: daysDiff.toString() }));
      } else {
        setForm(prev => ({ ...prev, duree: "" }));
      }
    } else {
      setForm(prev => ({ ...prev, duree: "" }));
    }
  }, [form.dateDepartHO, form.dateRetourHO]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (validTypes.includes(file.type)) {
          setForm({ ...form, image: file });
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);
        } else {
          alert('Veuillez sélectionner une image valide (JPEG, PNG, JPG, GIF)');
          e.target.value = '';
        }
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate price is positive
    if (parseFloat(form.prix) <= 0) {
      setError("Le prix doit être supérieur à 0");
      setIsSubmitting(false);
      return;
    }

    // Validate dates
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const departDate = new Date(form.dateDepartHO);
    
    if (departDate < todayDate) {
      setError("La date de départ ne peut pas être dans le passé");
      setIsSubmitting(false);
      return;
    }
    
    const retourDate = new Date(form.dateRetourHO);
    if (retourDate <= departDate) {
      setError("La date de retour doit être après la date de départ");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nomServ', form.nomServ);
      formData.append('description', form.description || '');
      formData.append('prix', form.prix);
      formData.append('type', form.type);
      formData.append('formule', form.formule);
      formData.append('dateDepartHO', form.dateDepartHO);
      formData.append('dateRetourHO', form.dateRetourHO);
      formData.append('duree', form.duree);
      formData.append('typeChambre', form.typeChambre);
      
      if (form.image) {
        formData.append('image', form.image);
      }

      const response = await axiosClient.post('/hajj-omras', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log('Success:', response.data);
      
      setForm({
        nomServ: "",
        description: "",
        prix: "",
        type: "",
        formule: "",
        dateDepartHO: "",
        dateRetourHO: "",
        duree: "",
        typeChambre: "",
        image: null,
      });
      setImagePreview(null);
      
      alert('Hajj/Omra ajouté avec succès!');
      
    } catch (error) {
      console.error('Error details:', error.response?.data);
      
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Erreur lors de l\'ajout du Hajj/Omra');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Ajouter Hajj/Omra</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom du service</label>
          <input
            type="text"
            name="nomServ"
            value={form.nomServ}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Prix (DH)</label>
          <input
            type="number"
            name="prix"
            value={form.prix}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
          />
          <small style={{ color: '#666' }}>Le prix doit être positif</small>
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez le type</option>
            <option value="Hajj">Hajj</option>
            <option value="Omra">Omra</option>
          </select>
        </div>

        <div className="form-group">
          <label>Formule</label>
          <select
            name="formule"
            value={form.formule}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez la formule</option>
            <option value="Économique">Économique</option>
            <option value="Standard">Standard</option>
            <option value="Premium">Premium</option>
            <option value="Luxe">Luxe</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date de départ</label>
          <input
            type="date"
            name="dateDepartHO"
            value={form.dateDepartHO}
            onChange={handleChange}
            required
            min={today}
          />
          <small style={{ color: '#666' }}>Les dates avant aujourd'hui sont désactivées</small>
        </div>

        <div className="form-group">
          <label>Date de retour</label>
          <input
            type="date"
            name="dateRetourHO"
            value={form.dateRetourHO}
            onChange={handleChange}
            required
            min={form.dateDepartHO || today}
            disabled={!form.dateDepartHO}
          />
          <small style={{ color: '#666' }}>
            {!form.dateDepartHO ? "Veuillez d'abord sélectionner la date de départ" : "Les dates avant la date de départ sont désactivées"}
          </small>
        </div>

        <div className="form-group">
          <label>Durée (jours)</label>
          <input
            type="number"
            name="duree"
            value={form.duree}
            readOnly
            disabled
            style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
          />
          <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
            La durée est calculée automatiquement
          </small>
        </div>

        <div className="form-group">
          <label>Type de chambre</label>
          <select
            name="typeChambre"
            value={form.typeChambre}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez le type de chambre</option>
            <option value="Simple">Simple</option>
            <option value="Double">Double</option>
            <option value="Triple">Triple</option>
            <option value="Quadruple">Quadruple</option>
            <option value="Suite">Suite</option>
          </select>
        </div>
    
        <div className="form-group">
          <label>Image</label>
          <input 
            type="file" 
            name="image" 
            onChange={handleChange}
            accept="image/jpeg,image/png,image/jpg,image/gif"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
            </div>
          )}
        </div>
        
        <div className="btns">
          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ajout en cours..." : "Ajouter"}
          </button>
          <Link to="/admin" className="cancel-btn">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}