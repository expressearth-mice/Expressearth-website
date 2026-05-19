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

export const trackFormSubmit = (formData) => {
  fbPixelEvent("Submit", {
    content_name: formData.name || "Form Submission",
    content_category: formData.category || "form",
    ...formData,
  });
};

export const trackContact = (contactData) => {
  fbPixelEvent("Contact", {
    content_name: contactData.name || "",
    phone_number: contactData.phone || "",
    email: contactData.email || "",
    ...contactData,
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
