import { useState } from "react";
import "./ajouter.css";
import { Link } from "react-router-dom";
import { axiosClient } from "@/api/axios";

export default function AjouterHotel() {
  const [form, setForm] = useState({
    nomServ: "",
    description: "",
    prix: "",
    villeHotel: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

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

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('nomServ', form.nomServ);
      formData.append('description', form.description || '');
      formData.append('prix', form.prix);
      formData.append('villeHotel', form.villeHotel);
      
      // Only append image if it exists
      if (form.image) {
        formData.append('image', form.image);
      }

      // Log the form data for debugging
      console.log('Sending form data:');
      for (let pair of formData.entries()) {
        if (pair[0] === 'image') {
          console.log(pair[0] + ': ' + pair[1].name);
        } else {
          console.log(pair[0] + ': ' + pair[1]);
        }
      }

      const response = await axiosClient.post('/hotels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log('Success:', response.data);
      
      // Reset form after successful submission
      setForm({
        nomServ: "",
        description: "",
        prix: "",
        villeHotel: "",
        image: null,
      });
      setImagePreview(null);
      
      alert('Hôtel ajouté avec succès!');
      
    } catch (error) {
      console.error('Error details:', error.response?.data);
      
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Erreur lors de l\'ajout de l\'hôtel');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Ajouter un hotel</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom de l'hotel</label>
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
          <label>Prix par nuit (DH)</label>
          <input
            type="number"
            name="prix"
            value={form.prix}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ville</label>
          <input
            type="text"
            name="villeHotel"
            value={form.villeHotel}
            onChange={handleChange}
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