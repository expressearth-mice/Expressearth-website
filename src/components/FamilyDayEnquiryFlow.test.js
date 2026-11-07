import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import FamilyDayEvents from "./FamilyDayEvents";
import ContactForm from "./ContactForm";
import axiosInstance from "../api/axios";

jest.mock("../api/axios", () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

jest.mock("react-google-recaptcha", () => ({ onChange }) => (
  <button type="button" onClick={() => onChange("test-captcha-token")}>
    Complete CAPTCHA
  </button>
));

describe("employee family day enquiry journey", () => {
  test("carries a family day visitor from the service page through the contact form and confirmed lead event", async () => {
    const originalGtag = window.gtag;
    window.gtag = jest.fn();
    axiosInstance.post.mockResolvedValue({
      status: 201,
      data: { success: true },
    });

    try {
      render(
        <MemoryRouter initialEntries={["/family-day-events"]}>
          <Routes>
            <Route path="/family-day-events" element={<FamilyDayEvents />} />
            <Route path="/contact" element={<ContactForm />} />
          </Routes>
        </MemoryRouter>,
      );

      fireEvent.click(
        screen.getByRole("link", { name: /plan your company family day/i }),
      );

      expect(
        screen.getByRole("heading", {
          name: /contact expressearth for corporate mice enquiries/i,
        }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/programme type/i)).toHaveValue("Other");
      expect(screen.getByLabelText(/specific service/i)).toHaveValue(
        "Employee & Family Day",
      );

      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: "Test Contact" },
      });
      fireEvent.change(screen.getByLabelText(/company \/ organisation/i), {
        target: { value: "Example Test Company" },
      });
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/phone number/i), {
        target: { value: "9876543210" },
      });
      fireEvent.click(screen.getByRole("button", { name: /complete captcha/i }));
      fireEvent.click(screen.getByRole("button", { name: /send enquiry/i }));

      await waitFor(() => expect(axiosInstance.post).toHaveBeenCalledTimes(1));
      const submittedPayload = axiosInstance.post.mock.calls[0][1];
      expect(axiosInstance.post.mock.calls[0][0]).toBe("/api/contact/");
      expect(submittedPayload).toMatchObject({
        full_name: "Test Contact",
        company_name: "Example Test Company",
        email: "test@example.com",
        phone: "9876543210",
        event_type: "Other",
        captcha: "test-captcha-token",
        requirements: "Programme detail: Employee & Family Day",
      });
      expect(submittedPayload).not.toHaveProperty("programme_detail");
      await waitFor(() =>
        expect(screen.getByRole("status")).toHaveTextContent(
          /enquiry has been submitted successfully/i,
        ),
      );
      expect(window.gtag).toHaveBeenCalledWith(
        "event",
        "generate_lead",
        expect.objectContaining({
          event_category: "lead_generation",
          service_type: "family_day_events",
          form_location: "service_page",
          page_path: "/contact",
          service_source_page: "/family-day-events",
        }),
      );
      const eventParams = window.gtag.mock.calls[0][2];
      expect(JSON.stringify(eventParams)).not.toContain("test@example.com");
      expect(JSON.stringify(eventParams)).not.toContain("9876543210");
    } finally {
      if (originalGtag === undefined) {
        delete window.gtag;
      } else {
        window.gtag = originalGtag;
      }
      jest.clearAllMocks();
    }
  });
});
