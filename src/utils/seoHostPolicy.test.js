import { isExpressEarthProductionHost } from "./seoHostPolicy";

describe("isExpressEarthProductionHost", () => {
  test("accepts the apex and preferred www production hosts", () => {
    expect(isExpressEarthProductionHost("expressearth.com")).toBe(true);
    expect(isExpressEarthProductionHost("www.expressearth.com")).toBe(true);
  });

  test("normalizes host case and an optional trailing dot", () => {
    expect(isExpressEarthProductionHost("WWW.ExpressEarth.com.")).toBe(true);
  });

  test("keeps development, local and Cloud Run hosts out of the index", () => {
    expect(isExpressEarthProductionHost("dev.expressearth.com")).toBe(false);
    expect(isExpressEarthProductionHost("localhost")).toBe(false);
    expect(isExpressEarthProductionHost("express-earth-stage-123.run.app")).toBe(false);
  });

  test("rejects empty and non-string values", () => {
    expect(isExpressEarthProductionHost("")).toBe(false);
    expect(isExpressEarthProductionHost(null)).toBe(false);
  });
});
