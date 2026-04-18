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
    typeChambre: "",
    image: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        setForm({ ...form, image: file });
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create FormData object
    const formData = new FormData();

    // Append all form fields - using the correct variable names from your form state
    formData.append('nomServ', form.nomServ);
    formData.append('description', form.description);
    formData.append('prix', form.prix);
    formData.append('villeHotel', form.villeHotel);
    formData.append('typeChambre', form.typeChambre);
    
    // Append the image file if it exists
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      const response = await axiosClient.post('/hotels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Success:', response.data);
      
      // Reset form after successful submission
      setForm({
        nomServ: "",
        description: "",
        prix: "",
        villeHotel: "",
        typeChambre: "",
        image: null,
      });
      setImagePreview(null);
      
      // Optional: Show success message or redirect
      alert('Hôtel ajouté avec succès!');
      
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('Erreur lors de l\'ajout de l\'hôtel');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Ajouter un hotel</h2>

      <form onSubmit={handleSubmit}>
        {/* SERVICE */}
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
            required
          />
        </div>

        <div className="form-group">
          <label>Prix</label>
          <input
            type="number"
            name="prix"
            value={form.prix}
            onChange={handleChange}
            required
          />
        </div>
        <hr />

        {/* HOTEL */}
        <div className="form-group">
          <label>Ville Hotel</label>
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
            accept="image/*"
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