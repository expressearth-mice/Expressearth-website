import { trackContact, trackFormSubmit } from "./fbPixel";

describe("privacy-safe Meta Pixel form events", () => {
  const originalFbq = window.fbq;

  beforeEach(() => {
    window.fbq = jest.fn();
  });

  afterEach(() => {
    if (originalFbq === undefined) {
      delete window.fbq;
    } else {
      window.fbq = originalFbq;
    }
  });

  test("contact events omit names, email, phone and company details", () => {
    trackContact({
      name: "Private Person",
      email: "person@example.com",
      phone: "+919999999999",
      company: "Private Company",
      type: "DealerMeet",
    });

    expect(window.fbq).toHaveBeenCalledWith("track", "Contact", {
      content_name: "Corporate MICE enquiry",
      content_category: "DealerMeet",
      form_location: "primary",
    });
    const payload = JSON.stringify(window.fbq.mock.calls[0][2]);
    expect(payload).not.toContain("Private Person");
    expect(payload).not.toContain("person@example.com");
    expect(payload).not.toContain("+919999999999");
    expect(payload).not.toContain("Private Company");
  });

  test("form submission events omit email and free-text fields", () => {
    trackFormSubmit({
      name: "Newsletter Subscription",
      email: "person@example.com",
      message: "Please call me",
      type: "DealerMeet_Email",
      form_location: "newsletter",
    });

    expect(window.fbq).toHaveBeenCalledWith("track", "Submit", {
      content_name: "Form Submission",
      content_category: "DealerMeet_Email",
      form_location: "newsletter",
    });
    const payload = JSON.stringify(window.fbq.mock.calls[0][2]);
    expect(payload).not.toContain("person@example.com");
    expect(payload).not.toContain("Please call me");
  });

  test("unsafe labels are replaced with a safe fallback", () => {
    trackContact({
      type: "person@example.com",
      form_location: "person@example.com",
    });

    expect(window.fbq).toHaveBeenCalledWith("track", "Contact", {
      content_name: "Corporate MICE enquiry",
      content_category: "corporate_mice",
      form_location: "primary",
    });
  });
});
