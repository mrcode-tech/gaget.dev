import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DateTimeEditor } from "@/components/datetime-editor";

afterEach(() => cleanup());

describe("DateTimeEditor", () => {
  it("renders the live date/time centerpiece and keeps all 20 tools discoverable", () => {
    render(<DateTimeEditor />);
    expect(screen.getByRole("heading", { name: "Date & Time" })).toBeTruthy();
    const centerpiece = screen.getByRole("region", { name: "Date and time display" });
    expect(centerpiece).toBeTruthy();
    expect(centerpiece.className).toContain("border-y");
    expect(centerpiece.className).not.toContain("rounded-2xl");
    fireEvent.click(screen.getByRole("button", { name: "Features" }));
    expect(screen.getByRole("textbox", { name: "Search date and time features" })).toBeTruthy();
    expect(document.querySelectorAll("button[aria-pressed]").length).toBe(20);
    expect(screen.getByRole("combobox", { name: "Display language" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Calendar system" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Time zone" })).toBeTruthy();
  });

  it("keeps File and feature groups together on desktop while separating File and Features on compact screens", () => {
    render(<DateTimeEditor />);
    const commandBar = screen.getByRole("navigation", { name: "Date and time editor commands" });
    expect(commandBar.className).toContain("justify-between");
    expect(commandBar.className).toContain("lg:justify-start");
    expect(commandBar.className).toContain("gap-3");
    const commandButtons = within(commandBar);
    expect(commandButtons.getByRole("button", { name: "File" }).className).toContain("h-9");
    expect(commandButtons.getByRole("button", { name: "Date" }).parentElement?.parentElement?.className).toContain("gap-3");
    expect(commandButtons.getByRole("button", { name: "Features" }).className).toContain("lg:hidden");
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    const fileMenu = screen.getByTestId("datetime-file-menu");
    expect(fileMenu.className).toContain("start-3");
    expect(fileMenu.className).toContain("sm:start-6");
    expect(within(fileMenu).getByRole("button", { name: /Copy current display/ })).toBeTruthy();
    expect(within(fileMenu).getByRole("button", { name: /Copy ISO 8601/ })).toBeTruthy();
    expect(within(fileMenu).getByRole("button", { name: /Copy Unix timestamp/ })).toBeTruthy();
    expect(within(fileMenu).getByRole("button", { name: /Print current view/ })).toBeTruthy();
    expect(within(fileMenu).getByRole("button", { name: /Reset reference to now/ })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    fireEvent.click(screen.getByRole("button", { name: /^Date$/ }));
    const dateMenu = screen.getByTestId("datetime-date-menu");
    expect(dateMenu.className).toContain("start-0");
    fireEvent.click(within(dateMenu).getByRole("button", { name: /Date calculator/ }));
    expect(screen.getByTestId("datetime-feature-panel")).toBeTruthy();
    expect(screen.queryByTestId("datetime-date-menu")).toBeNull();
  });

  it("uses custom date and time pickers instead of native browser date/time inputs", () => {
    render(<DateTimeEditor initialFeature="world-clock" />);
    expect(document.querySelector('input[type="date"], input[type="time"]')).toBeNull();
    expect(document.getElementById("time-date")?.tagName).toBe("BUTTON");
    expect(screen.getByRole("textbox", { name: "Time in 24-hour format" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Choose time" })).toBeTruthy();
  });

  it("dismisses menus with Escape and restores focus to the trigger", () => {
    render(<DateTimeEditor />);
    const trigger = screen.getByRole("button", { name: "Features" });
    fireEvent.click(trigger);
    expect(screen.getByTestId("datetime-feature-menu")).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByTestId("datetime-feature-menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
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
