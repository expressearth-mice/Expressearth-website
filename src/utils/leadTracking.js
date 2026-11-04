const safeReferrerPath = (value) => {
  if (!value) return "";

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
};

export const buildConfirmedLeadEventParams = ({
  serviceType,
  formLocation = "primary",
  pagePath = "/",
  referrer = "",
}) => {
  const params = {
    event_category: "lead_generation",
    service_type: String(serviceType || "unspecified"),
    form_location: String(formLocation || "primary"),
    page_path: String(pagePath || "/"),
  };
  const pageReferrer = safeReferrerPath(referrer);

  if (pageReferrer) params.page_referrer = pageReferrer;
  return params;
};

export const trackConfirmedLead = ({
  serviceType,
  formLocation = "primary",
} = {}) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return false;
  }

  const params = buildConfirmedLeadEventParams({
    serviceType,
    formLocation,
    pagePath: window.location?.pathname || "/",
    referrer: typeof document === "undefined" ? "" : document.referrer,
  });

  window.gtag("event", "generate_lead", params);
  return true;
};
