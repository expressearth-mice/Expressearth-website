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
});
