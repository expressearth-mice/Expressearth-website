import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axiosInstance from "../api/axios";
import Home from "./Home";

jest.mock("./popupForm", () => {
  const React = require("react");
  return ({ onClose }) =>
    React.createElement(
      "div",
      { "data-testid": "popup-form" },
      React.createElement(
        "button",
        { type: "button", onClick: onClose },
        "Close mock popup",
      ),
    );
});
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
      ["Corporate Events", "/corporate-events"],
      ["Exhibitions & Trade Shows", "/exhibitions-and-trade-shows"],
    ];

    expectedLinks.forEach(([label, href]) => {
      expect(
        within(navigation).getByRole("link", {
          name: new RegExp(label, "i"),
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
  test("keeps the enquiry popup opt-in and restores its launcher after closing", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("popup-form")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /open the expressearth enquiry form/i,
      }),
    );
    expect(screen.getByTestId("popup-form")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Close mock popup" }),
    );
    expect(screen.queryByTestId("popup-form")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /open the expressearth enquiry form/i,
      }),
    ).toBeInTheDocument();
  });

});
