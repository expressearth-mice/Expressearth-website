import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotFound } from "./App";

test("renders useful navigation when a route is not found", () => {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );

  expect(
    screen.getByRole("heading", { name: /page not found/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /explore mice services/i })
  ).toHaveAttribute("href", "/mice-services");
  expect(
    screen.getByRole("link", { name: /contact expressearth/i })
  ).toHaveAttribute("href", "/contact");
});
