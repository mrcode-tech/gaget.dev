import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { JsonWorkbench } from "@/components/tool-workbenches";
import {
  compareJsonDocuments,
  diagnoseJson,
  escapeJsonStringContents,
  sortJsonKeys,
  unescapeJsonStringContents,
} from "@/lib/tools/json-workspace";

afterEach(cleanup);

function chooseFeature(label: string) {
  fireEvent.click(screen.getByRole("button", { name: "Features" }));
  fireEvent.click(screen.getByRole("menuitemradio", { name: new RegExp(label, "i") }));
}

describe("JSON workspace operations", () => {
  it("formats and minifies JSON without changing scalar values", () => {
    render(<JsonWorkbench />);
    fireEvent.change(screen.getByRole("textbox", { name: "Input JSON" }), { target: { value: '{"a": 1, "b": [true, null]}' } });
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByLabelText("Output").textContent).toContain('"a": 1');
    chooseFeature("Minify");
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByLabelText("Output").textContent).toBe('{"a":1,"b":[true,null]}');
  });

  it("shows a successful validation status without presenting a non-JSON output file", () => {
    render(<JsonWorkbench />);
    chooseFeature("Validate");
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByRole("status").textContent).toContain("JSON is valid");
    expect(screen.getByRole("button", { name: "Copy result" })).toBeDisabled();
  });

  it("runs Escape and Unescape as distinct string-content operations", () => {
    render(<JsonWorkbench />);
    const editor = screen.getByRole("textbox", { name: "Input JSON" });
    fireEvent.change(editor, { target: { value: 'line\n"quoted" \\ text' } });
    chooseFeature("Escape string contents");
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    const escaped = screen.getByLabelText("Output").textContent ?? "";
    expect(escaped).toContain('\\n');
    expect(escaped).toContain('\\\"quoted\\\"');
    fireEvent.change(editor, { target: { value: escaped } });
    chooseFeature("Unescape string contents");
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByLabelText("Output").textContent).toContain('line\n"quoted" \\ text');
  });

  it("validates JSON with exact one-based source positions and navigable diagnostics", () => {
    render(<JsonWorkbench />);
    const editor = screen.getByRole("textbox", { name: "Input JSON" }) as HTMLTextAreaElement;
    const invalid = '{\n  "name": "GaGet",\n  "ready": }';
    fireEvent.change(editor, { target: { value: invalid } });
    chooseFeature("Validate");
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    const diagnostic = screen.getByRole("button", { name: "Go to line 3, column 12" });
    expect(diagnostic.textContent).toContain("Expected a JSON value");
    fireEvent.click(diagnostic);
    expect(document.activeElement).toBe(editor);
    expect(editor.selectionStart).toBe(invalid.indexOf("}"));
    expect(editor.selectionEnd).toBe(invalid.indexOf("}") + 1);
    expect(screen.getByTestId("json-line-numbers").textContent).toBe("1\n2\n3");
  });

  it("clears stale diagnostics as soon as the source changes", () => {
    render(<JsonWorkbench />);
    const editor = screen.getByRole("textbox", { name: "Input JSON" });
    fireEvent.change(editor, { target: { value: '{"x": }' } });
    chooseFeature("Validate");
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByRole("alert")).toBeTruthy();
    fireEvent.change(editor, { target: { value: '{"x": 1}' } });
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("button", { name: /Go to line/ })).toBeNull();
  });

  it("compares nested structures, null values, and escaped property names", () => {
    const differences = compareJsonDocuments(
      '{"version":1,"present":null,"a.b":1,"items":[1,2]}',
      '{"version":2,"a.b":2,"items":[1,3],"ready":true}',
    );
    expect(differences.map((item) => item.path)).toEqual(["$[\"a.b\"]", "$.items[1]", "$.present", "$.ready", "$.version"]);
    expect(differences.find((item) => item.path === "$.present")?.kind).toBe("removed");
    expect(differences.find((item) => item.path === "$.ready")?.kind).toBe("added");
  });

  it("reports invalid JSON in either comparison document", () => {
    render(<JsonWorkbench initialMode="compare" />);
    fireEvent.change(screen.getByRole("textbox", { name: "JSON A input" }), { target: { value: '{"ok": true}' } });
    fireEvent.change(screen.getByRole("textbox", { name: "JSON B input" }), { target: { value: '{"bad": }' } });
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByRole("alert").textContent).toContain("Expected a JSON value");
    const diagnostic = screen.getByRole("button", { name: /Go to line 1, column 9/ });\n    fireEvent.click(diagnostic);\n    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "JSON B input" }));
  });

  it("sorts object keys recursively and preserves array order", () => {
    expect(JSON.stringify(sortJsonKeys({ z: 1, a: { y: 2, b: 3 }, list: [{ z: 1, a: 2 }, 0] })))
      .toBe('{"a":{"b":3,"y":2},"list":[{"a":2,"z":1},0],"z":1}');
  });

  it("escapes and unescapes JSON string contents without double-quoting", () => {
    const raw = 'line\n"quote" \\ emoji 😀';
    const escaped = escapeJsonStringContents(raw);
    expect(unescapeJsonStringContents(escaped)).toBe(raw);
    expect(() => unescapeJsonStringContents("\\q")).toThrow();
  });

  it("finds nested keys and scalar values and renders a collapsible tree", () => {
    render(<JsonWorkbench />);
    fireEvent.change(screen.getByRole("textbox", { name: "Input JSON" }), { target: { value: '{"person":{"name":"Ada"},"active":true}' } });
    chooseFeature("Find keys and values");
    fireEvent.change(screen.getByRole("textbox", { name: "Search text" }), { target: { value: "ada" } });
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByText("$.person.name")).toBeTruthy();
    chooseFeature("Tree viewer");
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByTestId("json-tree-view").textContent).toContain("Ada");
  });

  it("exposes File and Features menus and working sample/clear/undo actions", () => {
    render(<JsonWorkbench />);
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    const fileMenu = screen.getByTestId("json-file-menu");
    expect(within(fileMenu).getByRole("menuitem", { name: "Open JSON file…" })).toBeTruthy();
    fireEvent.click(within(fileMenu).getByRole("menuitem", { name: "Clear document" }));
    expect((screen.getByRole("textbox", { name: "Input JSON" }) as HTMLTextAreaElement).value).toBe("");
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Load sample JSON" }));
    expect((screen.getByRole("textbox", { name: "Input JSON" }) as HTMLTextAreaElement).value).toContain("GaGet.dev");
    fireEvent.change(screen.getByRole("textbox", { name: "Input JSON" }), { target: { value: '{"changed":true}' } });
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Undo" }));
    expect((screen.getByRole("textbox", { name: "Input JSON" }) as HTMLTextAreaElement).value).toContain("GaGet.dev");
    fireEvent.change(screen.getByRole("textbox", { name: "Input JSON" }), { target: { value: '{"changed":true}' } });
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Undo" }));
    expect((screen.getByRole("textbox", { name: "Input JSON" }) as HTMLTextAreaElement).value).toContain("GaGet.dev");
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Redo" }));
    expect((screen.getByRole("textbox", { name: "Input JSON" }) as HTMLTextAreaElement).value).toBe('{"changed":true}');
  });
  it("supports arrow-key menu navigation and Escape focus restoration", () => {
    render(<JsonWorkbench />);
    const trigger = screen.getByRole("button", { name: "Features" });
    fireEvent.click(trigger);
    const menu = screen.getByTestId("json-features-menu");
    const first = within(menu).getAllByRole("menuitemradio")[0] as HTMLButtonElement;
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(document.activeElement).toBe(within(menu).getAllByRole("menuitemradio")[1]);
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    expect(screen.queryByTestId("json-features-menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

});

describe("JSON parser and transforms", () => {
  it("maps exact offsets to one-based line and UTF-16 column for LF and CRLF", () => {
    for (const source of ['{\n  "x": }', '{\r\n  "x": }']) {
      const result = diagnoseJson(source);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.diagnostics[0].line).toBe(2);
        expect(result.diagnostics[0].column).toBe(8);
        expect(result.diagnostics[0].offset).toBe(source.indexOf("}"));
      }
    }
  });

  it.each([
    ["", "empty"],
    ["   \r\n  ", "empty"],
    ["{", "Unterminated JSON object"],
    ['{"a":1,}', "Trailing commas"],
    ['{"a":1 "b":2}', 'Expected "," or "}"'],
    ['{"a":"\\q"}', "Invalid escape sequence"],
    ['{"a":"\\u12xz"}', "four hexadecimal digits"],
    ["[true false]", 'Expected "," or "]"'],
    ["01", "Leading zeroes"],
    ["tru", "Invalid JSON literal"],
  ])("diagnoses malformed input %j", (source, message) => {
    const result = diagnoseJson(source);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.diagnostics[0].message.toLowerCase()).toContain(message.toLowerCase());
  });

  it("accepts valid nested JSON with Unicode and strict JSON literals", () => {
    const result = diagnoseJson('{"مرحبا":"😀","values":[null,true,false,-1.2e+3]}');
    expect(result.ok).toBe(true);
    if (result.ok) expect((result.value as { values: unknown[] }).values).toHaveLength(4);
  });

  it("counts UTF-16 code units consistently for emoji source navigation", () => {
    const source = '{"emoji":"😀","broken": }';
    const result = diagnoseJson(source);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.diagnostics[0].offset).toBe(source.indexOf("}"));
      expect(result.diagnostics[0].column).toBe(source.indexOf("}") + 1);
    }
  });
});
