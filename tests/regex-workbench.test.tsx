import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { RegexWorkbench } from "@/components/regex-workbench";

afterEach(cleanup);

describe("Regex Tester workbench", () => {
  it("renders the pattern, flags, and test text controls", () => {
    render(<RegexWorkbench />);
    expect(screen.getByLabelText("Pattern")).toBeTruthy();
    expect(screen.getByLabelText("Flags")).toBeTruthy();
    expect(screen.getByLabelText(/Test text/)).toBeTruthy();
  });

  it("shows a syntax error before starting a worker", () => {
    render(<RegexWorkbench />);
    fireEvent.change(screen.getByLabelText("Pattern"), { target: { value: "[" } });
    fireEvent.click(screen.getByRole("button", { name: /Test pattern/ }));
    expect(screen.getByRole("alert").textContent).toMatch(/unterminated|character class|regular expression/i);
  });

  it("rejects repeated flags without executing the pattern", () => {
    render(<RegexWorkbench />);
    fireEvent.change(screen.getByLabelText("Flags"), { target: { value: "ii" } });
    fireEvent.click(screen.getByRole("button", { name: /Test pattern/ }));
    expect(screen.getByRole("alert").textContent).toContain("non-repeated");
  });

  it("clears input and prior errors", () => {
    render(<RegexWorkbench />);
    fireEvent.change(screen.getByLabelText("Pattern"), { target: { value: "[" } });
    fireEvent.click(screen.getByRole("button", { name: /Test pattern/ }));
    expect(screen.getByRole("alert")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect((screen.getByLabelText("Pattern") as HTMLInputElement).value).toBe("");
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
