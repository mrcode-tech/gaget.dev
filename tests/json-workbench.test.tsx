import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { JsonWorkbench } from "@/components/tool-workbenches";
afterEach(cleanup);
describe("JSON workspace",()=>{
  it("formats, minifies, and validates JSON in the same workspace",()=>{
    render(<JsonWorkbench/>);
    fireEvent.change(screen.getByRole("textbox",{name:"Input JSON"}),{target:{value:'{"a": 1}' }});
    fireEvent.click(screen.getByRole("button",{name:"Run format"}));
    expect(screen.getByLabelText("JSON output").textContent).toContain('"a": 1');
    fireEvent.click(screen.getByRole("button",{name:"Minify"}));
    fireEvent.click(screen.getByRole("button",{name:"Run minify"}));
    expect(screen.getByLabelText("JSON output").textContent).toBe('{"a":1}');
    fireEvent.click(screen.getByRole("button",{name:"Validate"}));
    fireEvent.click(screen.getByRole("button",{name:"Run validate"}));
    expect(screen.getByRole("status").textContent).toContain("JSON is valid");
  });
  it("compares documents and reports structural paths",()=>{
    render(<JsonWorkbench initialMode="compare"/>);
    fireEvent.change(screen.getByRole("textbox",{name:"JSON A input"}),{target:{value:'{"name":"GaGet","version":1}' }});
    fireEvent.change(screen.getByRole("textbox",{name:"JSON B input"}),{target:{value:'{"name":"GaGet","version":2,"ready":true}' }});
    fireEvent.click(screen.getByRole("button",{name:"Run comparison"}));
    expect(screen.getByText("$.version")).toBeTruthy();
    expect(screen.getByText("$.ready")).toBeTruthy();
    expect(screen.getByText(/Comparison result \(2 differences\)/)).toBeTruthy();
  });
  it("reports invalid JSON in compare mode",()=>{
    render(<JsonWorkbench initialMode="compare"/>);
    fireEvent.change(screen.getByRole("textbox",{name:"JSON A input"}),{target:{value:"{bad"}});
    fireEvent.click(screen.getByRole("button",{name:"Run comparison"}));
    expect(screen.getByRole("alert")).toBeTruthy();
  });
});
