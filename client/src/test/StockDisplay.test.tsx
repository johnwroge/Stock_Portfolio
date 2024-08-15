import { render, screen, within } from "@testing-library/react";
import StockDisplay from "../components/StockDisplay";
import { StockDisplayProps } from "../types/types";

describe("StockDisplay Component", () => {
  const defaultProps: StockDisplayProps = {
    symbol: "AAPL",
    open: "150.00",
    high: "155.00",
    low: "149.00",
    volume: "1000000",
    price: "152.00",
    isRising: true,
    previous: "147.00",
    change: "2.00",
    change_percent: "1.33%",
  };

  it("displays the stock information correctly", () => {
    render(<StockDisplay {...defaultProps} />);

    expect(screen.getByText(/AAPL/)).toBeInTheDocument();
    expect(screen.getByText(/▲/)).toBeInTheDocument();
    expect(screen.getByText(/152\.00/)).toBeInTheDocument();
    expect(screen.getByText(/2\.00 \(1\.33%\)/)).toBeInTheDocument();

    expect(screen.getByText(/High:/)).toBeInTheDocument();
    expect(screen.getByText(/155\.00/)).toBeInTheDocument();

    expect(screen.getByText(/Low:/)).toBeInTheDocument();
    expect(screen.getByText(/149\.00/)).toBeInTheDocument();

    expect(screen.getByText(/Open:/)).toBeInTheDocument();
    expect(screen.getByText(/150\.00/)).toBeInTheDocument();

    expect(screen.getByText(/Volume:/)).toBeInTheDocument();
    expect(screen.getByText(/1000000/)).toBeInTheDocument();

    expect(screen.getByText(/Previous:/)).toBeInTheDocument();
    expect(screen.getByText(/150\.00/)).toBeInTheDocument();

    expect(screen.getByText(/Change:/)).toBeInTheDocument();
  });

  it("applies red color when stock is not rising", () => {
    render(<StockDisplay {...defaultProps} isRising={false} />);

    const arrow = screen.getByText("▼");
    expect(arrow).toHaveStyle("color: rgb(255, 0, 0)");
  });

  it("applies green color when stock is rising", () => {
    render(<StockDisplay {...defaultProps} />);

    const arrow = screen.getByText("▲");
    expect(arrow).toHaveStyle("color: rgb(0, 128, 0)");
  });

  it("applies red color when stock is not rising", () => {
    render(<StockDisplay {...defaultProps} isRising={false} />);

    const arrow = screen.getByText("▼");
    expect(arrow).toHaveStyle("color: rgb(255, 0, 0)");
  });
});
