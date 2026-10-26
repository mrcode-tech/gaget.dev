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
