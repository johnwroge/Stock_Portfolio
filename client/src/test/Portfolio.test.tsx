import { render, screen, waitFor } from "@testing-library/react";
import Portfolio from "../components/Portfolio.tsx";
import { beforeEach, describe, expect, it, vi } from "vitest";
import getStocksFromDB from "../hooks/getStocksFromDB.tsx";
import deleteStocks from "../hooks/deleteStocks.js";
import { Stock } from "../types/types.ts";

vi.mock("../hooks/getStocksFromDB.tsx");
vi.mock("../hooks/deleteStocks.js");

describe("Portfolio", () => {
  const mockStocks: Stock[] = [
    {
      id: 1,
      market_value: 150000,
      number_owned: 1000,
      previous_close: 148,
      price: 150,
      symbol: "AAPL",
    },
    {
      id: 2,
      market_value: 20000,
      number_owned: 35,
      previous_close: 200,
      price: 205,
      symbol: "GOOGL",
    },
  ];

  beforeEach(() => {
    (getStocksFromDB as vi.Mock).mockResolvedValue({ stocks: mockStocks });
    (deleteStocks as vi.Mock).mockResolvedValue({});
  });

  it("renders the Portfolio component", async () => {
    render(<Portfolio />);

    expect(screen.getByTestId("portfolio")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("AAPL")).toBeInTheDocument();
      expect(screen.getByText("GOOGL")).toBeInTheDocument();
    });
  });
});
