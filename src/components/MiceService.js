import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { FaRegCalendar, FaPlane, FaBullhorn, FaBuilding, FaMapMarkedAlt, FaGift, FaTrophy } from 'react-icons/fa';
import './MiceService.css';
import ServiceStructuredData from './ServiceStructuredData';

const services = [
  {
    title: "Meetings & Conferences",
    description: "Plan leadership meetings, sales conferences and corporate gatherings with venue sourcing, delegate logistics and event production.",
    icon: <FaRegCalendar color="#046ab8" />,
    link: "/meetings-and-conferences"
  },
  {
    title: "Incentive Travel",
    description: "Reward employees and channel partners with tailored incentive trips, destination experiences and coordinated group travel.",
    icon: <FaPlane color="#046ab8" />,
    link: "/incentive-travel"
  },
  {
    title: "Corporate Events",
    description: "Coordinate product launches, annual days, award ceremonies and employee events with venue, production and on-site support.",
    icon: <FaBullhorn color="#046ab8" />,
    link: "/corporate-events"
  },
  {
    title: "Rewards & Recognition",
    description: "Plan employee awards, recognition events and engagement programmes with event design, awards, production and on-ground coordination.",
    icon: <FaTrophy color="#046ab8" />,
    link: "/r&rplanning"
  },
  {
    title: "Exhibitions & Trade Shows",
    description: "Coordinate exhibition participation, booth logistics, branded environments and on-site support for trade shows and business events.",
    icon: <FaBuilding color="#046ab8" />,
    link: "/exhibitions-and-trade-shows"
  },
  {
    title: "Destination Management",
    description: "Manage corporate group logistics, including hotels, transfers, activities and local coordination at the destination.",
    icon: <FaMapMarkedAlt color="#046ab8" />,
    link: "/destination-management"
  },
  {
    title: "Dealer & Distributor Meets",
    description: "Plan dealer conferences, channel partner meets and recognition programmes with venue, branding, production and delegate coordination.",
    icon: <FaBuilding color="#046ab8" />,
    link: "/dealermeet"
  },
  {
    title: "Corporate Offsites",
    description: "Arrange team retreats and leadership offsites with destination, accommodation, meals, group transport and on-ground planning.",
    icon: <FaMapMarkedAlt color="#046ab8" />,
    link: "/corporateoffsites"
  },
  {
    title: "Conference Management",
    description: "Coordinate corporate conferences, annual sales meets and leadership programmes, including venues, production and delegate logistics.",
    icon: <FaRegCalendar color="#046ab8" />,
    link: "/conferencemanagement"
  },
  {
    title: "International Group Travel",
    description: "Plan international group programmes with destination research, accommodation, transfers, activities and group coordination.",
    icon: <FaPlane color="#046ab8" />,
    link: "/internationalgrouptravel"
  },
  {
    title: "Gifting",
    description: "Source corporate gifts and gift-with-purchase solutions for employee engagement, customer rewards and channel programmes.",
    icon: <FaGift color="#046ab8" />,
    link: "/Gifting"
  }
];

const serviceDescription = "Based in Gurugram (Gurgaon), ExpressEarth plans corporate MICE programmes for organisations across Delhi NCR and India, including meetings and conferences, incentive travel, dealer and distributor meets, rewards and recognition programmes, corporate offsites, exhibitions and business events. The agreed scope can include venue sourcing, group travel, accommodation, event production and on-ground logistics.";


const faqItems = [
  {
    question: "What does MICE stand for?",
    answerText: "MICE stands for Meetings, Incentives, Conferences and Exhibitions. Corporate MICE programmes can include leadership meetings, incentive travel, conferences, dealer and distributor meets, exhibitions and business events.",
    answer: (
      <p>
        MICE stands for <strong>Meetings, Incentives, Conferences and Exhibitions</strong>.
        Corporate programmes can include leadership meetings, incentive travel, conferences,
        dealer and distributor meets, exhibitions and business events.
      </p>
    ),
  },
  {
    question: "What does a corporate MICE agency coordinate?",
    answerText: "Depending on the brief, ExpressEarth can coordinate venue sourcing, group travel, accommodation, event production and on-ground logistics for meetings, incentive trips, conferences and corporate events.",
    answer: (
      <p>
        Depending on the brief, ExpressEarth can coordinate venue sourcing, group travel,
        accommodation, event production and on-ground logistics for meetings, incentive
        trips, conferences and corporate events.
      </p>
    ),
  },
  {
    question: "Which corporate programmes can ExpressEarth plan?",
    answerText: "ExpressEarth plans meetings and conferences, incentive travel, dealer and distributor meets, corporate offsites, corporate events and exhibitions.",
    answer: (
      <p>
        Service scopes include <Link to="/meetings-and-conferences">meetings and conferences</Link>,
        <Link to="/incentive-travel"> incentive travel</Link>,
        <Link to="/dealermeet"> dealer and distributor meets</Link>,
        <Link to="/corporateoffsites"> corporate offsites</Link>,
        <Link to="/corporate-events"> corporate events</Link> and
        <Link to="/exhibitions-and-trade-shows"> exhibitions and trade shows</Link>.
      </p>
    ),
  },
  {
    question: "Can ExpressEarth support corporate teams outside Gurugram?",
    answerText: "ExpressEarth is based in Gurugram and supports organisations across Delhi NCR and India. Programmes may be hosted in NCR or at domestic and international destinations, with the scope planned around the brief and destination requirements.",
    answer: (
      <p>
        ExpressEarth is based in Gurugram and supports organisations across Delhi NCR and
        India. Programmes may be hosted in NCR or at domestic and international destinations,
        with the scope planned around the brief and destination requirements.
      </p>
    ),
  },
  {
    question: "What information should I share to get a corporate MICE proposal?",
    answerText: "Share the programme objective, event type, expected attendee count, preferred dates, attendee origin cities, destination preference, budget range and whether you need venue, travel, accommodation, production or on-ground coordination.",
    answer: (
      <p>
        Share the programme objective, event type, expected attendee count, preferred dates,
        attendee origin cities, destination preference, budget range and whether you need
        venue, travel, accommodation, production or on-ground coordination.
      </p>
    ),
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(({ question, answerText }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answerText,
    },
  })),
};

const MiceServices = () => {
  const heroImage = '/Images/Expressearth%20website%20images/Our-Services/services.png';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mice-services-page">
      <ServiceStructuredData
        name="Corporate MICE Services"
        serviceType="Corporate MICE and event management"
        description={serviceDescription}
        url="https://www.expressearth.com/mice-services"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <section
        className="mice-services-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <h1 className="mice-services-hero-title">
          Corporate MICE Agency in Gurugram<br />Meetings, Incentive Travel, Conferences &amp; Events across Delhi NCR and India
        </h1>
      </section>


      <section className="mice-services-section">
        <p className="mice-services-intro">
          {serviceDescription} Explore the services below, then contact us with your programme type, destination, group size and dates.
        </p>
        <h2 className="mice-services-heading">
          OUR KEY SERVICES
        </h2>

        <div className="mice-services-grid">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className="mice-service-link"
            >
              <div className="mice-service-card">
                <div className="mice-service-icon">{service.icon}</div>
                <h3 className="mice-service-title">{service.title}</h3>
                <p className="mice-service-description">{service.description}</p>
                <span className="mice-service-cta">
                  LEARN MORE
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section className="mice-services-local" aria-labelledby="mice-services-local-heading">
          <h2 id="mice-services-local-heading" className="mice-services-local-heading">
            Gurugram-based corporate MICE planning across Delhi NCR
          </h2>
          <p>
            ExpressEarth is based in Gurugram (Gurgaon) and supports organisations planning
            corporate programmes for teams in Delhi, Noida, Faridabad and Ghaziabad as well
            as Gurugram. A programme can be hosted in NCR or at a destination elsewhere in
            India or overseas; the scope is shaped around attendee origin cities, dates,
            group size and the business objective.
          </p>
          <h3>What should a corporate MICE brief include?</h3>
          <p>
            Share the programme objective, event type, expected attendee count, preferred
            dates, attendee origin cities, destination preference, budget range and whether
            you need venue, travel, accommodation, production or on-ground coordination.
          </p>
        </section>

        <section className="mice-services-faq" aria-labelledby="mice-services-faq-heading">
          <h2 id="mice-services-faq-heading">Corporate MICE planning: common questions</h2>
          <div className="mice-services-faq-list">
            {faqItems.map((faq) => (
              <details key={faq.question} className="mice-services-faq-item">
                <summary>{faq.question}</summary>
                {faq.answer}
              </details>
            ))}
          </div>
        </section>

        <div className="mice-services-contact">
          <p className="mice-services-contact-text">
            Planning a corporate programme in Delhi NCR or elsewhere in India? Share your brief, dates, destination and expected group size with ExpressEarth.
          </p>

          <Link to="/contact" className="mice-services-contact-link custom-button-link">
            Share Your Corporate MICE Brief
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MiceServices;
