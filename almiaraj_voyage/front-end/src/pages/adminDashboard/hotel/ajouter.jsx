import { useState } from "react";
import "./ajouter.css";
import { Link } from "react-router-dom";
import { axiosClient } from "@/api/axios";

export default function AjouterHotel() {
  const [isSubmitting, setIsSubmiting] = useState(false)
  const [form, setForm] = useState({
    nomServ: "",
    description: "",
    prix: "",
    capaciteTotal: "",
    placeDisponibles: "",

    villeHotel: "",
    checkIn: "",
    checkOut: "",
    typeChambre: "",

    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmiting(true);
  
  // Create FormData for file upload
  const formData = new FormData();
  formData.append('nomServ', form.nomServ);
  formData.append('description', form.description);
  formData.append('prix', form.prix);
  formData.append('capaciteTotal', form.capaciteTotal);
  formData.append('placeDisponibles', form.placeDisponibles);
  formData.append('villeHotel', form.villeHotel);
  formData.append('checkIn', form.checkIn);
  formData.append('checkOut', form.checkOut);
  formData.append('typeChambre', form.typeChambre);
  
  // Debug: Log the image file info
  if (form.image) {
    console.log('Image file:', form.image);
    console.log('Image type:', form.image.type);
    console.log('Image size:', form.image.size);
    formData.append('image', form.image);
  } else {
    console.log('No image selected');
  }
  
  try {
    const response = await axiosClient.post('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Success:', response.data);
    // Optionally redirect or show success message
  } catch (error) {
    console.log('Error Response:', error.response);
    console.log('Validation Errors:', error.response?.data?.errors);
    console.log('Error Message:', error.response?.data?.message);
  } finally {
    setIsSubmiting(false);
  }
}

  return (
    <div className="form-container">
      <h2>Ajouter Service + Hotel</h2>

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

        <div className="form-group">
          <label>Capacité Total</label>
          <input
            type="number"
            name="capaciteTotal"
            value={form.capaciteTotal}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Places Disponibles</label>
          <input
            type="number"
            name="placeDisponibles"
            value={form.placeDisponibles}
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
          <label>Check In</label>
          <input
            type="date"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Check Out</label>
          <input
            type="date"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Type Chambre</label>
          <select
            name="typeChambre"
            value={form.typeChambre}
            onChange={handleChange}
            required
          >
            <option value="">Choisir</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        <div className="form-group">
          <label>Image</label>
          <input type="file" name="image" onChange={handleChange} />
        </div>
        <div className="btns">
          <button type="submit">Ajouter</button>
          <Link to="/admin" className="cancel-btn">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}