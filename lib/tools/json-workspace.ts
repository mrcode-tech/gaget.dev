export type JsonDifference = { path: string; kind: "added" | "removed" | "changed"; before?: unknown; after?: unknown };
function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value !== null && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, stableValue(item)]));
  return value;
}
export function compareJsonDocuments(leftText: string, rightText: string): JsonDifference[] {
  const left = JSON.parse(leftText) as unknown, right = JSON.parse(rightText) as unknown;
  const differences: JsonDifference[] = [];
  function visit(a: unknown, b: unknown, path: string): void {
    if (JSON.stringify(stableValue(a)) === JSON.stringify(stableValue(b))) return;
    const ao = a !== null && typeof a === "object", bo = b !== null && typeof b === "object";
    if (Array.isArray(a) && Array.isArray(b)) {
      for (let i=0;i<Math.max(a.length,b.length);i++) { const p=`${path}[${i}]`; if(i>=a.length) differences.push({path:p,kind:"added",after:b[i]}); else if(i>=b.length) differences.push({path:p,kind:"removed",before:a[i]}); else visit(a[i],b[i],p); }
      return;
    }
    if(ao && bo && !Array.isArray(a) && !Array.isArray(b)) {
      const ar=a as Record<string,unknown>, br=b as Record<string,unknown>;
      for(const key of [...new Set([...Object.keys(ar),...Object.keys(br)])].sort()) { const p=path==="$"?`$.${key}`:`${path}.${key}`; if(!(key in ar)) differences.push({path:p,kind:"added",after:br[key]}); else if(!(key in br)) differences.push({path:p,kind:"removed",before:ar[key]}); else visit(ar[key],br[key],p); }
      return;
    }
    differences.push({path,kind:"changed",before:a,after:b});
  }
  visit(left,right,"$"); return differences;
}
