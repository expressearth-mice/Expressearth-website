const SAFE_SERVICE_TYPES = new Set([
  "corporate_mice",
  "conference_management",
  "incentive_travel",
  "corporate_meeting",
  "exhibitions",
  "corporate_events",
  "dealer_meet",
  "corporate_offsite",
  "international_group_travel",
  "recognition_rewards",
  "popup_mice_enquiry",
]);

const SERVICE_TYPE_ALIASES = {
  conference: "conference_management",
  "incentive trip": "incentive_travel",
  "corporate meeting": "corporate_meeting",
  exhibition: "exhibitions",
  "product launch": "corporate_events",
  other: "corporate_mice",
};

const SAFE_FORM_LOCATIONS = new Set([
  "primary",
  "faq_question",
  "popup",
  "contact_page",
]);

const safeServiceType = (value) => {
  if (typeof value !== "string") return "corporate_mice";

  const normalized = value.trim().toLowerCase();
  const alias = Object.prototype.hasOwnProperty.call(
    SERVICE_TYPE_ALIASES,
    normalized,
  )
    ? SERVICE_TYPE_ALIASES[normalized]
    : null;

  return alias || (SAFE_SERVICE_TYPES.has(normalized) ? normalized : "corporate_mice");
};

const safeFormLocation = (value) =>
  SAFE_FORM_LOCATIONS.has(value) ? value : "primary";

const decodePathSegment = (value) => {
  let decoded = value;

  // Decode twice so a double-encoded email or phone number is still detected.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }

  return decoded;
};

const hasSensitivePathSegment = (segment) => {
  const decoded = decodePathSegment(segment);
  const numericRuns =
    decoded.match(/(?:^|[^A-Za-z])[+]?[0-9][0-9(). -]*[0-9](?:$|[^A-Za-z])/g) || [];
  const containsLongDigitRun = /[0-9]{9,}/.test(decoded);
  const containsPhone =
    containsLongDigitRun ||
    numericRuns.some((run) => (run.match(/[0-9]/g) || []).length >= 9);
  const containsControlCharacter = Array.from(decoded).some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });

  return decoded.includes("@") || containsPhone || containsControlCharacter;
};

const safePagePath = (value) => {
  if (typeof value !== "string") return "/";

  const path = value.trim();
  const containsControlCharacter = Array.from(path).some((character) => {
    const code = character.charCodeAt(0);
    return code <= 31 || code === 127;
  });

  if (
    !path ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.length > 240 ||
    path.includes("?") ||
    path.includes("#") ||
    path.includes("\\") ||
    containsControlCharacter
  ) {
    return "/";
  }

  return path.split("/").some(hasSensitivePathSegment) ? "/" : path;
};

const safeReferrerPath = (value) => {
  if (!value) return "";

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.origin + safePagePath(url.pathname);
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
    service_type: safeServiceType(serviceType),
    form_location: safeFormLocation(formLocation),
    page_path: safePagePath(pagePath),
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
