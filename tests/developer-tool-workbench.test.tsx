import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DeveloperToolWorkbench } from "@/components/developer-tool-workbench";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
describe("DeveloperToolWorkbench", () => {
  it("converts CSV to JSON and preserves quoted delimiters", async () => {
    render(<DeveloperToolWorkbench operation="csv-json" />);
    const input = screen.getByRole("textbox", { name: "CSV ↔ JSON converter input" }) as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: 'name,city\nAda,"London, UK"' } });
    fireEvent.click(screen.getByRole("button", { name: "Process" }));
    const output = screen.getByRole("textbox", { name: "CSV ↔ JSON converter output" }) as HTMLTextAreaElement;
    await waitFor(() => expect(output.value).toContain('"city": "London, UK"'));
    expect(output.value).toContain('"name": "Ada"');
  });
  it("surfaces malformed regex syntax without clearing the sample", async () => {
    render(<DeveloperToolWorkbench operation="regex" />);
    fireEvent.change(screen.getByRole("textbox", { name: "Regular expression pattern" }), { target: { value: "[" } });
    const input = screen.getByRole("textbox", { name: "Regular expression tester input" }) as HTMLTextAreaElement;
    fireEvent.click(screen.getByRole("button", { name: "Process" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(input.value).toContain("Hello world");
  });
  it("computes a SHA-256 digest through the browser crypto interface", async () => {
    const bytes = Uint8Array.from([0xba,0x78,0x16,0xbf,0x8f,0x01,0xcf,0xea,0x41,0x41,0x40,0xde,0x5d,0xae,0x22,0x23,0xb0,0x03,0x61,0xa3,0x96,0x17,0x7a,0x9c,0xb4,0x10,0xff,0x61,0xf2,0x00,0x15,0xad]);
    vi.stubGlobal("crypto", { subtle: { digest: vi.fn(async () => bytes.buffer) } });
    render(<DeveloperToolWorkbench operation="hash" />);
    fireEvent.change(screen.getByRole("textbox", { name: "Hash generator input" }), { target: { value: "abc" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate digest" }));
    const output = screen.getByRole("textbox", { name: "Hash generator output" }) as HTMLTextAreaElement;
    await waitFor(() => expect(output.value).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"));
  });
  it("shows a redacted cURL preview without executing the request", async () => {
    render(<DeveloperToolWorkbench operation="curl" />);
    fireEvent.change(screen.getByRole("textbox", { name: "cURL request inspector input" }), { target: { value: "curl -H 'Authorization: Bearer secret' 'https://example.com?access_token=topsecret'" } });
    fireEvent.click(screen.getByRole("button", { name: "Process" }));
    const output = screen.getByRole("textbox", { name: "cURL request inspector output" }) as HTMLTextAreaElement;
    await waitFor(() => expect(output.value).toContain("[REDACTED]"));
    expect(output.value).not.toContain("Bearer secret");
    expect(output.value).not.toContain("access_token=topsecret");
  });
});
