import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DataGeneratorWorkbench } from "@/components/sample-data-generator-workbench";
afterEach(cleanup);
it("generates bounded synthetic JSON records and exposes output",()=>{render(<DataGeneratorWorkbench/>);fireEvent.click(screen.getByRole("button",{name:/Generate/i}));const output=screen.getByRole("textbox",{name:"Generated sample output"}) as HTMLTextAreaElement;const records=JSON.parse(output.value);expect(records).toHaveLength(5);expect(records[0].email).toBe("user1@example.test");});

it("generates UUID v4 identifiers from Data Generator",()=>{render(<DataGeneratorWorkbench/>);fireEvent.click(screen.getByRole("combobox",{name:"Data generator operation"}));fireEvent.click(screen.getByRole("option",{name:"UUID v4 identifiers"}));fireEvent.click(screen.getByRole("button",{name:/Generate/i}));const output=screen.getByRole("textbox",{name:"Generated sample output"}) as HTMLTextAreaElement;const ids=output.value.split("\n");expect(ids).toHaveLength(5);expect(ids[0]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);});
