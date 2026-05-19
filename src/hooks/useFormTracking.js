import { trackFormSubmit, trackContact, fbPixelEvent } from "../utils/fbPixel";

export const useFormTracking = (formName = "Form Submission", eventType = "Submit") => {
  const trackSubmit = (formData = {}) => {
    try {
      const trackingData = {
        name: formName,
        category: eventType,
        timestamp: new Date().toISOString(),
        ...formData,
      };

      if (eventType === "Submit" || eventType === "contact") {
        trackFormSubmit(trackingData);
      } else if (eventType === "Contact") {
        trackContact(trackingData);
      } else {
        fbPixelEvent(eventType, trackingData);
      }

      console.log(`✅ Tracked: ${formName} (${eventType})`);
    } catch (error) {
      console.error("Facebook Pixel tracking error:", error);
    }
  };

  return { trackSubmit };
};
