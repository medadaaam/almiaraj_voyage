import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "@/api/axios";

export default function AjouterBillet() {
  const [form, setForm] = useState({
    nomServ: "",
    description: "",
    prix: "",
    typeBi: "aller_simple",
    villeDepartBi: "",
    destinationBi: "",
    dateDepartBi: "",
    dateRetourBi: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Clear date retour when type is aller_simple
  useEffect(() => {
    if (form.typeBi === "aller_simple") {
      setForm(prev => ({ ...prev, dateRetourBi: "" }));
    }
  }, [form.typeBi]);

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
    const departDate = new Date(form.dateDepartBi);
    
    if (departDate < todayDate) {
      setError("La date de départ ne peut pas être dans le passé");
      setIsSubmitting(false);
      return;
    }
    
    // Validate return date if type is aller_retour
    if (form.typeBi === "aller_retour" && form.dateRetourBi) {
      const retourDate = new Date(form.dateRetourBi);
      if (retourDate <= departDate) {
        setError("La date de retour doit être après la date de départ");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append('nomServ', form.nomServ);
      formData.append('description', form.description || '');
      formData.append('prix', form.prix);
      formData.append('typeBi', form.typeBi);
      formData.append('villeDepartBi', form.villeDepartBi);
      formData.append('destinationBi', form.destinationBi);
      formData.append('dateDepartBi', form.dateDepartBi);
      
      if (form.typeBi === "aller_retour" && form.dateRetourBi) {
        formData.append('dateRetourBi', form.dateRetourBi);
      }
      
      if (form.image) {
        formData.append('image', form.image);
      }

      const response = await axiosClient.post('/billets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log('Success:', response.data);
      
      setForm({
        nomServ: "",
        description: "",
        prix: "",
        typeBi: "aller_simple",
        villeDepartBi: "",
        destinationBi: "",
        dateDepartBi: "",
        dateRetourBi: "",
        image: null,
      });
      setImagePreview(null);
      
      alert('Billet ajouté avec succès!');
      
    } catch (error) {
      console.error('Error details:', error.response?.data);
      
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Erreur lors de l\'ajout du billet');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Ajouter un billet</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom du billet</label>
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
          <label>Type de billet</label>
          <select
            name="typeBi"
            value={form.typeBi}
            onChange={handleChange}
            required
          >
            <option value="aller_simple">Aller simple</option>
            <option value="aller_retour">Aller retour</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ville de départ</label>
          <input
            type="text"
            name="villeDepartBi"
            value={form.villeDepartBi}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Destination</label>
          <input
            type="text"
            name="destinationBi"
            value={form.destinationBi}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date de départ</label>
          <input
            type="date"
            name="dateDepartBi"
            value={form.dateDepartBi}
            onChange={handleChange}
            required
            min={today}
          />
          <small style={{ color: '#666' }}>Les dates avant aujourd'hui sont désactivées</small>
        </div>

        {form.typeBi === "aller_retour" && (
          <div className="form-group">
            <label>Date de retour</label>
            <input
              type="date"
              name="dateRetourBi"
              value={form.dateRetourBi}
              onChange={handleChange}
              required={form.typeBi === "aller_retour"}
              min={form.dateDepartBi || today}
              disabled={!form.dateDepartBi}
            />
            <small style={{ color: '#666' }}>
              {!form.dateDepartBi ? "Veuillez d'abord sélectionner la date de départ" : "Les dates avant la date de départ sont désactivées"}
            </small>
          </div>
        )}
    
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