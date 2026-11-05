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

  test("records the originating service page separately from the contact submission page", () => {
    const params = buildConfirmedLeadEventParams({
      serviceType: "incentive_travel",
      formLocation: "service_page",
      pagePath: "/contact",
      serviceSourcePage: "/incentive-travel",
    });

    expect(params).toMatchObject({
      service_type: "incentive_travel",
      form_location: "service_page",
      page_path: "/contact",
      service_source_page: "/incentive-travel",
    });
  });

  test("records the originating page for dedicated dealer, offsite and conference forms", () => {
    const cases = [
      ["dealer_meet", "/dealermeet"],
      ["corporate_offsite", "/corporateoffsites"],
      ["conference_management", "/conferencemanagement"],
    ];

    cases.forEach(([serviceType, serviceSourcePage]) => {
      const params = buildConfirmedLeadEventParams({
        serviceType,
        formLocation: "primary",
        pagePath: serviceSourcePage,
        serviceSourcePage,
      });

      expect(params).toMatchObject({
        service_type: serviceType,
        page_path: serviceSourcePage,
        service_source_page: serviceSourcePage,
      });
    });
  });

  test("omits unrecognised or personal-looking service source paths", () => {
    const params = buildConfirmedLeadEventParams({
      serviceType: "incentive_travel",
      serviceSourcePage: "/contact?email=private@example.com",
    });

    expect(params).not.toHaveProperty("service_source_page");
    expect(JSON.stringify(params)).not.toContain("private@example.com");
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

  test("forwards a fixed service-page origin to the confirmed lead event", () => {
    const originalGtag = window.gtag;
    window.gtag = jest.fn();

    try {
      trackConfirmedLead({
        serviceType: "dealer_meet",
        formLocation: "primary",
        serviceSourcePage: "/dealermeet",
      });

      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "generate_lead",
        expect.objectContaining({
          service_type: "dealer_meet",
          service_source_page: "/dealermeet",
        }),
      );
    } finally {
      if (originalGtag === undefined) {
        delete window.gtag;
      } else {
        window.gtag = originalGtag;
      }
    }
  });

  test("uses only an allowlisted current service route when a form does not pass an explicit source", () => {
    const originalPath = window.location.pathname;
    const originalGtag = window.gtag;
    window.gtag = jest.fn();

    try {
      window.history.pushState({}, "", "/incentivetravel");
      trackConfirmedLead({
        serviceType: "incentive_travel",
        formLocation: "popup",
      });

      expect(window.gtag).toHaveBeenLastCalledWith(
        "event",
        "generate_lead",
        expect.objectContaining({
          page_path: "/incentivetravel",
          service_source_page: "/incentivetravel",
        }),
      );

      window.history.pushState({}, "", "/contact");
      window.gtag.mockClear();
      trackConfirmedLead({
        serviceType: "incentive_travel",
        formLocation: "popup",
      });

      const contactPageParams = window.gtag.mock.calls[0][2];
      expect(contactPageParams.page_path).toBe("/contact");
      expect(contactPageParams).not.toHaveProperty("service_source_page");
    } finally {
      window.history.pushState({}, "", originalPath);
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
