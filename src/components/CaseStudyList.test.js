import React from "react";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axiosInstance from "../api/axios";
import CaseStudyList from "./CaseStudyList";

jest.mock("../api/axios", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock("./Skeleton", () => () => null);

const renderList = () =>
  render(
    <MemoryRouter>
      <CaseStudyList />
    </MemoryRouter>,
  );

describe("CaseStudyList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders case-study images with deferred decoding and lazy loading", async () => {
    axiosInstance.get
      .mockResolvedValueOnce({
        data: [
          {
            id: 12,
            slug: "dealer-meet-programme",
            name: "Dealer Meet Programme",
            image: "https://example.com/dealer-meet.jpg",
            comment: "Corporate dealer programme planning.",
          },
        ],
      })
      .mockResolvedValueOnce({ data: [] });

    renderList();

    const link = await screen.findByRole("link", { name: /dealer meet programme/i });
    expect(link).toHaveAttribute("href", "/case-studies/dealer-meet-programme");

    const image = within(link).getByRole("img", { name: "Dealer Meet Programme" });
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
  });

  test("provides contact and service links when case-study APIs are unavailable", async () => {
    axiosInstance.get.mockRejectedValue(new Error("network unavailable"));

    renderList();

    expect(
      await screen.findByRole("heading", {
        name: /case studies are temporarily unavailable/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /discuss a corporate programme/i }),
    ).toHaveAttribute("href", "/contact");
    expect(
      screen.getByRole("link", { name: /explore mice services/i }),
    ).toHaveAttribute("href", "/mice-services");
  });

  test("aborts both collection requests when the listing unmounts", () => {
    const signals = [];
    axiosInstance.get.mockImplementation((_url, config) => {
      signals.push(config.signal);
      return new Promise(() => {});
    });

    const { unmount } = renderList();
    expect(signals).toHaveLength(2);

    unmount();

    expect(signals.every((signal) => signal.aborted)).toBe(true);
  });
});
