import React from 'react';

const TermsAndConditions = () => {
  const styles = {
    container: {
      padding: '40px',
      maxWidth: '900px',
      margin: '50px auto',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.8',
      color: '#333',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#003366',
      fontSize: '32px',
      fontWeight: 'bold',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px',
    },
    subHeader: {
      marginTop: '20px',
      color: '#0056b3',
      fontSize: '24px',
      fontWeight: '600',
    },
    paragraph: {
      marginBottom: '15px',
      fontSize: '16px',
      textAlign: 'justify',
    },
    list: {
      listStyleType: 'disc',
      marginLeft: '40px',
      marginBottom: '15px',
      fontSize: '16px',
    },
    listItem: {
      marginBottom: '8px',
    },
    contact: {
      marginTop: '20px',
      fontSize: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Terms and Conditions</h1>
      <p style={styles.paragraph}><strong>Effective Date:</strong> 1st March 2025</p>

      <h2 style={styles.subHeader}>Welcome to Expressearth Digital Services Pvt. Ltd.</h2>
      <p style={styles.paragraph}>
        Welcome to Expressearth Digital Services Pvt. Ltd. (“Expressearth”, “we”, “our”, or “us”). By engaging with us for MICE (Meetings, Incentives, Conferences, and Exhibitions) travel services, you ("client", "you", "your") agree to the following Terms and Conditions. Please read these terms carefully as they govern your access to and use of our services.
      </p>

      <h3 style={styles.subHeader}>1. Scope of Services</h3>
      <p style={styles.paragraph}>Expressearth provides end-to-end MICE solutions, including but not limited to:</p>
      <ul style={styles.list}>
        <li style={styles.listItem}>Domestic and international travel arrangements (flight, train, bus, car rentals)</li>
        <li style={styles.listItem}>Hotel and venue bookings</li>
        <li style={styles.listItem}>Event planning and execution</li>
        <li style={styles.listItem}>Group visa assistance</li>
        <li style={styles.listItem}>Meals, tours, and entertainment arrangements</li>
        <li style={styles.listItem}>On-ground coordination and support</li>
        <li style={styles.listItem}>Travel insurance facilitation (if requested)</li>
      </ul>
      <p style={styles.paragraph}>All services are offered based on availability and subject to the specific agreements outlined in each client proposal or contract.</p>

      <h3 style={styles.subHeader}>2. Booking & Confirmation</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>All bookings must be requested in writing (via email or official communication platform).</li>
        <li style={styles.listItem}>Bookings will be confirmed only upon receipt of an advance payment or purchase order, as per the agreed terms.</li>
        <li style={styles.listItem}>Final services and rates are subject to availability at the time of confirmation.</li>
        <li style={styles.listItem}>Any change in the number of attendees, dates, or services may result in revised pricing.</li>
      </ul>

      <h3 style={styles.subHeader}>3. Payments</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>Payment terms will be defined in the official quotation and contract.</li>
        <li style={styles.listItem}>Full payment or partial advance may be required to secure bookings, as applicable.</li>
        <li style={styles.listItem}>Payment must be made through accepted modes: NEFT/RTGS, IMPS, UPI, or cheque (subject to clearance).</li>
        <li style={styles.listItem}>Delayed payments may attract interest charges and may affect confirmed bookings or services.</li>
      </ul>

      <h3 style={styles.subHeader}>4. Cancellations & Refund Policy</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>Cancellations must be made in writing and will be acknowledged formally.</li>
        <li style={styles.listItem}>Cancellation charges depend on the type of service and the cancellation window:</li>
        <ul style={styles.list}>
          <li style={styles.listItem}>Flights: As per airline policies & agency charge</li>
          <li style={styles.listItem}>Hotels: As per hotel group policy (usually 30–90 days prior)</li>
          <li style={styles.listItem}>Transport/Visa/Event costs: Non-refundable once processed or booked</li>
        </ul>
        <li style={styles.listItem}>Refunds, if applicable, will be processed within 15 working days and returned via the original mode of payment, after deducting applicable charges.</li>
      </ul>

      <h3 style={styles.subHeader}>5. Changes & Modifications</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>Any request for changes (travel dates, attendee names, event details) must be shared at least 7 days in advance or as per the vendor deadline.</li>
        <li style={styles.listItem}>Changes are subject to availability and may incur additional costs.</li>
        <li style={styles.listItem}>Expressearth reserves the right to modify or substitute services in case of unforeseen circumstances, force majeure, or vendor unavailability, with equivalent alternatives.</li>
      </ul>

      <h3 style={styles.subHeader}>6. Client Responsibilities</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>Clients must provide accurate information regarding traveler details, preferences, documentation, and any special requests.</li>
        <li style={styles.listItem}>Clients are responsible for ensuring participants meet all visa, passport, and vaccination requirements.</li>
        <li style={styles.listItem}>Any delay or misinformation affecting the bookings will be the client's responsibility.</li>
        <li style={styles.listItem}>Clients must respect deadlines and communication timelines to ensure smooth execution.</li>
      </ul>

      <h3 style={styles.subHeader}>7. Travel Documents & Visa</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>Expressearth may assist with visa documentation; however, approval is at the sole discretion of the embassy or consulate.</li>
        <li style={styles.listItem}>Clients must provide all required documents accurately and on time.</li>
        <li style={styles.listItem}>In case of rejection, visa processing fees are non-refundable.</li>
      </ul>

      <h3 style={styles.subHeader}>8. Force Majeure</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>Expressearth shall not be held liable for any delay, cancellation, or non-performance arising due to:</li>
        <ul style={styles.list}>
          <li style={styles.listItem}>Natural disasters, pandemics, or epidemics</li>
          <li style={styles.listItem}>War, terrorism, political unrest</li>
          <li style={styles.listItem}>Government restrictions, strikes, or transport disruptions</li>
          <li style={styles.listItem}>Any other event beyond reasonable control</li>
        </ul>
        <li style={styles.listItem}>In such cases, we will work to provide suitable alternatives or reschedule wherever possible.</li>
      </ul>

      <h3 style={styles.subHeader}>9. Intellectual Property</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>All content, itineraries, presentations, branding, and materials shared by Expressearth are protected by copyright and intellectual property laws.</li>
        <li style={styles.listItem}>Clients may use these materials solely for their events or internal communication.</li>
        <li style={styles.listItem}>Any commercial use, replication, or sharing without written consent is strictly prohibited.</li>
      </ul>

      <h3 style={styles.subHeader}>10. Confidentiality</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>Expressearth and the client agree to maintain the confidentiality of all sensitive information shared during the planning and execution of services.</li>
        <li style={styles.listItem}>Neither party shall disclose confidential information to any third party without prior written consent, unless required by law.</li>
      </ul>

      <h3 style={styles.subHeader}>11. Limitation of Liability</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>Expressearth is a facilitator and not liable for direct actions or negligence of third-party vendors, airlines, hotels, or transport providers.</li>
        <li style={styles.listItem}>Our liability is limited to the value of the service fee paid by the client, excluding third-party costs.</li>
        <li style={styles.listItem}>We are not liable for personal injury, loss, or damage suffered by participants during travel or events.</li>
      </ul>

      <h3 style={styles.subHeader}>12. Termination of Services</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>Either party may terminate the engagement by giving written notice and settling all dues.</li>
        <li style={styles.listItem}>Expressearth reserves the right to cancel services in the event of:</li>
        <ul style={styles.list}>
          <li style={styles.listItem}>Non-payment or breach of terms</li>
          <li style={styles.listItem}>Misrepresentation or misconduct by the client</li>
          <li style={styles.listItem}>Force majeure scenarios</li>
        </ul>
      </ul>

      <h3 style={styles.subHeader}>13. Governing Law & Dispute Resolution</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>These terms are governed by the laws of India.</li>
        <li style={styles.listItem}>Any disputes shall be resolved through arbitration in Gurgaon, Haryana, under the Arbitration and Conciliation Act, 1996.</li>
        <li style={styles.listItem}>Both parties agree to attempt amicable resolution before initiating legal proceedings.</li>
      </ul>

      <h3 style={styles.subHeader}>14. Updates to Terms</h3>
      <p style={styles.paragraph}>
        Expressearth reserves the right to update these terms and conditions periodically. The updated version will be posted on our website and will take effect from the date of publication.
      </p>

      <h3 style={styles.subHeader}>15. Contact Information</h3>
      <p style={styles.contact}>
        Expressearth Digital Services Pvt. Ltd.<br />
        Unit No 22, Vipul Trade Center, Sector 48, Gurgaon, Haryana<br />
        Email: help@expressearth.com<br />
        Phone: +91-9266056660<br />
        Website: <a href="https://www.expressearth.com" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>https://www.expressearth.com</a>
      </p>
    </div>
  );
};

export default TermsAndConditions;
