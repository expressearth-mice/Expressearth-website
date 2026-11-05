import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import IncentiveTravel from "./IncentiveTravel";

jest.mock("./ui/HorizontalSlider", () => {
  const React = require("react");
  return function MockHorizontalSlider({ children }) {
    return React.createElement("div", null, children);
  };
});

jest.mock("./ServiceStructuredData", () => () => null);

describe("IncentiveTravel enquiry links", () => {
  test("keeps every offer-card enquiry CTA on the incentive-travel brief", () => {
    render(
      <MemoryRouter initialEntries={["/incentive-travel"]}>
        <IncentiveTravel />
      </MemoryRouter>
    );

    [
      "Ready to Reward Your Team?",
      "Inspire Peak Sales Performance",
      "Let’s Build Something Special",
      "Travel in Style",
    ].forEach((label) => {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        "/contact?service=incentive_travel"
      );
    });
  });

  test("keeps destination discovery links pointed to the destinations hub", () => {
    render(
      <MemoryRouter initialEntries={["/incentive-travel"]}>
        <IncentiveTravel />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Explore Tour Options" })).toHaveAttribute(
      "href",
      "/destinations"
    );
    expect(screen.getByRole("link", { name: "Discover Your Next Retreat" })).toHaveAttribute(
      "href",
      "/destinations"
    );
  });
});
