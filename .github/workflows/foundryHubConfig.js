var fs = require("fs");
var fileContent = fs.readFileSync("vue.config.js", "utf-8");
fileContent = fileContent.concat("\n").replace(/};(?:.(?!};))/gims, "");
var addition = "filenameHashing:false\n};";
if (!fileContent.trim().endsWith(",")) {
  addition = ",\n" + addition;
}
fileContent += addition;
fs.writeFileSync("vue.config.js", fileContent);
