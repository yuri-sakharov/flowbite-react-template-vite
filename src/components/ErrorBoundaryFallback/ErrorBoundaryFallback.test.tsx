import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ErrorBoundaryFallback } from "./ErrorBoundaryFallback.tsx";

describe("ErrorBoundaryFallback", () => {
  it("shows the error message", () => {
    render(
      <ErrorBoundaryFallback
        error={new Error("Something broke")}
        resetErrorBoundary={vi.fn()}
      />,
    );

    expect(screen.getByText("Something broke")).toBeInTheDocument();
  });

  it("calls resetErrorBoundary when Try again is clicked", async () => {
    const user = userEvent.setup();
    const resetErrorBoundary = vi.fn();

    render(
      <ErrorBoundaryFallback
        error={new Error("Something broke")}
        resetErrorBoundary={resetErrorBoundary}
      />,
    );

    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(resetErrorBoundary).toHaveBeenCalledOnce();
  });
});
