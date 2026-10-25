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
  if (window.innerWidth < 768) {
    fireEvent.click(screen.getByRole("button", { name: "Feature", exact: true }));
    const menu = screen.getByTestId("json-features-menu");
    fireEvent.click(within(within(menu).getByTestId("json-mobile-feature-list")).getByRole("menuitemradio", { name: new RegExp("^" + label, "i") }));
    return;
  }
  const group = /^(Tree viewer|Find keys and values)/i.test(label)
    ? "View"
    : /^(Escape string contents|Unescape string contents)/i.test(label)
      ? "Convert"
      : "Utilities (Core Tools)";
  fireEvent.click(screen.getByRole("button", { name: group, exact: true }));
  const menu = screen.getByTestId("json-group-menu");
  fireEvent.click(within(menu).getByRole("menuitemradio", { name: new RegExp("^" + label, "i") }));
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
    expect(screen.queryByLabelText("Output")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    expect((within(screen.getByTestId("json-file-menu")).getByRole("menuitem", { name: "Copy result" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("does not render an output panel for invalid validation results", () => {
    render(<JsonWorkbench />);
    fireEvent.change(screen.getByRole("textbox", { name: "Input JSON" }), { target: { value: '{"ready": }' } });
    chooseFeature("Validate");
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByRole("alert").textContent).toContain("Expected a JSON value");
    expect(screen.queryByLabelText("Output")).toBeNull();
  });

  it("shows matching and empty Find results without an output panel", () => {
    render(<JsonWorkbench />);
    chooseFeature("Find keys and values");
    const search = screen.getByRole("textbox", { name: "Search text" });
    fireEvent.change(search, { target: { value: "GaGet" } });
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByText("$.name")).toBeTruthy();
    expect(screen.queryByLabelText("Output")).toBeNull();
    fireEvent.change(search, { target: { value: "no-such-key" } });
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByText("No matching keys or values.")).toBeTruthy();
    expect(screen.queryByLabelText("Output")).toBeNull();
  });

  it("shows separate File and Feature menus on mobile", () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 390 });
    window.dispatchEvent(new Event("resize"));
    render(<JsonWorkbench />);
    const fileTrigger = screen.getByRole("button", { name: "File", exact: true });
    const featureTrigger = screen.getByRole("button", { name: "Feature", exact: true });
    expect(fileTrigger).toBeTruthy();
    expect(featureTrigger).toBeTruthy();
    fireEvent.click(fileTrigger);
    const fileMenu = screen.getByTestId("json-file-menu");
    for (const label of ["Open JSON file…", "Copy result", "Download JSON", "Undo", "Redo", "Load sample JSON", "Clear document"]) {
      expect(within(fileMenu).getByRole("menuitem", { name: label })).toBeTruthy();
    }
    fireEvent.click(fileTrigger);
    fireEvent.click(featureTrigger);
    const featuresMenu = screen.getByTestId("json-features-menu");
    expect(within(featuresMenu).queryByTestId("json-mobile-file-actions")).toBeNull();
    expect(within(within(featuresMenu).getByTestId("json-mobile-feature-list")).getByRole("menuitemradio", { name: /^Format/ })).toBeTruthy();
  });

  it("uses a flat mobile JSON feature list with search and no category disclosure controls", () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 390 });
    window.dispatchEvent(new Event("resize"));
    render(<JsonWorkbench />);
    fireEvent.click(screen.getByRole("button", { name: "Feature", exact: true }));
    const menu = screen.getByTestId("json-features-menu");
    const mobileList = within(menu).getByTestId("json-mobile-feature-list");
    const search = within(mobileList).getByRole("searchbox", { name: "Search features" });
    expect(mobileList.querySelector("summary")).toBeNull();
    expect(within(mobileList).getAllByRole("menuitemradio")).toHaveLength(9);
    fireEvent.change(search, { target: { value: "  vIeW  " } });
    expect(within(mobileList).getByRole("menuitemradio", { name: /^Tree Viewer/i })).toBeTruthy();
    expect(within(mobileList).getByRole("menuitemradio", { name: /^Find keys and values/i })).toBeTruthy();
    expect(within(mobileList).getAllByRole("menuitemradio")).toHaveLength(2);
    fireEvent.change(search, { target: { value: "no-such-operation" } });
    expect(within(mobileList).getByRole("status").textContent).toContain("No matching features");
    fireEvent.change(search, { target: { value: "" } });
    expect(within(mobileList).getAllByRole("menuitemradio")).toHaveLength(9);
  });

  it("shows four desktop menu triggers and scopes each feature menu to its category", () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 1024 });
    window.dispatchEvent(new Event("resize"));
    render(<JsonWorkbench />);
    const bar = screen.getByTestId("json-editor-menubar");
    for (const label of ["File", "Utilities (Core Tools)", "View", "Convert"]) {
      expect(within(bar).getByRole("button", { name: label, exact: true })).toBeTruthy();
    }
    fireEvent.click(within(bar).getByRole("button", { name: "Utilities (Core Tools)", exact: true }));
    expect(within(screen.getByTestId("json-group-menu")).getAllByRole("menuitemradio")).toHaveLength(5);
    fireEvent.click(within(bar).getByRole("button", { name: "View", exact: true }));
    expect(within(screen.getByTestId("json-group-menu")).getAllByRole("menuitemradio")).toHaveLength(2);
    fireEvent.click(within(bar).getByRole("button", { name: "Convert", exact: true }));
    expect(within(screen.getByTestId("json-group-menu")).getAllByRole("menuitemradio")).toHaveLength(2);
    expect(within(bar).queryByRole("button", { name: "Features", exact: true })).toBeNull();
  });

  it("uses a stacked mobile operation action layout and a wider-screen row layout", () => {
    render(<JsonWorkbench />);
    const header = screen.getByTestId("json-operation-header");
    const description = screen.getByTestId("json-operation-description");
    const runButton = screen.getByTestId("json-run-operation");
    expect(header.className).toContain("flex-col");
    expect(header.className).toContain("md:flex-row");
    expect(runButton.className).toContain("w-full");
    expect(runButton.className).toContain("md:w-auto");
    expect(description.textContent).toBeTruthy();
  });

  it("does not repeat the JSON-specific privacy message in the workspace or File menu", () => {
    render(<JsonWorkbench />);
    expect(screen.queryByText(/JSON is processed locally in your browser/i)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    expect(screen.queryByText(/JSON is processed locally in your browser/i)).toBeNull();
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

  it("keeps an empty unescaped string result copyable and downloadable", () => {
    render(<JsonWorkbench />);
    chooseFeature("Unescape string contents");
    fireEvent.change(screen.getByRole("textbox", { name: "Input JSON" }), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByRole("status").textContent).toContain("unescaped");
    expect((screen.getByRole("button", { name: "Copy result" }) as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByRole("button", { name: "Download text result" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("validates JSON with exact one-based source positions and navigable diagnostics", () => {
    render(<JsonWorkbench />);
    const editor = screen.getByRole("textbox", { name: "Input JSON" }) as HTMLTextAreaElement;
    const invalid = '{\n  "name": "GaGet",\n  "ready": }';
    fireEvent.change(editor, { target: { value: invalid } });
    chooseFeature("Validate");
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    const diagnostic = screen.getByRole("button", { name: "Go to line 3, column 12" });
    expect(diagnostic.textContent).toContain("Input JSON · Line 3, column 12");
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
    const diagnostic = screen.getByRole("button", { name: /Go to line 1, column 9/ });
    fireEvent.click(diagnostic);
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "JSON B input" }));
  });

  it("sorts object keys recursively and preserves array order deterministically", () => {
    expect(JSON.stringify(sortJsonKeys({ z: 1, a: { y: 2, b: 3 }, list: [{ z: 1, a: 2 }, 0] })))
      .toBe('{"a":{"b":3,"y":2},"list":[{"a":2,"z":1},0],"z":1}');
    expect(JSON.stringify(sortJsonKeys({ "ä": 1, z: 2, a: 3 }))).toBe('{"a":3,"z":2,"ä":1}');
  });

  it("escapes and unescapes JSON string contents without double-quoting", () => {
    const raw = 'line\n"quote" \\ emoji 😀';
    const escaped = escapeJsonStringContents(raw);
    expect(unescapeJsonStringContents(escaped)).toBe(raw);
    expect(() => unescapeJsonStringContents("\\q")).toThrow();
  });

  it("navigates between key/value search results without guessing source offsets", () => {
    render(<JsonWorkbench />);
    chooseFeature("Find keys and values");
    fireEvent.change(screen.getByRole("textbox", { name: "Search text" }), { target: { value: "a" } });
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByText(/^Match 1 of \d+$/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next match" }));
    expect(screen.getByText(/^Match 2 of \d+$/)).toBeTruthy();
    expect(screen.getByTestId("json-find-match-1").getAttribute("data-active")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Previous match" }));
    expect(screen.getByText(/^Match 1 of \d+$/)).toBeTruthy();
  });

  it("navigates between structural comparison differences", () => {
    render(<JsonWorkbench initialMode="compare" />);
    fireEvent.change(screen.getByRole("textbox", { name: "JSON A input" }), { target: { value: '{"a":1,"b":1}' } });
    fireEvent.change(screen.getByRole("textbox", { name: "JSON B input" }), { target: { value: '{"a":2,"b":2}' } });
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByText("Difference 1 of 2")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next difference" }));
    expect(screen.getByText("Difference 2 of 2")).toBeTruthy();
    expect(screen.getByTestId("json-difference-1").getAttribute("data-active")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Previous difference" }));
    expect(screen.getByText("Difference 1 of 2")).toBeTruthy();
  });

  it("caps search results for a large JSON document and announces truncation", () => {
    render(<JsonWorkbench />);
    const source = JSON.stringify(Array.from({ length: 1100 }, (_, index) => ({ label: "needle-" + index })));
    fireEvent.change(screen.getByRole("textbox", { name: "Input JSON" }), { target: { value: source } });
    chooseFeature("Find keys and values");
    fireEvent.change(screen.getByRole("textbox", { name: "Search text" }), { target: { value: "needle" } });
    fireEvent.click(screen.getByRole("button", { name: "Run operation" }));
    expect(screen.getByText("Search results (1000)")).toBeTruthy();
    expect(screen.getByText("Showing up to 1,000 matches.")).toBeTruthy();
    expect(screen.getAllByTestId(/^json-find-match-/)).toHaveLength(1000);
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
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Redo" }));
    expect((screen.getByRole("textbox", { name: "Input JSON" }) as HTMLTextAreaElement).value).toBe('{"changed":true}');
  });
  it("supports arrow-key menu navigation and Escape focus restoration", () => {
    render(<JsonWorkbench />);
    const trigger = screen.getByRole("button", { name: "Utilities (Core Tools)", exact: true });
    fireEvent.click(trigger);
    const menu = screen.getByTestId("json-group-menu");
    const items = within(menu).getAllByRole("menuitemradio");
    const first = items[0] as HTMLButtonElement;
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[1]);
    fireEvent.keyDown(document.activeElement!, { key: "Escape" });
    expect(screen.queryByTestId("json-group-menu")).toBeNull();
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

  it("handles large documents and rejects nesting beyond the documented limit", () => {
    const largeSource = JSON.stringify(Array.from({ length: 2000 }, (_, index) => ({ id: index, value: "entry-" + index })));
    const largeResult = diagnoseJson(largeSource);
    expect(largeResult.ok).toBe(true);
    if (largeResult.ok) expect((largeResult.value as unknown[]).length).toBe(2000);

    const deeplyNested = "[".repeat(513) + "0" + "]".repeat(513);
    const nestedResult = diagnoseJson(deeplyNested);
    expect(nestedResult.ok).toBe(false);
    if (!nestedResult.ok) expect(nestedResult.diagnostics[0].message).toContain("nesting depth");
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

  it("keeps the compact command bar sticky and below the global header on desktop", () => {
    render(<JsonWorkbench />);
    const commandBar = screen.getByTestId("json-editor-menubar");
    expect(commandBar.className).toContain("sticky");
    expect(commandBar.className).toContain("top-0");
    expect(commandBar.className).toContain("lg:top-[68px]");
  });
it("shows the complete File action set in the standalone tablet/desktop menu", () => {
  render(<JsonWorkbench />);
  fireEvent.click(screen.getByRole("button", { name: "File" }));
  const fileMenu = screen.getByTestId("json-file-menu");
  for (const label of [
    "Open JSON file…",
    "Copy result",
    "Download JSON",
    "Undo",
    "Redo",
    "Load sample JSON",
    "Clear document",
  ]) {
    expect(within(fileMenu).getByRole("menuitem", { name: label })).toBeTruthy();
  }
  expect(within(fileMenu).getAllByRole("menuitem")).toHaveLength(7);
  expect(screen.queryByTestId("json-mobile-file-actions")).toBeNull();
});
});
