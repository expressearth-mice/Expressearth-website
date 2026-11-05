import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axiosInstance from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import CaseStudyDetail from "./CaseStudyDetail";

jest.mock("../api/axios", () => ({
  __esModule: true,
  default: { get: jest.fn(), delete: jest.fn() },
}));

jest.mock("./Skeleton", () => () => null);

const renderDetail = () =>
  render(
    <MemoryRouter initialEntries={["/case-studies/dealer-meet-programme"]}>
      <AuthContext.Provider
        value={{
          role: { is_admin: false, is_seo: false },
          getValidAccessToken: jest.fn(),
        }}
      >
        <Routes>
          <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  );

describe("CaseStudyDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("uses the case-study title as the page H1", async () => {
    axiosInstance.get.mockImplementation((url) => {
      if (url === "/api/case-studies/") {
        return Promise.resolve({
          data: [
            {
              id: 12,
              slug: "dealer-meet-programme",
              name: "Dealer Meet Programme",
              comment: "Corporate dealer programme planning.",
            },
          ],
        });
      }
      if (url === "/api/destinations/") return Promise.resolve({ data: [] });
      return Promise.reject(new Error("unexpected request"));
    });

    renderDetail();

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Dealer Meet Programme",
      }),
    ).toBeInTheDocument();
  });

  test("aborts pending detail and destination requests when the route unmounts", () => {
    const signals = [];
    axiosInstance.get.mockImplementation((_url, config) => {
      signals.push(config.signal);
      return new Promise(() => {});
    });

    const { unmount } = renderDetail();
    expect(signals).toHaveLength(2);

    unmount();

    expect(signals.every((signal) => signal.aborted)).toBe(true);
  });

  test("provides corporate enquiry links after a case study loads", async () => {
    axiosInstance.get.mockImplementation((url) => {
      if (url === "/api/case-studies/") {
        return Promise.resolve({
          data: [
            {
              id: 12,
              slug: "dealer-meet-programme",
              name: "Dealer Meet Programme",
              comment: "Corporate dealer programme planning.",
            },
          ],
        });
      }
      if (url === "/api/destinations/") return Promise.resolve({ data: [] });
      return Promise.reject(new Error("unexpected request"));
    });

    renderDetail();

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Dealer Meet Programme",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /planning a corporate mice programme/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /discuss your programme/i }),
    ).toHaveAttribute("href", "/contact");
    expect(
      screen.getByRole("link", { name: /explore mice services/i }),
    ).toHaveAttribute("href", "/mice-services");
  });

});
