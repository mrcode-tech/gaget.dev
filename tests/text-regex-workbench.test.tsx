import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TextRegexWorkbench } from "@/components/text-regex-workbench";
afterEach(cleanup);
it("shows actionable regex errors without changing the source text", () => {
  render(<TextRegexWorkbench />);
  const input = screen.getByRole("textbox", { name: "Text input" }) as HTMLTextAreaElement;
  fireEvent.change(screen.getByRole("textbox", { name: "Regular expression pattern" }), { target: { value: "[" } });
  fireEvent.click(screen.getByRole("button", { name: "Process" }));
  expect(screen.getByRole("alert").textContent).toMatch(/regular expression/i);
  expect(input.value).toContain("Hello world");
});
