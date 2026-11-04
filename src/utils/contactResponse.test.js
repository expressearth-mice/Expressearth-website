import { isSuccessfulContactResponse } from "./contactResponse";

describe("isSuccessfulContactResponse", () => {
  test("accepts a boolean success response", () => {
    expect(isSuccessfulContactResponse({ data: { success: true } })).toBe(true);
  });

  test("accepts a non-empty success string", () => {
    expect(isSuccessfulContactResponse({ data: { success: "true" } })).toBe(true);
  });

  test("rejects boolean false", () => {
    expect(isSuccessfulContactResponse({ data: { success: false } })).toBe(false);
  });

  test("rejects the string false", () => {
    expect(isSuccessfulContactResponse({ data: { success: " false " } })).toBe(false);
  });

  test("rejects missing, empty and null responses", () => {
    expect(isSuccessfulContactResponse({ data: {} })).toBe(false);
    expect(isSuccessfulContactResponse({ data: { success: "" } })).toBe(false);
    expect(isSuccessfulContactResponse(null)).toBe(false);
  });
});
