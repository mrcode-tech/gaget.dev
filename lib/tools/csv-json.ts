export type CsvJsonMode = "csv-to-json" | "json-to-csv";

function parseCsvRecords(input: string, delimiter = ","): string[][] {
  if (delimiter.length !== 1 || /["\r\n]/.test(delimiter)) throw new TypeError("Delimiter must be one ordinary character");
  if (!input) return [];
  const source = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
  const records: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  let afterQuote = false;
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (char === '"') {
        if (source[i + 1] === '"') { field += '"'; i++; }
        else { quoted = false; afterQuote = true; }
      } else field += char;
      continue;
    }
    if (afterQuote) {
      if (char === delimiter) { row.push(field); field = ""; afterQuote = false; continue; }
      if (char === "\r" || char === "\n") {
        row.push(field); records.push(row); row = []; field = ""; afterQuote = false;
        if (char === "\r" && source[i + 1] === "\n") i++;
        continue;
      }
      throw new SyntaxError("Unexpected character after a closing CSV quote");
    }
    if (char === '"') {
      if (field.length !== 0) throw new SyntaxError("A CSV quote may only begin an empty field");
      quoted = true;
    } else if (char === delimiter) {
      row.push(field); field = "";
    } else if (char === "\r" || char === "\n") {
      row.push(field); records.push(row); row = []; field = "";
      if (char === "\r" && source[i + 1] === "\n") i++;
    } else field += char;
  }
  if (quoted) throw new SyntaxError("Unterminated quoted CSV field");
  if (afterQuote || field.length > 0 || row.length > 0 || (!source.endsWith("\n") && !source.endsWith("\r"))) {
    row.push(field);
    records.push(row);
  }
  return records;
}

function escapeCsvField(value: string, delimiter: string): string {
  return value.includes(delimiter) || /["\r\n]/.test(value) || /^\s|\s$/.test(value)
    ? '"' + value.replace(/"/g, '""') + '"'
    : value;
}

export function csvToJson(input: string, delimiter = ","): string {
  const records = parseCsvRecords(input, delimiter);
  if (records.length === 0) return "[]";
  const headers = records[0].map((header) => header.trim());
  if (headers.some((header) => !header)) throw new SyntaxError("CSV header names cannot be empty");
  if (new Set(headers).size !== headers.length) throw new SyntaxError("CSV header names must be unique");
  const objects = records.slice(1).filter((row) => !(row.length === 1 && row[0] === "")).map((row, index) => {
    if (row.length !== headers.length) throw new SyntaxError(`CSV row ${index + 2} has ${row.length} fields; expected ${headers.length}`);
    const item: Record<string, string> = {};
    headers.forEach((header, column) => { item[header] = row[column]; });
    return item;
  });
  return JSON.stringify(objects, null, 2);
}

export function jsonToCsv(input: string, delimiter = ","): string {
  if (delimiter.length !== 1 || /["\r\n]/.test(delimiter)) throw new TypeError("Delimiter must be one ordinary character");
  const value: unknown = JSON.parse(input);
  if (!Array.isArray(value)) throw new TypeError("JSON input must be an array of objects");
  if (value.length === 0) return "";
  const objects = value.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new TypeError(`JSON row ${index + 1} must be an object`);
    return item as Record<string, unknown>;
  });
  const headers: string[] = [];
  for (const object of objects) for (const key of Object.keys(object)) if (!headers.includes(key)) headers.push(key);
  if (headers.length === 0) throw new TypeError("JSON objects must contain at least one field");
  const rows = [headers, ...objects.map((object, index) => headers.map((key) => {
    const item = object[key];
    if (item === undefined || item === null) return "";
    if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") return String(item);
    throw new TypeError(`JSON row ${index + 1}, field "${key}" is nested; only scalar values can be converted to CSV`);
  }))];
  return rows.map((row) => row.map((field) => escapeCsvField(field, delimiter)).join(delimiter)).join("\r\n");
}
