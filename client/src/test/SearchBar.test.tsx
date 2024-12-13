import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchBar from "../components/SearchBar";
import { vi, Mock } from "vitest";
import getStockPrice from "../hooks/getStockPrice";
import createStocks from "../hooks/createStocks";
import { Stock } from "../types/types";

vi.mock("../hooks/getStockPrice", () => ({
  default: vi.fn(),
}));

vi.mock("../hooks/createStocks", () => ({
  default: vi.fn(),
}));

describe("SearchBar Component", () => {
  const mockSetStocks = vi.fn();
  const stocks: Stock[] = [];

  it("renders the search bar", () => {
    render(<SearchBar setStocks={mockSetStocks} stocks={stocks} />);

    expect(screen.getByLabelText(/Stock Ticker/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
  });

  it.skip("handles price search submit", async () => {
    getStockPrice.mockResolvedValue({
      stock_info: {
        symbol: "GM",
        price: "150.00",
        previous_close: "149.00",
        open: "140.00",
        high: "151.00",
        low: "148.00",
        volume: "1000000",
        change: "1.00",
        change_percent: "0.67%",
      },
    });

    render(<SearchBar setStocks={mockSetStocks} stocks={stocks} />);

    fireEvent.change(screen.getByLabelText(/Stock Ticker/i), {
      target: { value: "GM" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Search/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/GM - General Motors Company/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/150.00/i)).toBeInTheDocument();
    });
  });

  
  it.skip("handles stock buy", async () => {
    getStockPrice.mockResolvedValue({
      stock_info: {
        symbol: "AAPL",
        price: "150.00",
        previous_close: "149.00",
        open: "150.00",
        high: "151.00",
        low: "148.00",
        volume: "1000000",
        change: "1.00",
        change_percent: "0.67%",
      },
    });

    createStocks.mockResolvedValue({
      stock: {
        symbol: "AAPL",
        price: "150.00",
        previous_close: "149.00",
        number_owned: 10,
        market_value: 1500,
      },
    });

    render(<SearchBar setStocks={mockSetStocks} stocks={stocks} />);

    fireEvent.change(screen.getByLabelText(/Stock Ticker/i), {
      target: { value: "AAPL" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Search/i }));

    await waitFor(() => {
      expect(screen.getByText(/AAPL/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Optional Qty/i), {
      target: { value: 10 },
    });

    fireEvent.click(screen.getByRole("button", { name: /Buy\/Track/i }));

    await waitFor(() => {
      expect(mockSetStocks).toHaveBeenCalled();
      expect(createStocks).toHaveBeenCalledWith("AAPL", {
        price: 150,
        number_owned: 10,
        market_value: 1500,
        previous_close: 149,
      });
    });
  });
});
