import { buildContactRequirements } from "./contactQualification";

describe("buildContactRequirements", () => {
  test("preserves existing requirements when no planning stage is selected", () => {
    expect(buildContactRequirements({ requirements: "Need a conference in Delhi." })).toBe(
      "Need a conference in Delhi."
    );
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
