import React, { useEffect } from "react";

const faqs = [
  {
    question: "What is included in a corporate offsite package?",
    answer: "A typical programme can combine hotel accommodation, meals, return group transfers, meeting space, team-building activities, evening entertainment and on-ground coordination. ExpressEarth confirms the exact inclusions against your dates, destination, group size and brief."
  },
  {
    question: "Can you organise an offsite for 20, 50, 100 or 200 employees?",
    answer: "Yes. We plan group programmes around the confirmed headcount, rooming plan, travel origin, agenda and venue capacity. Share your expected group size and we will recommend suitable destinations and formats."
  },
  {
    question: "Which destinations can we choose from?",
    answer: "Options may include Goa, Jaipur, Rishikesh, Jim Corbett, Udaipur, Agra, Himachal Pradesh and other destinations in India, as well as international locations such as Bali, Vietnam, Thailand, Georgia and Almaty. Feasibility depends on dates, flights, season and group size."
  },
  {
    question: "How much does a corporate offsite cost?",
    answer: "The existing ExpressEarth website advertises selected 1-night, 2-day packages from ₹7,000 per person for groups of 40–100, including twin-share accommodation, meals and round-trip transport. Taxes are extra and the final quote depends on destination, dates, hotel category and confirmed inclusions."
  },
  {
    question: "How early should we plan a company offsite?",
    answer: "For domestic programmes, starting 4–8 weeks ahead gives more choice of venues and room inventory. Large groups, peak dates and international programmes usually need more lead time. Urgent requests can still be assessed against live availability."
  },
  {
    question: "Can ExpressEarth manage the complete programme?",
    answer: "Depending on the brief, the team can coordinate destination and hotel sourcing, travel, meals, meeting arrangements, activities, production, delegate communication and on-ground operations through one programme plan."
  }
];

const styles = {
  page: { color: "#172033", fontFamily: "inherit", lineHeight: 1.65 },
  hero: { background: "linear-gradient(125deg,#10233f 0%,#183f61 58%,#1d665f 100%)", color: "#fff", padding: "76px max(6vw,24px)", borderRadius: 0 },
  wrap: { maxWidth: 1120, margin: "0 auto", padding: "48px 24px" },
  eyebrow: { textTransform: "uppercase", letterSpacing: "0.12em", fontSize: 12, fontWeight: 700, color: "#b9dfd7" },
  h1: { fontSize: "clamp(34px,5vw,58px)", lineHeight: 1.08, maxWidth: 850, margin: "16px 0" },
  lead: { fontSize: 19, maxWidth: 780, color: "#e6eef4" },
  cta: { display: "inline-block", background: "#e6b65c", color: "#172033", padding: "13px 22px", borderRadius: 6, fontWeight: 700, textDecoration: "none", margin: "18px 12px 0 0" },
  secondary: { display: "inline-block", border: "1px solid #b9cbd8", color: "#fff", padding: "12px 20px", borderRadius: 6, fontWeight: 700, textDecoration: "none", marginTop: 18 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18, marginTop: 24 },
  card: { background: "#f5f7f9", border: "1px solid #e5eaf0", borderRadius: 10, padding: 22 },
  h2: { fontSize: "clamp(26px,3vw,36px)", lineHeight: 1.2, margin: "0 0 14px" },
  muted: { color: "#596579" },
  band: { background: "#f2f6f6", padding: "36px 24px", borderTop: "1px solid #e4ecea", borderBottom: "1px solid #e4ecea" },
  list: { paddingLeft: 20 }
};

function CorporateOffsitePackagesPage() {
  useEffect(() => {
    document.title = "Corporate Offsite Packages from Gurgaon & Delhi NCR | ExpressEarth";
    const description = "Plan a company offsite from Gurgaon or Delhi NCR with ExpressEarth. Compare India and international destinations, group sizes, inclusions and indicative pricing. Get a tailored group proposal.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = description;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = "https://www.expressearth.com/corporate-offsite-packages";
    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Corporate Offsite Planning and Packages",
      provider: { "@type": "Organization", name: "ExpressEarth", url: "https://www.expressearth.com/" },
      areaServed: ["Gurugram", "Delhi", "Noida", "Faridabad", "Ghaziabad", "India"],
      serviceType: "Corporate offsite planning, group travel and team experiences",
      url: "https://www.expressearth.com/corporate-offsite-packages"
    };
    const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.expressearthSeo = "corporate-offsite-packages";
    script.text = JSON.stringify([schema, faqSchema]);
    document.head.querySelectorAll('script[data-expressearth-seo="corporate-offsite-packages"]').forEach(node => node.remove());
    script.dataset.expressearthSeo = "corporate-offsite-packages";
    script.setAttribute("data-expressearth-seo", "corporate-offsite-packages");
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  const enquiryUrl = "https://wa.me/918448185550?text=" + encodeURIComponent("Hi ExpressEarth, I would like to plan a corporate offsite. Please help with destination options and a proposal.");
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={{maxWidth:1120,margin:"0 auto"}}>
          <div style={styles.eyebrow}>EXPRESSEARTH · CORPORATE OFFSITES & GROUP EXPERIENCES</div>
          <h1 style={styles.h1}>Corporate Offsite Packages from Gurgaon & Delhi NCR</h1>
          <p style={styles.lead}>One team. One coordinated plan. From destination and hotel selection to group travel, team experiences, conference arrangements and on-ground management, ExpressEarth helps companies turn an offsite brief into a well-run programme.</p>
          <a style={styles.cta} href={enquiryUrl} target="_blank" rel="noreferrer">Get an Offsite Proposal</a>
          <a style={styles.secondary} href="tel:+918448185550">Call 84481 85550</a>
          <p style={{fontSize:13,color:"#d5e1e8",marginTop:18}}>For startups, SMEs, growing teams, large corporates and enterprise groups.</p>
        </div>
      </section>

      <section style={styles.wrap}>
        <p style={styles.eyebrow}>START WITH THE OUTCOME</p>
        <h2 style={styles.h2}>What should your team get out of the offsite?</h2>
        <p style={styles.muted}>A good offsite is more than a hotel booking. It gives people time and space to align, recognise performance, build relationships or work through a business agenda. We shape the format around the outcome you want—not a one-size-fits-all itinerary.</p>
        <div style={styles.grid}>
          <article style={styles.card}><h3>Team connection</h3><p>Shared experiences, facilitated activities and informal time designed around team size and culture.</p></article>
          <article style={styles.card}><h3>Leadership alignment</h3><p>Focused retreats with meeting space, working sessions, hospitality and a quieter setting for decision-making.</p></article>
          <article style={styles.card}><h3>Sales kick-offs & recognition</h3><p>Bring teams together for business updates, awards, recognition moments and celebration.</p></article>
          <article style={styles.card}><h3>Reward & incentive travel</h3><p>Recognise achievement with domestic or international group journeys and managed experiences.</p></article>
        </div>
      </section>

      <section style={styles.band}>
        <div style={{maxWidth:1120,margin:"0 auto"}}>
          <h2 style={styles.h2}>Indicative package starting point</h2>
          <div style={{display:"flex",flexWrap:"wrap",gap:28,alignItems:"center"}}>
            <div><div style={{fontSize:42,fontWeight:800,color:"#164e63"}}>₹7,000</div><strong>per person*</strong></div>
            <div style={{maxWidth:700}}><p>Selected 1-night, 2-day corporate offsite packages for groups of 40–100 have been advertised on the ExpressEarth website from ₹7,000 per person. The published starting inclusions are twin-share accommodation, all meals and round-trip transportation.</p><p style={{fontSize:13,color:"#596579"}}>*Taxes extra. This is an indicative starting price for selected packages, not a universal or guaranteed rate. Destination, travel date, hotel category, availability, group size and final inclusions affect the quotation.</p></div>
          </div>
          <a style={{...styles.cta,marginTop:8}} href={enquiryUrl} target="_blank" rel="noreferrer">Check Options for My Group</a>
        </div>
      </section>

      <section style={styles.wrap}>
        <p style={styles.eyebrow}>DESTINATION IDEAS</p>
        <h2 style={styles.h2}>Choose a destination that fits your group</h2>
        <div style={styles.grid}>
          <article style={styles.card}><h3>Goa</h3><p>Beachside stays, gala evenings and relaxed group experiences. Suitable formats depend on season and flight access.</p></article>
          <article style={styles.card}><h3>Jaipur & Udaipur</h3><p>Heritage hotels, distinctive venues and cultural experiences for leadership retreats and celebrations.</p></article>
          <article style={styles.card}><h3>Rishikesh & Jim Corbett</h3><p>Nature-led retreats and outdoor team experiences, subject to activity suitability and weather.</p></article>
          <article style={styles.card}><h3>Himachal Pradesh</h3><p>Mountain settings for teams seeking a slower pace, with road journey planning and seasonal checks.</p></article>
          <article style={styles.card}><h3>Bali & Vietnam</h3><p>International incentive and team journeys with group flights, hotels, meals and experiences coordinated.</p></article>
          <article style={styles.card}><h3>Thailand, Georgia & Almaty</h3><p>International options to compare by travel time, visa requirements, season, budget and group preferences.</p></article>
        </div>
        <p style={{...styles.muted,fontSize:13,marginTop:16}}>Destination examples are starting points for discussion. Final recommendations depend on current travel rules, visa requirements, transport schedules and supplier availability.</p>
      </section>

      <section style={styles.band}>
        <div style={{maxWidth:1120,margin:"0 auto"}}>
          <h2 style={styles.h2}>What ExpressEarth can coordinate</h2>
          <div style={styles.grid}>
            {["Destination research and hotel sourcing","Rooming lists and group transfers","Meals, meeting rooms and conference set-up","Team-building activities and experiences","Stage, sound, lighting and event production","Delegate communication and on-ground coordination","Contingency planning and programme control","Post-event feedback and reporting"].map(item => <div key={item} style={{background:"#fff",padding:16,borderRadius:8,border:"1px solid #e1e9e8"}}>✓ {item}</div>)}
          </div>
        </div>
      </section>

      <section style={styles.wrap}>
        <p style={styles.eyebrow}>PROVEN DELIVERY EXPERIENCE</p>
        <h2 style={styles.h2}>Experience that goes beyond the itinerary</h2>
        <div style={styles.grid}>
          <article style={styles.card}><div style={{fontSize:34,fontWeight:800,color:"#164e63"}}>450</div><h3>People on a Bali incentive programme</h3><p>ExpressEarth has shared experience managing a 450-person Bali corporate group programme. Large group travel requires coordinated movement, accommodation, hospitality and on-ground delivery.</p></article>
          <article style={styles.card}><div style={{fontSize:34,fontWeight:800,color:"#164e63"}}>5,000</div><h3>Employees and family members</h3><p>ExpressEarth's case-study material documents a 5,000-person employee and family day inside a live automobile manufacturing plant, with programme governance, crowd flow and operational risk controls.</p></article>
        </div>
        <p style={{fontSize:13,color:"#596579",marginTop:14}}>These are examples of different programme types and scale—not claims that every offsite includes the same services or outcomes.</p>
      </section>

      <section style={styles.wrap}>
        <h2 style={styles.h2}>Frequently asked questions</h2>
        {faqs.map((item,i) => <details key={item.question} style={{padding:"16px 0",borderBottom:"1px solid #e5eaf0"}} open={i===0}><summary style={{fontWeight:700,cursor:"pointer"}}>{item.question}</summary><p style={styles.muted}>{item.answer}</p></details>)}
      </section>

      <section style={{...styles.hero,paddingTop:48,paddingBottom:48}}>
        <div style={{maxWidth:1120,margin:"0 auto"}}>
          <h2 style={{...styles.h2,color:"#fff"}}>Tell us your group size, dates and objective.</h2>
          <p style={styles.lead}>We will help you shortlist destinations and prepare a proposal around your brief.</p>
          <a style={styles.cta} href={enquiryUrl} target="_blank" rel="noreferrer">WhatsApp ExpressEarth</a>
          <a style={styles.secondary} href="mailto:info@expressearth.com?subject=Corporate%20Offsite%20Enquiry">Email Your Brief</a>
        </div>
      </section>
    </main>
  );
}

export default CorporateOffsitePackagesPage;
