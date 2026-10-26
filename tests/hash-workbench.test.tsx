import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("@/lib/tools/hash", () => ({
  digestBytes: vi.fn(async () => "deadbeef"),
}));

import { HashWorkbench } from "@/components/hash-workbench";

afterEach(cleanup);

describe("Hash Generator workbench", () => {
  it("submits UTF-8 text and renders the digest result", async () => {
    render(<HashWorkbench />);
    fireEvent.change(screen.getByLabelText("Text input (UTF-8)"), { target: { value: "hello" } });
    fireEvent.click(screen.getByRole("button", { name: /Hash text/ }));
    await waitFor(() => expect(screen.getByText("deadbeef")).toBeTruthy());
    expect(screen.getByText(/cryptographic hash functions, not encryption/i)).toBeTruthy();
  });

  it("clears text and digest output", async () => {
    render(<HashWorkbench />);
    fireEvent.change(screen.getByLabelText("Text input (UTF-8)"), { target: { value: "hello" } });
    fireEvent.click(screen.getByRole("button", { name: /Hash text/ }));
    await waitFor(() => expect(screen.getByText("deadbeef")).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect((screen.getByLabelText("Text input (UTF-8)") as HTMLTextAreaElement).value).toBe("");
    expect(screen.queryByText("deadbeef")).toBeNull();
  });
});
