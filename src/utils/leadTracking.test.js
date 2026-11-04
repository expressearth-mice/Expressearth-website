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

  test("omits an invalid referrer", () => {
    const params = buildConfirmedLeadEventParams({
      serviceType: "incentive_travel",
      referrer: "not-a-url",
    });

    expect(params).not.toHaveProperty("page_referrer");
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
