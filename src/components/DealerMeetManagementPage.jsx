import React, { useEffect } from "react";
import dealerHero from "../assests/DE_2.jpeg";
import dealerStage from "../assests/DE_1.png";
import dealerTeam from "../assests/DE_Team.jpg";

const faqs = [
  ["What does a dealer meet management company handle?", "The scope can include event concept and agenda coordination, venue sourcing, delegate travel and accommodation, registration, stage and AV, branding, hospitality, entertainment and on-ground event management."],
  ["Can you organise a national dealer conference?", "Yes. Share the expected dealer count, cities of origin, dates, business objectives and preferred destination. The programme can then be designed around venue capacity, travel logistics and the agenda."],
  ["Can dealer meets include awards and product launches?", "Yes. Recognition ceremonies, product announcements, leadership addresses, exhibitions, demonstrations and gala dinners can be integrated into the event plan where required."],
  ["Do you manage dealer meets outside India?", "International dealer meets can be evaluated based on group size, passport and visa requirements, flight connectivity, destination season, budget and supplier availability."],
  ["How early should we start planning?", "For a large domestic dealer meet, an early brief—often 8–12 weeks ahead—helps secure suitable venues and room blocks. International programmes and peak dates may need more lead time."],
  ["How do we get a proposal?", "Send your company name, event objective, approximate delegate count, dates, destination preference and budget range. ExpressEarth can use these details to prepare a relevant planning approach and proposal."]
];

const styles = {
  page:{color:"#172033",lineHeight:1.65},
  hero:{background:"#10233f",color:"#fff",padding:"64px 24px"},
  wrap:{maxWidth:1120,margin:"0 auto",padding:"48px 24px"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20},
  card:{background:"#f5f7f9",border:"1px solid #e4e9ef",borderRadius:10,padding:22},
  h1:{fontSize:"clamp(34px,5vw,56px)",lineHeight:1.1,maxWidth:900},
  h2:{fontSize:"clamp(26px,3vw,36px)",lineHeight:1.2},
  muted:{color:"#596579"},
  img:{width:"100%",height:230,objectFit:"cover",borderRadius:9},
  cta:{display:"inline-block",background:"#e6b65c",color:"#172033",padding:"13px 22px",borderRadius:6,fontWeight:700,textDecoration:"none",margin:"14px 12px 0 0"}
};

function DealerMeetManagementPage(){
  useEffect(()=>{
    document.title="Dealer Meet Management Company in India & Delhi NCR | ExpressEarth";
    const description="Plan dealer meets, distributor conferences and channel partner events with ExpressEarth. Venue, delegate travel, stage, AV, branding, hospitality and end-to-end event coordination.";
    let meta=document.querySelector('meta[name="description"]');
    if(!meta){meta=document.createElement("meta");meta.name="description";document.head.appendChild(meta);}
    meta.content=description;
    let canonical=document.querySelector('link[rel="canonical"]');
    if(!canonical){canonical=document.createElement("link");canonical.rel="canonical";document.head.appendChild(canonical);}
    canonical.href="https://www.expressearth.com/dealer-meet-management";
    const faqSchema={"@context":"https://schema.org","@type":"FAQPage","mainEntity":faqs.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}}))};
    const serviceSchema={"@context":"https://schema.org","@type":"Service",name:"Dealer Meet and Distributor Conference Management",provider:{"@type":"Organization",name:"ExpressEarth",url:"https://www.expressearth.com/"},"areaServed":["Delhi NCR","India"],serviceType:"Dealer meets, distributor conferences and channel partner events"};
    const script=document.createElement("script");script.type="application/ld+json";script.dataset.expressearthSeo="dealer-meet-management";script.text=JSON.stringify([faqSchema,serviceSchema]);document.head.querySelectorAll('script[data-expressearth-seo="dealer-meet-management"]').forEach(n=>n.remove());document.head.appendChild(script);
    return()=>script.remove();
  },[]);
  const wa="https://wa.me/918448185550?text="+encodeURIComponent("Hi ExpressEarth, we are planning a dealer meet/distributor conference. Please contact me to discuss our brief.");
  return <main style={styles.page}>
    <section style={styles.hero}><div style={{maxWidth:1120,margin:"0 auto"}}>
      <div style={{letterSpacing:".12em",fontSize:12,fontWeight:700,color:"#b9dfd7"}}>EXPRESSEARTH · CORPORATE EVENTS & CHANNEL ENGAGEMENT</div>
      <h1 style={styles.h1}>Dealer Meet Management Company in India</h1>
      <p style={{fontSize:19,maxWidth:820,color:"#e6eef4"}}>Bring your dealer and distributor network together around a business agenda that is organised, engaging and professionally delivered. ExpressEarth coordinates the event plan—from venue and delegate logistics to stage, AV, branding, hospitality and on-ground execution.</p>
      <a style={styles.cta} href={wa} target="_blank" rel="noreferrer">Discuss Your Dealer Meet</a><a href="tel:+918448185550" style={{...styles.cta,background:"transparent",border:"1px solid #b9cbd8",color:"#fff"}}>Call 84481 85550</a>
    </div></section>
    <section style={styles.wrap}>
      <h2 style={styles.h2}>A dealer meet is a business programme—not just a hotel event</h2>
      <p style={styles.muted}>The event needs to bring the right channel partners together, communicate business priorities, recognise performance and create a memorable experience. Our planning approach connects the business agenda with the delegate journey and the operating details behind the event.</p>
      <div style={styles.grid}>
        <article style={styles.card}><h3>Dealer conferences</h3><p>Leadership addresses, business reviews, market updates, product presentations and structured sessions.</p></article>
        <article style={styles.card}><h3>Distributor meets</h3><p>Partner engagement, network updates, relationship-building and recognition programmes.</p></article>
        <article style={styles.card}><h3>Product launches</h3><p>Launch staging, AV, content flow, demonstrations, branding and guest experience coordination.</p></article>
        <article style={styles.card}><h3>Awards & gala evenings</h3><p>Dealer recognition, awards, entertainment, dinner and celebration integrated into the programme.</p></article>
      </div>
    </section>
    <section style={{background:"#f2f6f6",padding:"42px 24px"}}><div style={{maxWidth:1120,margin:"0 auto"}}>
      <h2 style={styles.h2}>From the event brief to the final delegate departure</h2>
      <div style={styles.grid}>
        <div><img src={dealerHero} alt="ExpressEarth dealer meet event setup" style={styles.img}/><h3>Venue & hospitality</h3><p style={styles.muted}>Venue shortlist, room blocks, food and beverage, guest handling and hotel coordination.</p></div>
        <div><img src={dealerStage} alt="Dealer meet stage and event production" style={styles.img}/><h3>Stage, AV & branding</h3><p style={styles.muted}>Stage design, LED, sound, lighting, event branding and presentation flow matched to the brief.</p></div>
        <div><img src={dealerTeam} alt="ExpressEarth event operations team" style={styles.img}/><h3>Delegate & on-ground operations</h3><p style={styles.muted}>Travel manifests, transfers, registration, event-day coordination and issue escalation.</p></div>
      </div>
    </div></section>
    <section style={styles.wrap}>
      <h2 style={styles.h2}>Programme scale and operational discipline</h2>
      <p style={styles.muted}>ExpressEarth's programme profile documents delivery of a 5,000-person employee and family day inside a live automobile manufacturing plant, including programme governance, crowd flow, compliance and risk control. That experience reflects the importance of operational planning for complex, high-attendance corporate programmes. It is a separate event example, not a dealer-meet case study.</p>
      <div style={styles.grid}>
        <article style={styles.card}><h3>Before the event</h3><p>Brief capture, venue feasibility, budget framework, run-of-show, supplier plan and contingency review.</p></article>
        <article style={styles.card}><h3>During the event</h3><p>Delegate movement, supplier coordination, production cues, hospitality desk and live issue management.</p></article>
        <article style={styles.card}><h3>After the event</h3><p>Closure checklist, supplier reconciliation, feedback capture and documentation for the next programme.</p></article>
      </div>
    </section>
    <section style={{...styles.wrap,paddingTop:12}}>
      <h2 style={styles.h2}>Dealer meet planning FAQs</h2>
      {faqs.map(([q,a],i)=><details key={q} open={i===0} style={{padding:"16px 0",borderBottom:"1px solid #e5eaf0"}}><summary style={{fontWeight:700,cursor:"pointer"}}>{q}</summary><p style={styles.muted}>{a}</p></details>)}
    </section>
    <section style={styles.hero}><div style={{maxWidth:1120,margin:"0 auto"}}><h2 style={{...styles.h2,color:"#fff"}}>Planning a dealer meet this quarter?</h2><p style={{fontSize:18,color:"#e6eef4"}}>Share your delegate count, dates, preferred city and business objective. We will take it from there.</p><a style={styles.cta} href={wa} target="_blank" rel="noreferrer">Send Your Brief on WhatsApp</a></div></section>
  </main>;
}
export default DealerMeetManagementPage;
