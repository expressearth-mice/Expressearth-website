import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MiceServices from "./MiceService";

jest.mock("./ServiceStructuredData", () => () => null);

describe("MICE services hub discovery", () => {
  beforeEach(() => {
    jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    window.scrollTo.mockRestore();
  });

  test("uses the observed Gurugram MICE company phrasing and prioritises its decorative hero image", () => {
    const { container } = render(
      <MemoryRouter>
        <MiceServices />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /corporate mice company in gurugram \(gurgaon\)/i,
      }),
    ).toBeInTheDocument();

    const heroImage = container.querySelector(".mice-services-hero-image");
    expect(heroImage).toHaveAttribute("src", "/Images/Expressearth%20website%20images/Our-Services/services.png");
    expect(heroImage).toHaveAttribute("alt", "");
    expect(heroImage).toHaveAttribute("loading", "eager");
    expect(heroImage).toHaveAttribute("decoding", "async");
    expect(heroImage).toHaveAttribute("fetchpriority", "high");
  });

  test("links the service hub to the existing rewards and recognition page", () => {
    render(
      <MemoryRouter>
        <MiceServices />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /rewards & recognition/i }),
    ).toHaveAttribute("href", "/r&rplanning");
  });

  test("explains the Gurugram and Delhi NCR service context", () => {
    render(
      <MemoryRouter>
        <MiceServices />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /gurugram-based corporate mice planning across delhi ncr/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Delhi, Noida, Faridabad and Ghaziabad/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /what should a corporate mice brief include/i,
      }),
    ).toBeInTheDocument();
  });


  test("answers common corporate MICE questions with links to relevant services", () => {
    render(
      <MemoryRouter>
        <MiceServices />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /corporate mice planning: common questions/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/venue sourcing, group travel, accommodation, event production and on-ground logistics/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /meetings and conferences/i }),
    ).toHaveAttribute("href", "/meetings-and-conferences");
    expect(
      screen.getByRole("link", { name: /share your corporate mice brief/i }),
    ).toHaveAttribute("href", "/contact");
  });

  test("publishes FAQPage JSON-LD that mirrors the visible MICE questions", () => {
    const { container } = render(
      <MemoryRouter>
        <MiceServices />
      </MemoryRouter>,
    );

    const faqScript = container.querySelector('script[type="application/ld+json"]');
    expect(faqScript).toBeInTheDocument();

    const schema = JSON.parse(faqScript.textContent);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("FAQPage");

    const visibleQuestions = Array.from(
      container.querySelectorAll(".mice-services-faq-item summary"),
    ).map((summary) => summary.textContent);

    expect(schema.mainEntity.map((question) => question.name)).toEqual(visibleQuestions);
    expect(schema.mainEntity).toHaveLength(5);
    expect(schema.mainEntity[0].acceptedAnswer.text).toContain(
      "Meetings, Incentives, Conferences and Exhibitions",
    );
    expect(
      schema.mainEntity.every((question) => Boolean(question.acceptedAnswer?.text)),
    ).toBe(true);
  });

});
