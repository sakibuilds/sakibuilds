import fs from "node:fs";
import path from "node:path";

const source = "/home/nixxin/.hermes/nightly_builds_log.json";
const destination = path.resolve("src/data/builds.json");

const raw = fs.readFileSync(source, "utf8");
const parsed = JSON.parse(raw);

parsed.generated_at = new Date().toISOString();

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, `${JSON.stringify(parsed, null, 2)}\n`);
console.log(`Synced ${parsed.builds.length} builds to ${destination}`);
