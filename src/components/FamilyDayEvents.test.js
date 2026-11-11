import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FamilyDayEvents from "./FamilyDayEvents";

jest.mock("./ServiceStructuredData", () => () => null);

describe("employee family day service page", () => {
  test("explains the service and provides a relevant enquiry path", () => {
    render(<MemoryRouter><FamilyDayEvents /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1, name: /employee family day event management in delhi ncr/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /plan your company family day/i })).toHaveAttribute("href", "/contact?service=family_day_events");
    expect(screen.getByRole("heading", { name: /corporate family day formats/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /employee family day event faqs/i })).toBeInTheDocument();
  });

  test("publishes FAQ structured data matching the visible questions", () => {
    const { container } = render(<MemoryRouter><FamilyDayEvents /></MemoryRouter>);
    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script.textContent);
    const visibleQuestions = Array.from(container.querySelectorAll("details summary")).map((summary) => summary.textContent);
    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity.map((item) => item.name)).toEqual(visibleQuestions);
    expect(schema.mainEntity).toHaveLength(5);
  });
});
