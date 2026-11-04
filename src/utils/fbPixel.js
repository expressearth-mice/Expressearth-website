// Facebook Pixel Utility
// Use these functions to track events across your application

export const fbPixelEvent = (eventName, data = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, data);
  }
};

// Standard Facebook Events
export const trackPageView = () => {
  fbPixelEvent("PageView");
};

export const trackViewContent = (contentData) => {
  fbPixelEvent("ViewContent", {
    content_ids: contentData.ids || [],
    content_name: contentData.name || "",
    content_type: contentData.type || "product",
    value: contentData.value || "",
    currency: contentData.currency || "USD",
    ...contentData,
  });
};

export const trackAddToCart = (cartData) => {
  fbPixelEvent("AddToCart", {
    content_ids: cartData.ids || [],
    content_name: cartData.name || "",
    content_type: cartData.type || "product",
    value: cartData.value || "",
    currency: cartData.currency || "USD",
    ...cartData,
  });
};

export const trackInitiateCheckout = (checkoutData) => {
  fbPixelEvent("InitiateCheckout", {
    content_ids: checkoutData.ids || [],
    content_name: checkoutData.name || "",
    content_type: checkoutData.type || "product",
    value: checkoutData.value || "",
    currency: checkoutData.currency || "USD",
    ...checkoutData,
  });
};

export const trackPurchase = (purchaseData) => {
  fbPixelEvent("Purchase", {
    content_ids: purchaseData.ids || [],
    content_name: purchaseData.name || "",
    content_type: purchaseData.type || "product",
    value: purchaseData.value || "",
    currency: purchaseData.currency || "USD",
    ...purchaseData,
  });
};

export const trackLead = (leadData) => {
  fbPixelEvent("Lead", {
    content_name: leadData.name || "",
    content_category: leadData.category || "",
    ...leadData,
  });
};

export const trackCompleteRegistration = (registrationData) => {
  fbPixelEvent("CompleteRegistration", {
    status: registrationData.status || "completed",
    ...registrationData,
  });
};

export const trackAddPaymentInfo = (paymentData) => {
  fbPixelEvent("AddPaymentInfo", {
    content_category: paymentData.category || "",
    ...paymentData,
  });
};

export const trackSearch = (searchData) => {
  fbPixelEvent("Search", {
    search_string: searchData.query || "",
    ...searchData,
  });
};

const safeEventLabel = (value, fallback) => {
  const label = String(value ?? "").trim();
  return /^[a-zA-Z0-9_-]{1,64}$/.test(label) ? label : fallback;
};

// Only send non-identifying event context to advertising platforms.
// Never forward names, email addresses, phone numbers, company names or form text.
export const trackFormSubmit = (formData = {}) => {
  fbPixelEvent("Submit", {
    content_name: "Form Submission",
    content_category: safeEventLabel(formData.category || formData.type, "form"),
    form_location: safeEventLabel(formData.form_location, "primary"),
  });
};

export const trackContact = (contactData = {}) => {
  fbPixelEvent("Contact", {
    content_name: "Corporate MICE enquiry",
    content_category: safeEventLabel(
      contactData.service_type || contactData.type,
      "corporate_mice",
    ),
    form_location: safeEventLabel(contactData.form_location, "primary"),
  });
};

export const trackDownload = (downloadData) => {
  fbPixelEvent("Download", {
    content_name: downloadData.name || "",
    content_type: downloadData.type || "file",
    ...downloadData,
  });
};

export const trackViewCategory = (categoryData) => {
  fbPixelEvent("ViewCategory", {
    content_name: categoryData.name || "",
    content_category: categoryData.category || "",
    ...categoryData,
  });
};

export const trackCustomEvent = (eventName, eventData) => {
  fbPixelEvent(eventName, eventData);
};
