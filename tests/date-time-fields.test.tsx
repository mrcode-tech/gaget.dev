import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CalendarDateInput, ClockTimeInput } from "@/components/date-time-fields";

afterEach(() => cleanup());

describe("Date & Time reusable fields", () => {
  it("opens a calendar-system-aware date picker and emits a stable ISO date", () => {
    const onChange = vi.fn();
    render(<CalendarDateInput id="start-date" value="2026-10-19" onChange={onChange} locale="fa-IR" calendar="persian" />);
    fireEvent.click(screen.getByRole("button", { name: /۱۴۰۵|2026|Choose date/i }));
    expect(screen.getByRole("dialog", { name: "Choose date" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Today" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("dismisses the date picker with Escape and restores focus to its trigger", () => {
    render(<CalendarDateInput id="escape-date" value="2026-10-19" onChange={() => undefined} />);
    const trigger = screen.getByRole("button", { name: /October|2026|Choose date/i });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Choose date" })).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Choose date" })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("provides a bounded quarter-hour list and keeps direct time entry available", () => {
    const onChange = vi.fn();
    render(<ClockTimeInput id="meeting-time" value="09:00" onChange={onChange} />);
    expect(screen.getByRole("textbox", { name: "Time in 24-hour format" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Choose time" }));
    expect(screen.getByRole("listbox", { name: "Time options" })).toBeTruthy();
    fireEvent.click(screen.getByRole("option", { name: "09:15" }));
    expect(onChange).toHaveBeenCalledWith("09:15");
    expect(screen.queryByRole("listbox", { name: "Time options" })).toBeNull();
  });
});
