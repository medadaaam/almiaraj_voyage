import { useState } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "@/api/axios";

export default function AjouterVoyage() {
  const [form, setForm] = useState({
    nomServ: "",
    description: "",
    prix: "",
    destinationV: "",
    dateDepartV: "",
    dateRetourV: "",
    programme: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

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
    const departDate = new Date(form.dateDepartV);
    
    if (departDate < todayDate) {
      setError("La date de départ ne peut pas être dans le passé");
      setIsSubmitting(false);
      return;
    }
    
    const retourDate = new Date(form.dateRetourV);
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
      formData.append('destinationV', form.destinationV);
      formData.append('dateDepartV', form.dateDepartV);
      formData.append('dateRetourV', form.dateRetourV);
      formData.append('programme', form.programme);
      
      if (form.image) {
        formData.append('image', form.image);
      }

      const response = await axiosClient.post('/voyages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log('Success:', response.data);
      
      setForm({
        nomServ: "",
        description: "",
        prix: "",
        destinationV: "",
        dateDepartV: "",
        dateRetourV: "",
        programme: "",
        image: null,
      });
      setImagePreview(null);
      
      alert('Voyage ajouté avec succès!');
      
    } catch (error) {
      console.error('Error details:', error.response?.data);
      
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Erreur lors de l\'ajout du voyage');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Ajouter un voyage</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom du voyage</label>
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
          <label>Destination</label>
          <input
            type="text"
            name="destinationV"
            value={form.destinationV}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date de départ</label>
          <input
            type="date"
            name="dateDepartV"
            value={form.dateDepartV}
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
            name="dateRetourV"
            value={form.dateRetourV}
            onChange={handleChange}
            required
            min={form.dateDepartV || today}
            disabled={!form.dateDepartV}
          />
          <small style={{ color: '#666' }}>
            {!form.dateDepartV ? "Veuillez d'abord sélectionner la date de départ" : "Les dates avant la date de départ sont désactivées"}
          </small>
        </div>

        <div className="form-group">
          <label>Programme</label>
          <textarea
            name="programme"
            value={form.programme}
            onChange={handleChange}
            rows="6"
            required
          />
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