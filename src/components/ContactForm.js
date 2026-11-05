import React, { useState,useEffect } from "react";
import { Form, Button, Card, Row, Col, Alert, Spinner } from "react-bootstrap";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaBuilding,
  FaUser,
  FaCalendarAlt,
  FaListUl,
  FaTimes,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Country } from "country-state-city";
import { useLocation, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA
import "./ContactForm.css";
import axiosInstance from "../api/axios";
import { isSuccessfulContactResponse } from "../utils/contactResponse";
import { trackConfirmedLead } from "../utils/leadTracking";
import { validateCorporateEnquiryBrief } from "../utils/corporateEnquiryValidation";
import { buildContactRequirements, getContactFormPrefill } from "../utils/contactQualification";

const createInitialFormData = (search = "") => ({
  full_name: "",
  company_name: "",
  email: "",
  phone: "",
  event_type: "",
  programme_detail: "",
  country: "",
  attendees: "",
  project_stage: "",
  event_date: "",
  requirements: "",
  ...getContactFormPrefill(search),
});

const ContactForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState(() =>
    createInitialFormData(location.search)
  );

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null); // Store CAPTCHA value

  useEffect(() => {
    setCountries(Country.getAllCountries());
    // if (window.gtag) {
    //   window.gtag("event", "form_landed", {
    //     event_category: "Contact Form",
    //     event_label: "Contact Form Landed",
    //   });
    // }
  }, []);

  useEffect(() => {
    const prefill = getContactFormPrefill(location.search);
    if (Object.keys(prefill).length) {
      setFormData((previous) => ({
        ...previous,
        event_type: previous.event_type || prefill.event_type,
        programme_detail: previous.programme_detail || prefill.programme_detail,
      }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    let newErrors = validateCorporateEnquiryBrief(formData);
    if (!formData.full_name.trim())
      newErrors.full_name = "Please enter full name";
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
      const { project_stage, programme_detail, ...contactFields } = formData;
      const formattedFormData = {
        ...contactFields,
        requirements: buildContactRequirements({
          programmeDetail: programme_detail,
          projectStage: project_stage,
          requirements: formData.requirements,
        }),
        event_date: formData.event_date
          ? new Date(formData.event_date).toISOString().split("T")[0]
          : null,
        captcha: captchaValue, // Include CAPTCHA value
      };

      const response = await axiosInstance.post(
        "/api/contact/",
        formattedFormData
      );

      if (isSuccessfulContactResponse(response)) {
        setSubmitted(true);
        setFormData(createInitialFormData(location.search));
        setErrors({});
        trackConfirmedLead({
          serviceType: programme_detail || formData.event_type || "corporate_mice",
          formLocation: "contact_page",
        });
        setCaptchaValue(null); // Reset CAPTCHA
        setErrorMessage("");
      } else {
        setErrorMessage(
          response?.data?.error || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      const backendErrors = error.response?.data;
      if (backendErrors?.event_date) {
        const eventDateError = Array.isArray(backendErrors.event_date)
          ? backendErrors.event_date.join(", ")
          : String(backendErrors.event_date);
        setErrorMessage(`Event Date: ${eventDateError}`);
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
    setCaptchaValue(value); // Save CAPTCHA value
  };

  return (
    <div className="contact-form-wrapper">
      <div className="contact-form-wrapper">
        {/* Add logo at the top center */}
        <div className="contact-logo text-center my-1">
          <img
            src="/Images/express_earth_logoo-removebg-preview.png"
            alt="Expressearth Logo"
            className="contact-logo-img"
          />
        </div>
      </div>
      <div className="contact-header-section">
        <h1>Contact ExpressEarth for Corporate MICE Enquiries</h1>
        <p>
          Share a few details about your organisation and programme. ExpressEarth
          supports corporate MICE enquiries for incentive travel, dealer and
          distributor meets, conferences, offsites, product launches and other
          business events. Include your preferred destination, dates and
          approximate group size so our team can understand the brief.
        </p>
      </div>

      <div className="contact-form-section">
        <div className="container">
          <Card className="contact-form-container">
            <Card.Body>
              <h2 className="form-title">Connect with Us Today </h2>

              {submitted && (
                <Alert
                  variant="success"
                  role="status"
                  aria-live="polite"
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>
                    Thank you. Your enquiry has been submitted successfully.
                  </span>
                  <Button
                    variant="link"
                    onClick={handleDismiss}
                    className="text-danger p-0 fs-5"
                  >
                    <FaTimes />
                  </Button>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant="danger" role="alert">
                  <strong>Error: </strong> {errorMessage}
                </Alert>
              )}

              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="full_name" className="mb-3">
                      <Form.Label>
                        <FaUser className="me-2" />
                        Full Name *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="full_name"
                        autoComplete="name"
                        required
                        aria-invalid={Boolean(errors.full_name)}
                        aria-describedby={errors.full_name ? "full_name-error" : undefined}
                        value={formData.full_name}
                        onChange={handleChange}
                      />
                      {errors.full_name && (
                        <small id="full_name-error" className="text-danger">
                          {errors.full_name}
                        </small>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="company_name" className="mb-3">
                      <Form.Label>
                        <FaBuilding className="me-2" />
                        Company / Organisation *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="company_name"
                        autoComplete="organization"
                        required
                        aria-invalid={Boolean(errors.company_name)}
                        aria-describedby={errors.company_name ? "company_name-error" : undefined}
                        value={formData.company_name}
                        onChange={handleChange}
                      />
                      {errors.company_name && (
                        <small id="company_name-error" className="text-danger">
                          {errors.company_name}
                        </small>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="email" className="mb-3">
                      <Form.Label>
                        <FaEnvelope className="me-2" />
                        Email Address *
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <small id="email-error" className="text-danger">{errors.email}</small>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="phone" className="mb-3">
                      <Form.Label>
                        <FaPhoneAlt className="me-2" />
                        Phone Number *
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        required
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        value={formData.phone}
                        onChange={handleChange}
                      />
                      {errors.phone && (
                        <small id="phone-error" className="text-danger">{errors.phone}</small>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="event_type" className="mb-3">
                  <Form.Label>
                    <FaListUl className="me-2" />
                    Programme Type *
                  </Form.Label>
                  <Form.Select
                    name="event_type"
                    required
                    aria-invalid={Boolean(errors.event_type)}
                    aria-describedby={errors.event_type ? "event_type-error" : undefined}
                    value={formData.event_type}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Conference">Conference</option>
                    <option value="Incentive Trip">Incentive Trip</option>
                    <option value="Corporate Meeting">Corporate Meeting</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                  {errors.event_type && (
                    <small id="event_type-error" className="text-danger">
                      {errors.event_type}
                    </small>
                  )}
                </Form.Group>

                <Form.Group controlId="programme_detail" className="mb-3">
                  <Form.Label>Specific service (optional)</Form.Label>
                  <Form.Select
                    name="programme_detail"
                    value={formData.programme_detail}
                    onChange={handleChange}
                    aria-describedby="programme_detail-help"
                  >
                    <option value="">Select if you know the specific service</option>
                    <option value="Incentive Travel">Incentive Travel</option>
                    <option value="Dealer &amp; Distributor Meet">Dealer &amp; Distributor Meet</option>
                    <option value="Corporate Offsite">Corporate Offsite</option>
                    <option value="Conference Management">Conference Management</option>
                    <option value="Corporate Event / Product Launch">Corporate Event / Product Launch</option>
                    <option value="Rewards &amp; Recognition">Rewards &amp; Recognition</option>
                    <option value="Exhibition / Trade Show">Exhibition / Trade Show</option>
                    <option value="International Group Travel">International Group Travel</option>
                    <option value="Destination Management">Destination Management</option>
                    <option value="Not sure yet">Not sure yet</option>
                  </Form.Select>
                  <Form.Text id="programme_detail-help" muted>
                    Optional. Choose a service if you know the specific programme you want to plan.
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group controlId="country" className="mb-3">
                      <Form.Label>
                        <FaMapMarkerAlt className="me-2" />
                        Preferred Destination / Country
                      </Form.Label>
                      <Form.Select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c.isoCode} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="attendees" className="mb-3">
                  <Form.Label>Expected Group Size (optional)</Form.Label>
                  <Form.Select
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="10-50">10-50</option>
                    <option value="50-100">50-100</option>
                    <option value="100-300">100-300</option>
                    <option value="300+">300+</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="project_stage" className="mb-3">
                  <Form.Label>Current Planning Stage (optional)</Form.Label>
                  <Form.Select
                    name="project_stage"
                    value={formData.project_stage}
                    onChange={handleChange}
                    aria-describedby="project_stage-help"
                  >
                    <option value="">Select planning stage</option>
                    <option value="Active brief / RFQ">Active brief / RFQ</option>
                    <option value="Programme planned; comparing partners">
                      Programme planned; comparing partners
                    </option>
                    <option value="Upcoming programme; exploring options">
                      Upcoming programme; exploring options
                    </option>
                    <option value="Early planning / gathering information">
                      Early planning / gathering information
                    </option>
                  </Form.Select>
                  <Form.Text id="project_stage-help" muted>
                    Optional. This helps our team understand whether you have an active brief or are exploring a future programme.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="event_date" className="mb-3">
                  <Form.Label>
                    <FaCalendarAlt className="me-2" />
                    Event Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId="requirements" className="mb-3">
                  <Form.Label>Requirements</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="requirements"
                    placeholder="Share your preferred destination, budget range, event dates and any travel or production requirements."
                    value={formData.requirements}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Add CAPTCHA here */}
                <Form.Group controlId="captcha" className="mb-3">
                  <ReCAPTCHA
                    sitekey="6LfG7hsrAAAAABrKlWfFUvwsE5GhzxM7YD6IfhYP" // Replace with your actual site key
                    onChange={handleCaptchaChange} // Handle CAPTCHA response
                  />
                  {errors.captcha && (
                    <small id="captcha-error" className="text-danger" role="alert">
                      {errors.captcha}
                    </small>
                  )}
                </Form.Group>

                <div className="text-center">
                  <Button
                    style={{
                      backgroundColor: "#146c43",
                      borderColor: "#146c43",
                    }}
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" aria-hidden="true" />
                        <span className="visually-hidden">Sending enquiry...</span>
                      </>
                    ) : (
                      "Send enquiry"
                    )}
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
