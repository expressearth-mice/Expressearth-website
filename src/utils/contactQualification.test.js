import { buildContactRequirements, getContactFormPrefill, getContactFormSourcePage } from "./contactQualification";

describe("buildContactRequirements", () => {
  test("preserves existing requirements when no planning stage is selected", () => {
    expect(buildContactRequirements({ requirements: "Need a conference in Delhi." })).toBe(
      "Need a conference in Delhi."
    );
  });

  test("adds an allowlisted programme detail to the existing requirements field", () => {
    expect(
      buildContactRequirements({
        programmeDetail: "Dealer & Distributor Meet",
        projectStage: "Active brief / RFQ",
        requirements: "Around 150 delegates.",
      })
    ).toBe(
      "Programme detail: Dealer & Distributor Meet\n\nPlanning stage: Active brief / RFQ\n\nAround 150 delegates."
    );
  });

  test("ignores programme detail values outside the form's fixed service list", () => {
    expect(
      buildContactRequirements({
        programmeDetail: "person@example.com",
        requirements: "Need a conference.",
      })
    ).toBe("Need a conference.");
  });

  test("adds the selected planning stage to the existing requirements field", () => {
    expect(
      buildContactRequirements({
        projectStage: "Active brief / RFQ",
        requirements: "Around 150 delegates; dates are being finalised.",
      })
    ).toBe(
      "Planning stage: Active brief / RFQ\n\nAround 150 delegates; dates are being finalised."
    );
  });

  test("supports a planning stage without free-text requirements", () => {
    expect(
      buildContactRequirements({ projectStage: "Upcoming programme; exploring options" })
    ).toBe("Planning stage: Upcoming programme; exploring options");
  });

  test("returns an empty string when both optional inputs are empty", () => {
    expect(buildContactRequirements()).toBe("");
  });

  test("ignores non-string values safely", () => {
    expect(buildContactRequirements({ projectStage: 12, requirements: null })).toBe("");
  });

  test("trims outer whitespace without changing the meaning of either field", () => {
    expect(
      buildContactRequirements({
        projectStage: "  Early planning  ",
        requirements: "  Annual sales conference  ",
      })
    ).toBe("Planning stage: Early planning\n\nAnnual sales conference");
  });
});

describe("getContactFormPrefill", () => {
  test("maps commercial service links to existing API programme types and optional service details", () => {
    const cases = [
      ["corporate_mice", { event_type: "Other", programme_detail: "Not sure yet" }],
      ["incentive_travel", { event_type: "Incentive Trip", programme_detail: "Incentive Travel" }],
      ["dealer_meet", { event_type: "Other", programme_detail: "Dealer & Distributor Meet" }],
      ["corporate_offsite", { event_type: "Other", programme_detail: "Corporate Offsite" }],
      ["conference_management", { event_type: "Conference", programme_detail: "Conference Management" }],
      ["corporate_events", { event_type: "Product Launch", programme_detail: "Corporate Event / Product Launch" }],
      ["family_day_events", { event_type: "Other", programme_detail: "Employee & Family Day" }],
      ["recognition_rewards", { event_type: "Other", programme_detail: "Rewards & Recognition" }],
      ["exhibitions", { event_type: "Exhibition", programme_detail: "Exhibition / Trade Show" }],
      ["international_group_travel", { event_type: "Other", programme_detail: "International Group Travel" }],
      ["destination_management", { event_type: "Other", programme_detail: "Destination Management" }],
    ];

    cases.forEach(([service, expected]) => {
      expect(getContactFormPrefill(`?service=${service}`)).toEqual(expected);
    });
  });

  test("ignores unknown, inherited and personal-looking service query values", () => {
    ["unknown", "constructor", "toString", "person%40example.com"].forEach((service) => {
      expect(getContactFormPrefill(`?service=${service}`)).toEqual({});
    });
    expect(getContactFormPrefill("")).toEqual({});
    expect(getContactFormPrefill(null)).toEqual({});
  });
});


describe("getContactFormSourcePage", () => {
  test("returns fixed source paths for the four service-aware landing pages", () => {
    const cases = [
      ["corporate_mice", "/mice-services"],
      ["incentive_travel", "/incentive-travel"],
      ["conference_management", "/meetings-and-conferences"],
      ["corporate_events", "/corporate-events"],
      ["family_day_events", "/family-day-events"],
    ];

    cases.forEach(([service, expected]) => {
      expect(getContactFormSourcePage(`?service=${service}`)).toBe(expected);
    });
  });

  test("ignores unknown, inherited and personal-looking service values", () => {
    ["unknown", "constructor", "toString", "person%40example.com"].forEach((service) => {
      expect(getContactFormSourcePage(`?service=${service}`)).toBe("");
    });
    expect(getContactFormSourcePage("")).toBe("");
    expect(getContactFormSourcePage(null)).toBe("");
  });

  test("returns only the fixed page path when unrelated query parameters are present", () => {
    expect(getContactFormSourcePage("?service=incentive_travel&email=private%40example.com")).toBe("/incentive-travel");
  });
});
