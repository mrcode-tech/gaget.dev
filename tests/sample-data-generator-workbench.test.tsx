import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SampleDataGeneratorWorkbench } from "@/components/sample-data-generator-workbench";
afterEach(cleanup);
it("generates bounded synthetic JSON records and exposes output",()=>{render(<SampleDataGeneratorWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Generate/i}));const output=screen.getByRole("textbox",{name:"Generated sample output"}) as HTMLTextAreaElement;const records=JSON.parse(output.value);expect(records).toHaveLength(5);expect(records[0].email).toBe("user1@example.test");});
