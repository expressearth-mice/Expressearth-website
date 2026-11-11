export const validateCorporateEnquiryBrief = (formData = {}) => {
  const details = formData && typeof formData === "object" ? formData : {};
  const companyName =
    typeof details.company_name === "string" ? details.company_name.trim() : "";
  const eventType =
    typeof details.event_type === "string" ? details.event_type.trim() : "";
  const errors = {};

  if (!companyName) {
    errors.company_name = "Please enter your company or organisation.";
  }

  if (!eventType) {
    errors.event_type = "Please select a programme type.";
  }

  return errors;
};
