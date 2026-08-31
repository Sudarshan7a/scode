import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MyLoginForm } from "./MyLoginForm";

describe("MyLoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows sign-in downtime notice", () => {
    render(<MyLoginForm />);
    expect(
      screen.getByText(
        "Sign in is temporarily unavailable due to technical difficulties."
      )
    ).toBeInTheDocument();
  });
});
