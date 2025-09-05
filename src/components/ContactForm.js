import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import {
  FaEnvelope, FaPhoneAlt, FaBuilding, FaUser,
  FaCalendarAlt, FaListUl, FaTimes, FaMapMarkerAlt
} from "react-icons/fa";
import { Country } from "country-state-city";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";  // Import reCAPTCHA
import "./ContactForm.css";
import axiosInstance from "../api/axios";

const ContactForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    email: "",
    phone: "",
    event_type: "",
    country: "",
    attendees: "",
    event_date: "",
    requirements: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);  // Store CAPTCHA value

  useEffect(() => {
    setCountries(Country.getAllCountries());
    if (window.gtag) {
            window.gtag('event', 'submit', {
              event_category: 'Contact Form',
              event_label: 'ContactForm landed',
            });
          }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
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
    if (!captchaValue) {
      newErrors.captcha = "Please verify you're not a robot";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const formattedFormData = {
        ...formData,
        event_date: formData.event_date
          ? new Date(formData.event_date).toISOString().split("T")[0]
          : null,
        captcha: captchaValue,  // Include CAPTCHA value
      };

      const response = await axiosInstance.post("/api/contact/", formattedFormData);

      if (response && response.data) {
        if (response.data.success && typeof response.data.success === "string") {
          setSubmitted(true);
          setFormData({
            full_name: "",
            company_name: "",
            email: "",
            phone: "",
            event_type: "",
            country: "",
            attendees: "",
            event_date: "",
            requirements: "",
          });
          setErrors({});
          setCaptchaValue(null);  // Reset CAPTCHA
          setErrorMessage('');  // Clear any previous error message
        } else {
          setErrorMessage(response.data.error || "Failed to send message. Please try again.");
        }        
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      const backendErrors = error.response?.data;
      if (backendErrors?.event_date) {
        setErrorMessage(`Event Date: ${backendErrors.event_date.join(", ")}`);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setSubmitted(false);
  };

  const handleRegionClick = (regionPath) => {
    navigate(`/contact-expert/${regionPath}`);
  };

  // Function to handle CAPTCHA response
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);  // Save CAPTCHA value
  };

  return (

    <div className="contact-form-wrapper">
      <div className="contact-form-wrapper">
        {/* Add logo at the top center */}
        <div className="contact-logo text-center my-1">
          <img
            src="\Images\express_earth_logoo-removebg-preview.png"
            alt="Expressearth Logo"
            className="contact-logo-img"
          />
        </div>
      </div>
      <div className="contact-header-section">
        <h2>Contact us</h2>
        <p>
          Let’s Plan Your Next Unforgettable Corporate Event<br /><br />
          Looking to elevate your next meeting, incentive trip, or corporate event? Our expert MICE consultants are here to bring your vision to life with tailor-made solutions, luxury experiences, and seamless execution—anywhere in the world.<br />
          Whether you're seeking advice, requesting a proposal, or just exploring options, we're happy to connect.
        </p>
      </div>

      <div className="contact-form-section">
        <div className="container">
          <Card className="contact-form-container">
            <Card.Body>
              <h2 className="form-title">Connect with Us Today              </h2>

              {submitted && (
                <Alert variant="success" className="d-flex justify-content-between align-items-center">
                  <span>Thank you for reaching out! Our team will connect with you shortly.</span>
                  <Button variant="link" onClick={handleDismiss} className="text-danger p-0 fs-5">
                    <FaTimes />
                  </Button>

                </Alert>
              )}

              {errorMessage && (
                <Alert variant="danger">
                  <strong>Error: </strong> {errorMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="full_name" className="mb-3">
                      <Form.Label><FaUser className="me-2" />Full Name *</Form.Label>
                      <Form.Control type="text" name="full_name" value={formData.full_name} onChange={handleChange} />
                      {errors.full_name && <small className="text-danger">{errors.full_name}</small>}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="company_name" className="mb-3">
                      <Form.Label><FaBuilding className="me-2" />Company Name</Form.Label>
                      <Form.Control type="text" name="company_name" value={formData.company_name} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="email" className="mb-3">
                      <Form.Label><FaEnvelope className="me-2" />Email Address *</Form.Label>
                      <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                      {errors.email && <small className="text-danger">{errors.email}</small>}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="phone" className="mb-3">
                      <Form.Label><FaPhoneAlt className="me-2" />Phone Number *</Form.Label>
                      <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                      {errors.phone && <small className="text-danger">{errors.phone}</small>}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="event_type" className="mb-3">
                  <Form.Label><FaListUl className="me-2" />Event Type</Form.Label>
                  <Form.Select name="event_type" value={formData.event_type} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Conference">Conference</option>
                    <option value="Incentive Trip">Incentive Trip</option>
                    <option value="Corporate Meeting">Corporate Meeting</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group controlId="country" className="mb-3">
                      <Form.Label><FaMapMarkerAlt className="me-2" />Country</Form.Label>
                      <Form.Select name="country" value={formData.country} onChange={handleChange}>
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c.isoCode} value={c.name}>{c.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="attendees" className="mb-3">
                  <Form.Label>Number of Attendees</Form.Label>
                  <Form.Select name="attendees" value={formData.attendees} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="10-50">10-50</option>
                    <option value="50-100">50-100</option>
                    <option value="100-300">100-300</option>
                    <option value="300+">300+</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="event_date" className="mb-3">
                  <Form.Label><FaCalendarAlt className="me-2" />Event Date</Form.Label>
                  <Form.Control type="date" name="event_date" value={formData.event_date} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="requirements" className="mb-3">
                  <Form.Label>Requirements</Form.Label>
                  <Form.Control as="textarea" rows={4} name="requirements" value={formData.requirements} onChange={handleChange} />
                </Form.Group>

                {/* Add CAPTCHA here */}
                <Form.Group controlId="captcha" className="mb-3">
                  <ReCAPTCHA
                    sitekey="6LfG7hsrAAAAABrKlWfFUvwsE5GhzxM7YD6IfhYP"  // Replace with your actual site key
                    onChange={handleCaptchaChange}  // Handle CAPTCHA response
                  />
                  {errors.captcha && <small className="text-danger">{errors.captcha}</small>}
                </Form.Group>

                <div className="text-center">
                  <Button style={{ backgroundColor: '##56ce27', borderColor: '#56ce27' }} type="submit" disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : "Submit"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;