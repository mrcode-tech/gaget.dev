import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DateTimeEditor } from "@/components/datetime-editor";

afterEach(() => cleanup());

describe("DateTimeEditor", () => {
  it("renders the live date/time centerpiece and keeps all 20 tools discoverable", () => {
    render(<DateTimeEditor />);
    expect(screen.getByRole("heading", { name: "Date & Time" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Date and time display" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Features" }));
    expect(screen.getByRole("textbox", { name: "Search date and time features" })).toBeTruthy();
    expect(document.querySelectorAll("button[aria-pressed]").length).toBe(20);
    expect(screen.getByRole("combobox", { name: "Display language" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Calendar system" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Time zone" })).toBeTruthy();
  });

  it("uses template-style File and grouped desktop feature menus", () => {
    render(<DateTimeEditor />);
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    expect(screen.getByTestId("datetime-file-menu")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    fireEvent.click(screen.getByRole("button", { name: "Date", exact: true }));
    const dateMenu = screen.getByTestId("datetime-date-menu");
    fireEvent.click(within(dateMenu).getByRole("button", { name: /Date calculator/ }));
    expect(screen.getByTestId("datetime-feature-panel")).toBeTruthy();
    expect(screen.queryByTestId("datetime-date-menu")).toBeNull();
  });

  it("opens the shared resizable mobile feature sheet for a selected legacy feature", () => {
    render(<DateTimeEditor initialFeature="date-difference" />);
    const panel = screen.getByTestId("datetime-feature-panel");
    expect(panel.className).toContain("fixed");
    expect(within(panel).getByRole("heading", { name: "Date Difference Calculator" })).toBeTruthy();
    const handle = within(panel).getByRole("slider", { name: "Resize editing panel" });
    const max = handle.getAttribute("aria-valuemax");
    fireEvent.keyDown(handle, { key: "End" });
    expect(handle.getAttribute("aria-valuenow")).toBe(max);
    fireEvent.click(within(panel).getByRole("button", { name: "Close selected feature" }));
    expect(screen.queryByTestId("datetime-feature-panel")).toBeNull();
  });

  it("treats display language, calendar, and numeral system as independent controls", () => {
    render(<DateTimeEditor />);
    fireEvent.change(screen.getByRole("combobox", { name: "Display language" }), { target: { value: "fa-IR" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Calendar system" }), { target: { value: "persian" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Numeral system" }), { target: { value: "arabext" } });
    expect(document.querySelector("main")?.getAttribute("dir")).toBe("rtl");
    expect((screen.getByRole("combobox", { name: "Calendar system" }) as HTMLSelectElement).value).toBe("persian");
    expect((screen.getByRole("combobox", { name: "Numeral system" }) as HTMLSelectElement).value).toBe("arabext");
  });

  it("filters the feature menu without hiding the date/time centerpiece", () => {
    render(<DateTimeEditor />);
    fireEvent.click(screen.getByRole("button", { name: "Features" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Search date and time features" }), { target: { value: "timestamp" } });
    expect(screen.getByRole("button", { name: /Timestamp converter/ })).toBeTruthy();
    expect(document.querySelectorAll("button[aria-pressed]").length).toBe(1);
    expect(screen.getByRole("region", { name: "Date and time display" })).toBeTruthy();
  });

  it("supports filtering the full browser-provided IANA time-zone list", () => {
    render(<DateTimeEditor />);
    const search = screen.getByRole("textbox", { name: "Search time zones" });
    fireEvent.change(search, { target: { value: "Asia/Tehran" } });
    const zoneSelect = screen.getByRole("combobox", { name: "Time zone" }) as HTMLSelectElement;
    expect(within(zoneSelect).getByRole("option", { name: "Asia/Tehran" })).toBeTruthy();
    expect(within(zoneSelect).queryByRole("option", { name: "Europe/London" })).toBeNull();
  });
});
