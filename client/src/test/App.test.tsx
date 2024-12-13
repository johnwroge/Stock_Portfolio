import { render, screen } from "@testing-library/react";
import App from "../App.tsx";
import { describe, expect, it } from "vitest";

describe("App", () => {
  it("renders the App component", () => {
    render(<App />);
    // expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByTestId("portfolio")).toBeInTheDocument();
  });
});
