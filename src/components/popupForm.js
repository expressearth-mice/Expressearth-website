import React, { useState } from 'react';
import axios from 'axios';
import './popupForm.css';
import axiosInstance from '../api/axios';

const PopupForm = ({ onClose }) => {
  const [type, setType] = useState('company');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Please enter full name";
    if (!formData.email.trim()) {
      newErrors.email = "Please enter email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter phone number";
    } else if (!/^\+?\d{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }
    return newErrors;
  };

  const sanitize = (value) => value?.trim() === '' ? null : value;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const formattedFormData = {
      full_name: sanitize(formData.full_name),
      email: sanitize(formData.email),
      phone: sanitize(formData.phone),
      company_name: sanitize(type === 'company' ? formData.company_name : null),
      event_date: null,
      event_type: 'Other',
      type: type,
    };

    console.log("Submitting:", formattedFormData); // For debugging

    try {
      const response = await axiosInstance.post(
        "/api/contact/",
        formattedFormData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response?.data?.success) {
        setSubmitted(true);
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          company_name: '',
        });
        setErrors({});
        setErrorMessage('');
      } else {
        setErrorMessage(response.data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-form-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Get in Touch</h3>

        {submitted && (
          <div className="alert alert-success">
            <span>Thank you for reaching out! Our team will connect with you shortly.</span>
            <button onClick={handleDismiss}>Close</button>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger">
            <strong>Error: </strong> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
          />
          {errors.full_name && <small className="text-danger">{errors.full_name}</small>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <small className="text-danger">{errors.email}</small>}

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <small className="text-danger">{errors.phone}</small>}

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="type"
                value="individual"
                checked={type === 'individual'}
                onChange={() => setType('individual')}
              />
              Individual
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="company"
                checked={type === 'company'}
                onChange={() => setType('company')}
              />
              Company
            </label>
          </div>

          {type === 'company' && (
            <input
              type="text"
              name="company_name"
              placeholder="Company Name"
              value={formData.company_name}
              onChange={handleChange}
            />
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
