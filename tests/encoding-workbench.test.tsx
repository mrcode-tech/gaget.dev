import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EncodingWorkbench } from "@/components/encoding-workbench";
afterEach(cleanup);
it("encodes UTF-8 text in the shared Base64 mode", async () => {
  render(<EncodingWorkbench initialMode="base64" />);
  fireEvent.change(screen.getByRole("textbox", { name: "Encoding input" }), { target: { value: "Hello" } });
  fireEvent.click(screen.getByRole("button", { name: "Encode" }));
  const output = screen.getByRole("textbox", { name: "Encoding output" }) as HTMLTextAreaElement;
  await waitFor(() => expect(output.value).toBe("SGVsbG8="));
});

it("preserves non-UTF-8 decoded bytes for binary download",()=>{render(<EncodingWorkbench initialMode="hex"/>);fireEvent.click(screen.getByRole("button",{name:"Decode mode"}));fireEvent.change(screen.getByRole("textbox",{name:"Encoding input"}),{target:{value:"ff00"}});fireEvent.click(screen.getByRole("button",{name:"Decode"}));const output=screen.getByRole("textbox",{name:"Encoding output"}) as HTMLTextAreaElement;expect(output.value).toMatch(/Decoded 2 bytes/);expect((screen.getByRole("button",{name:"Download encoding output or decoded bytes"}) as HTMLButtonElement).disabled).toBe(false);});
it("keeps decoded UTF-8 readable while retaining byte download",()=>{render(<EncodingWorkbench initialMode="hex"/>);fireEvent.click(screen.getByRole("button",{name:"Decode mode"}));fireEvent.change(screen.getByRole("textbox",{name:"Encoding input"}),{target:{value:"48656c6c6f"}});fireEvent.click(screen.getByRole("button",{name:"Decode"}));expect((screen.getByRole("textbox",{name:"Encoding output"}) as HTMLTextAreaElement).value).toBe("Hello");expect((screen.getByRole("button",{name:"Download encoding output or decoded bytes"}) as HTMLButtonElement).disabled).toBe(false);});

it("processes selected UTF-8 text files in text-only encoding modes",async()=>{
 render(<EncodingWorkbench initialMode="html-entities"/>);
 const file=new File(["<b>&</b>"],"sample.txt",{type:"text/plain"});
 Object.defineProperty(file,"arrayBuffer",{value:async()=>new TextEncoder().encode("<b>&</b>").buffer});
 fireEvent.change(screen.getByLabelText("Optional local file (maximum 2 MB)"),{target:{files:[file]}});
 await waitFor(()=>expect(screen.getByText(/Using sample\.txt/)).toBeTruthy());
 fireEvent.click(screen.getByRole("button",{name:"Encode"}));
 await waitFor(()=>expect((screen.getByRole("textbox",{name:"Encoding output"}) as HTMLTextAreaElement).value).toBe("&lt;b&gt;&amp;&lt;/b&gt;"));
});
it("decodes Unicode escapes from a selected UTF-8 text file",async()=>{
 render(<EncodingWorkbench initialMode="unicode-escapes"/>);
 fireEvent.click(screen.getByRole("button",{name:"Decode mode"}));
 const file=new File(["\\u{1F44B}"],"escaped.txt",{type:"text/plain"});
 Object.defineProperty(file,"arrayBuffer",{value:async()=>new TextEncoder().encode("\\u{1F44B}").buffer});
 fireEvent.change(screen.getByLabelText("Choose encoding file"),{target:{files:[file]}});
 await waitFor(()=>expect(screen.getByText(/Using escaped\.txt/)).toBeTruthy());
 fireEvent.click(screen.getByRole("button",{name:"Decode"}));
 await waitFor(()=>expect((screen.getByRole("textbox",{name:"Encoding output"}) as HTMLTextAreaElement).value).toBe("👋"));
});
