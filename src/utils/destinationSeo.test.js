import { buildDestinationSeoMetadata } from "./destinationSeo";

describe("buildDestinationSeoMetadata", () => {
  test("returns null when a destination name is unavailable", () => {
    expect(buildDestinationSeoMetadata("")).toBeNull();
    expect(buildDestinationSeoMetadata(null)).toBeNull();
  });

  test("creates destination-specific corporate travel metadata", () => {
    expect(buildDestinationSeoMetadata("Bali")).toEqual({
      title: "Corporate Group Travel in Bali | ExpressEarth",
      description:
        "Corporate group travel and incentive programme planning for Bali. Discuss hotels, transfers, activities and on-ground logistics with ExpressEarth.",
    });
  });

  test("trims whitespace from the destination name", () => {
    expect(buildDestinationSeoMetadata("  Singapore  ").title).toBe(
      "Corporate Group Travel in Singapore | ExpressEarth"
    );
  });
});
