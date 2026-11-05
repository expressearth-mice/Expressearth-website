import {
  buildConfirmedLeadEventParams,
  trackConfirmedLead,
} from "./leadTracking";

describe("confirmed lead tracking", () => {
  test("keeps attribution context and strips referrer query strings and fragments", () => {
    const params = buildConfirmedLeadEventParams({
      serviceType: "international_group_travel",
      formLocation: "faq_question",
      pagePath: "/internationalgrouptravel",
      referrer: "https://www.expressearth.com/mice-services?email=private@example.com#contact",
    });

    expect(params).toEqual({
      event_category: "lead_generation",
      service_type: "international_group_travel",
      form_location: "faq_question",
      page_path: "/internationalgrouptravel",
      page_referrer: "https://www.expressearth.com/mice-services",
    });
    expect(params).not.toHaveProperty("email");
    expect(params).not.toHaveProperty("phone");
    expect(params).not.toHaveProperty("name");
  });

  test("maps the contact form's visible event choices to controlled service types", () => {
    const cases = [
      ["Conference", "conference_management"],
      ["Incentive Trip", "incentive_travel"],
      ["Corporate Meeting", "corporate_meeting"],
      ["Exhibition", "exhibitions"],
      ["Product Launch", "corporate_events"],
      ["Other", "corporate_mice"],
    ];

    cases.forEach(([input, expected]) => {
      expect(
        buildConfirmedLeadEventParams({ serviceType: input }).service_type,
      ).toBe(expected);
    });
  });

  test("maps the optional contact-form service detail to a fixed GA4 service category", () => {
    const cases = [
      ["Incentive Travel", "incentive_travel"],
      ["Dealer & Distributor Meet", "dealer_meet"],
      ["Corporate Offsite", "corporate_offsite"],
      ["Conference Management", "conference_management"],
      ["Corporate Event / Product Launch", "corporate_events"],
      ["Rewards & Recognition", "recognition_rewards"],
      ["Exhibition / Trade Show", "exhibitions"],
      ["International Group Travel", "international_group_travel"],
      ["Destination Management", "destination_management"],
      ["Not sure yet", "corporate_mice"],
    ];

    cases.forEach(([input, expected]) => {
      expect(
        buildConfirmedLeadEventParams({ serviceType: input }).service_type,
      ).toBe(expected);
    });
  });

  test("replaces unrecognised and inherited service labels with safe defaults", () => {
    const params = buildConfirmedLeadEventParams({
      serviceType: "person@example.com",
      formLocation: "person@example.com",
    });

    expect(params.service_type).toBe("corporate_mice");
    expect(params.form_location).toBe("primary");
    expect(JSON.stringify(params)).not.toContain("person@example.com");

    ["constructor", "toString", "__proto__"].forEach((serviceType) => {
      expect(
        buildConfirmedLeadEventParams({ serviceType }).service_type,
      ).toBe("corporate_mice");
    });
  });

  test("keeps the contact page as a valid form location", () => {
    const params = buildConfirmedLeadEventParams({
      serviceType: "corporate_mice",
      formLocation: "contact_page",
    });

    expect(params.form_location).toBe("contact_page");
  });

  test("omits an invalid referrer", () => {
    const params = buildConfirmedLeadEventParams({
      serviceType: "incentive_travel",
      referrer: "not-a-url",
    });

    expect(params).not.toHaveProperty("page_referrer");
  });

  test("does not send query strings, fragments, email addresses or phone numbers in page paths", () => {
    const unsafePaths = [
      "/contact?email=private@example.com",
      "/profiles/person%40example.com",
      "/contact/9876543210",
      "/profiles/user9876543210",
      "https://www.expressearth.com/contact",
    ];

    unsafePaths.forEach((pagePath) => {
      expect(
        buildConfirmedLeadEventParams({ pagePath }).page_path,
      ).toBe("/");
    });
  });

  test("redacts personal-looking referrer paths while retaining the referrer origin", () => {
    const params = buildConfirmedLeadEventParams({
      serviceType: "dealer_meet",
      referrer: "https://www.expressearth.com/contact/person%40example.com?token=private",
    });

    expect(params.page_referrer).toBe("https://www.expressearth.com/");
    expect(JSON.stringify(params)).not.toContain("person@example.com");
    expect(JSON.stringify(params)).not.toContain("private");
  });

  test("pushes the recommended generate_lead event without contact details", () => {
    const originalGtag = window.gtag;
    window.gtag = jest.fn();

    try {
      expect(
        trackConfirmedLead({
          serviceType: "recognition_rewards",
          formLocation: "primary",
        }),
      ).toBe(true);
      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "generate_lead",
        expect.objectContaining({
          event_category: "lead_generation",
          service_type: "recognition_rewards",
          form_location: "primary",
        }),
      );
      const params = window.gtag.mock.calls[0][2];
      expect(params).not.toHaveProperty("email");
      expect(params).not.toHaveProperty("phone");
    } finally {
      if (originalGtag === undefined) {
        delete window.gtag;
      } else {
        window.gtag = originalGtag;
      }
    }
  });

  test("does not throw or claim tracking when gtag is unavailable", () => {
    const originalGtag = window.gtag;
    delete window.gtag;

    try {
      expect(trackConfirmedLead({ serviceType: "incentive_travel" })).toBe(false);
    } finally {
      if (originalGtag !== undefined) window.gtag = originalGtag;
    }
  });
});
