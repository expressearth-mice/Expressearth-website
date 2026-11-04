import React from "react";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axiosInstance from "../api/axios";
import Home from "./Home";

jest.mock("./popupForm", () => () => null);
jest.mock("../api/axios", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));
jest.mock("./ui/IntegrationTools", () => () => null);
jest.mock("./ui/HorizontalSlider", () => {
  const React = require("react");
  return function MockHorizontalSlider({ children }) {
    return React.createElement("div", null, children);
  };
});

describe("Home priority MICE navigation", () => {
  beforeEach(() => {
    axiosInstance.get.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("exposes priority corporate programme links below the hero", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /corporate mice programmes for delhi ncr teams/i,
      }),
    ).toBeInTheDocument();

    const navigation = screen.getByRole("navigation", {
      name: /priority corporate mice services/i,
    });

    const expectedLinks = [
      ["Meetings & Conferences", "/meetings-and-conferences"],
      ["Incentive Travel", "/incentive-travel"],
      ["Dealer & Distributor Meets", "/dealermeet"],
      ["Corporate Offsites", "/corporateoffsites"],
    ];

    expectedLinks.forEach(([label, href]) => {
      expect(
        within(navigation).getByRole("link", {
          name: new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
        }),
      ).toHaveAttribute("href", href);
    });

    expect(
      screen.getByRole("link", { name: /share your corporate brief/i }),
    ).toHaveAttribute("href", "/contact");
    expect(
      screen.getByRole("link", { name: /view all mice services/i }),
    ).toHaveAttribute("href", "/mice-services");
  });
});
