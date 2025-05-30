import React from "react";

const PrivacyPolicy = () => {
  const styles = {
    container: {
      padding: "30px",
      fontFamily: "'Georgia', serif",
      lineHeight: "1.8",
      maxWidth: "1000px",
      margin: "0 auto",
      background: "linear-gradient(135deg, #f2f2f2 0%, #ffffff 100%)",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      fontSize: "2.8em",
      marginBottom: "30px",
      textAlign: "center",
      color: "#333",
      fontWeight: "bold",
    },
    paragraph: {
      fontSize: "1.2em",
      marginBottom: "20px",
      color: "#555",
      textAlign: "justify",
    },
    sectionTitle: {
      fontSize: "1.5em",
      marginBottom: "10px",
      fontWeight: "bold",
      color: "#444",
    },
    section: {
      marginBottom: "30px",
    },
    footer: {
      textAlign: "center",
      marginTop: "30px",
      fontSize: "1em",
      color: "#777",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Privacy Policy – Expressearth (MICE Services)</h1>
      <p style={styles.paragraph}><strong>Effective Date:</strong> 1st March 2025</p>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>1. Information We Collect</div>
        <p style={styles.paragraph}>
          We collect personal information including name, phone number, email, company details,
          passport and visa details (for international travel), dietary preferences, and emergency contacts.
          Booking data such as itineraries, hotels, and flight details, as well as transaction history,
          is collected securely. We also gather digital data like IP addresses and location info for app usage.
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>2. How We Use Your Information</div>
        <p style={styles.paragraph}>
          Your data is used to process bookings, coordinate with service providers, respond to queries,
          meet legal obligations, and enhance our offerings. This allows us to deliver personalized and seamless MICE experiences.
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>3. Information Sharing & Third Parties</div>
        <p style={styles.paragraph}>
          We do not sell or rent personal data. We only share it with trusted partners like airlines, hotels, or government bodies
          when required. All third-party services follow strict confidentiality agreements.
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>4. Data Storage & Security</div>
        <p style={styles.paragraph}>
          We use encryption, access controls, and regular audits to protect data. Access is restricted
          to authorized personnel, and we retain information only as long as necessary or required by law.
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>5. International Travel & Data Transfers</div>
        <p style={styles.paragraph}>
          Your data may be transferred internationally. We ensure compliance with global standards such as GDPR,
          with safeguards like legal agreements to protect your information overseas.
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>6. Your Rights</div>
        <p style={styles.paragraph}>
          You have rights to access, update, or delete your data, withdraw consent, and file complaints with authorities.
          These are subject to applicable laws and contractual terms.
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>7. Cancellations, Refunds, and Modifications</div>
        <p style={styles.paragraph}>
          Cancellations may incur fees based on vendor policies. Refunds are processed as per booking terms.
          Modifications must be communicated in writing within specified timelines.
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>8. Communication & Updates</div>
        <p style={styles.paragraph}>
          We may contact you via email, SMS, or phone regarding bookings or events.
          You can opt-out of promotional messages anytime.
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>9. Intellectual Property</div>
        <p style={styles.paragraph}>
          All materials shared by Expressearth are protected by IP laws. You may use them only for event purposes.
          Reuse or redistribution for commercial purposes is prohibited without permission.
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>10. Termination of Services</div>
        <p style={styles.paragraph}>
          We may terminate services in case of fraud, misuse, or breach. Clients may also end services
          based on contract terms. Legal disputes will be resolved under Indian law via arbitration in Gurgaon, Haryana.
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>11. Policy Updates</div>
        <p style={styles.paragraph}>
          We may revise this policy as required. Updates will be posted on our website with the effective date.
        </p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Contact Us</div>
        <p style={styles.paragraph}>
          <strong>Expressearth Digital Services Pvt. Ltd.</strong><br />
          Unit No 22, Vipul Trade Center, Sector 48, Gurgaon, Haryana<br />
          Email: <a href="mailto:help@expressearth.com">help@expressearth.com</a><br />
          Phone: +91-9266056660<br />
          Website: <a href="https://www.expressearth.com" target="_blank" rel="noreferrer">www.expressearth.com</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
