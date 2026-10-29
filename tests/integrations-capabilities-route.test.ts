import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/mcp/capabilities/route";

describe("public MCP capability catalog", () => {
  it("publishes runtime registry metadata without requiring credentials", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.protocolTools).toEqual(["list_capabilities", "execute_operation", "execute_workflow"]);
    expect(payload.capabilities.some((item: { id: string }) => item.id === "json.validate")).toBe(true);
    expect(JSON.stringify(payload)).not.toContain("MCP_AUTH_TOKEN");
  });
});
