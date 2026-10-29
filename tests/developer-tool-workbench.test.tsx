import { JwtWorkbench } from "@/components/tool-workbenches";
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
    fireEvent.change(screen.getByRole("textbox", { name: "Hash & Checksum Generator input" }), { target: { value: "abc" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate digest" }));
    const output = screen.getByRole("textbox", { name: "Hash & Checksum Generator output" }) as HTMLTextAreaElement;
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

it("hashes selected file bytes through the styled file control",async()=>{
 const bytes=Uint8Array.from([0xba,0x78,0x16,0xbf,0x8f,0x01,0xcf,0xea,0x41,0x41,0x40,0xde,0x5d,0xae,0x22,0x23,0xb0,0x03,0x61,0xa3,0x96,0x17,0x7a,0x9c,0xb4,0x10,0xff,0x61,0xf2,0x00,0x15,0xad]);
 vi.stubGlobal("crypto",{subtle:{digest:vi.fn(async()=>bytes.buffer)}});
 const file=new File(["abc"],"sample.bin",{type:"application/octet-stream"});
 Object.defineProperty(file,"arrayBuffer",{value:async()=>new TextEncoder().encode("abc").buffer});
 render(<DeveloperToolWorkbench operation="hash"/>);
 fireEvent.change(screen.getByLabelText("Choose a file to hash"),{target:{files:[file]}});
 expect(await screen.findByText(/Hashing raw bytes from sample.bin/)).toBeTruthy();
 fireEvent.click(screen.getByRole("button",{name:"Generate digest"}));
 const output=screen.getByRole("textbox",{name:"Hash & Checksum Generator output"}) as HTMLTextAreaElement;
 await waitFor(()=>expect(output.value).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"));
});

describe("JWT time-claim interpretation",()=>{
 it("handles exp=0 and reports iat/nbf relative to the local clock without verifying signatures",async()=>{
  const base64url=(value:unknown)=>btoa(Array.from(new TextEncoder().encode(JSON.stringify(value)),b=>String.fromCharCode(b)).join("")).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
  render(<JwtWorkbench/>);
  fireEvent.change(screen.getByRole("textbox",{name:"JWT token input"}),{target:{value:base64url({alg:"none",typ:"JWT"})+"."+base64url({exp:0,iat:4102444800,nbf:4102444800})+".unverified"}});
  fireEvent.click(screen.getByRole("button",{name:/Decode token/i}));
  expect(await screen.findByText(/Decoded only\. The signature has not been verified/i)).toBeTruthy();
  expect(screen.getByText("Expiration (exp)")).toBeTruthy();expect(screen.getByText(/Expired according to the local clock/i)).toBeTruthy();
  expect(screen.getByText("Issued at (iat)")).toBeTruthy();expect(screen.getByText(/Issued in the future/i)).toBeTruthy();
  expect(screen.getByText("Not before (nbf)")).toBeTruthy();expect(screen.getByText(/Not yet valid/i)).toBeTruthy();
 });
 it("shows missing and invalid NumericDate claims explicitly",async()=>{
  const base64url=(value:unknown)=>btoa(Array.from(new TextEncoder().encode(JSON.stringify(value)),b=>String.fromCharCode(b)).join("")).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
  render(<JwtWorkbench/>);
  fireEvent.change(screen.getByRole("textbox",{name:"JWT token input"}),{target:{value:base64url({alg:"none"})+"."+base64url({exp:"tomorrow"})+".unverified"}});
  fireEvent.click(screen.getByRole("button",{name:/Decode token/i}));
  expect(await screen.findAllByText("Not provided")).toHaveLength(2);
  expect(screen.getAllByText("Invalid NumericDate").length).toBeGreaterThan(0);
 });
});


describe("optional UTF-8 file input for text-based developer tools",()=>{
 it("loads a selected CSV file into the editor and converts it",async()=>{
  const file=new File(['name,city\nAda,"London, UK"'],"sample.csv",{type:"text/csv"});
  Object.defineProperty(file,"arrayBuffer",{value:async()=>new TextEncoder().encode('name,city\nAda,"London, UK"').buffer});
  render(<DeveloperToolWorkbench operation="csv-json"/>);
  fireEvent.change(screen.getByLabelText("Choose a text file for CSV ↔ JSON converter"),{target:{files:[file]}});
  const input=screen.getByRole("textbox",{name:"CSV ↔ JSON converter input"}) as HTMLTextAreaElement;
  await waitFor(()=>expect(input.value).toContain('"London, UK"'));
  expect(await screen.findByText(/Loaded sample.csv as UTF-8 text/i)).toBeTruthy();
  fireEvent.click(screen.getByRole("button",{name:"Process"}));
  const output=screen.getByRole("textbox",{name:"CSV ↔ JSON converter output"}) as HTMLTextAreaElement;
  await waitFor(()=>expect(output.value).toContain('"city": "London, UK"'));
 });
 it("rejects non-UTF-8 byte sequences instead of silently replacing bytes",async()=>{
  const file=new File(["invalid"],"invalid.csv",{type:"text/csv"});
  Object.defineProperty(file,"arrayBuffer",{value:async()=>Uint8Array.from([0xc3,0x28]).buffer});
  render(<DeveloperToolWorkbench operation="csv-json"/>);
  fireEvent.change(screen.getByLabelText("Choose a text file for CSV ↔ JSON converter"),{target:{files:[file]}});
  expect(await screen.findByRole("alert")).toBeTruthy();
 });
});

it("rejects text files above the byte limit before decoding",async()=>{
 const file=new File(["x".repeat(200_001)],"large.csv",{type:"text/csv"});
 Object.defineProperty(file,"arrayBuffer",{value:async()=>new TextEncoder().encode("x".repeat(200_001)).buffer});
 render(<DeveloperToolWorkbench operation="csv-json"/>);
 const input=screen.getByRole("textbox",{name:"CSV ↔ JSON converter input"}) as HTMLTextAreaElement;
 const before=input.value;
 fireEvent.change(screen.getByLabelText("Choose a text file for CSV ↔ JSON converter"),{target:{files:[file]}});
 expect((await screen.findByRole("alert")).textContent??"").toMatch(/200,000 bytes/i);
 expect(input.value).toBe(before);
});
