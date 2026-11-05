import { validateCorporateEnquiryBrief } from "./corporateEnquiryValidation";

describe("validateCorporateEnquiryBrief", () => {
  test("requires a company or organisation and a programme type", () => {
    expect(validateCorporateEnquiryBrief({})).toEqual({
      company_name: "Please enter your company or organisation.",
      event_type: "Please select a programme type.",
    });
  });

  test("rejects whitespace-only company names", () => {
    expect(
      validateCorporateEnquiryBrief({
        company_name: "   ",
        event_type: "Conference",
      }),
    ).toEqual({
      company_name: "Please enter your company or organisation.",
    });
  });

  test("requires a selected programme type", () => {
    expect(
      validateCorporateEnquiryBrief({
        company_name: "Example Organisation",
        event_type: "",
      }),
    ).toEqual({
      event_type: "Please select a programme type.",
    });
  });

  test("accepts an organisation and any existing non-empty event type", () => {
    expect(
      validateCorporateEnquiryBrief({
        company_name: "Example Organisation",
        event_type: "Other",
      }),
    ).toEqual({});
  });

  test("handles null and non-string field values safely", () => {
    expect(
      validateCorporateEnquiryBrief({
        company_name: null,
        event_type: 12,
      }),
    ).toEqual({
      company_name: "Please enter your company or organisation.",
      event_type: "Please select a programme type.",
    });
  });
});
