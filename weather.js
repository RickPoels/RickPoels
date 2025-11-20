import fetch from "node-fetch";
import fs from "fs";

// CONFIG
const CITY = "Venlo,NL";
const API_KEY = process.env.OPENWEATHER_KEY;
const README = "README.md";

async function main() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;

  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });

  const content = `Currently, the weather is: **${temp}°C**, ${desc}\nToday, the sun rises at **${sunrise}** and sets at **${sunset}**.`;

  // Update README
  let readme = fs.readFileSync(README, "utf8");
  readme = replaceSection(readme, "WEATHER-SECTION", content);
  fs.writeFileSync(README, readme);
}

function replaceSection(src, section, newContent) {
  const start = `<!-- ${section}:START -->`;
  const end = `<!-- ${section}:END -->`;
  const reg = new RegExp(`${start}[\\s\\S]*?${end}`, "m");
  return src.replace(reg, `${start}\n${newContent}\n${end}`);
}

main().catch(console.error);
