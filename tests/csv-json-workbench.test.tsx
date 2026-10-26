import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CsvJsonWorkbench } from "@/components/csv-json-workbench";

afterEach(cleanup);

describe("CSV ↔ JSON workbench", () => {
  it("converts CSV into a visible JSON result", () => {
    render(<CsvJsonWorkbench />);
    fireEvent.change(screen.getByRole("textbox", { name: "CSV input" }), { target: { value: "name,city\nAda,London" } });
    fireEvent.click(screen.getByRole("button", { name: "Convert" }));
    expect(screen.getByText(/"name": "Ada"/)).toBeTruthy();
    expect(screen.getByText(/"city": "London"/)).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows actionable errors for nested JSON instead of silently dropping data", () => {
    render(<CsvJsonWorkbench />);
    fireEvent.click(screen.getByRole("button", { name: "JSON to CSV" }));
    fireEvent.change(screen.getByRole("textbox", { name: "JSON input" }), { target: { value: '[{"nested":{"x":1}}]' } });
    fireEvent.click(screen.getByRole("button", { name: "Convert" }));
    expect(screen.getByRole("alert").textContent).toContain("nested");
  });

  it("clears the input and any prior result", () => {
    render(<CsvJsonWorkbench />);
    fireEvent.change(screen.getByRole("textbox", { name: "CSV input" }), { target: { value: "name\nAda" } });
    fireEvent.click(screen.getByRole("button", { name: "Convert" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect((screen.getByRole("textbox", { name: "CSV input" }) as HTMLTextAreaElement).value).toBe("");
    expect(screen.queryByText(/"name": "Ada"/)).toBeNull();
  });
});
