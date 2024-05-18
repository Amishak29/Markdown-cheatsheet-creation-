import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const solutions_file_path = "./generate_solutions/" + process.env.PARENT_JSON_FILE_NAME + "_solutions.json";
const markdown_folder_path = "./generate_markdown";
const markdown_file_path = path.join(markdown_folder_path, "_markdown.md");

const readFileAsync = (file, options) =>
  new Promise((resolve, reject) => {
    fs.readFile(file, options, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });

const writeFileAsync = (file, data, options) =>
  new Promise((resolve, reject) => {
    fs.writeFile(file, data, options, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

async function generateMarkdown() {
  try {

    if (!fs.existsSync(markdown_folder_path)) {
      fs.mkdirSync(markdown_folder_path);
    }

    const fileData = await readFileAsync(solutions_file_path, "utf8");
    const data = JSON.parse(fileData);

    let markdownContent = "# Questions and Solutions\n\n";

    data.forEach((item, index) => {
      markdownContent += `## Question ${index + 1}\n`;
      markdownContent += `${item.prompt_response}\n\n`;

      markdownContent += `### Solution\n`;
      markdownContent += `${item.solution}\n\n`;

      markdownContent += "---\n\n";
    });

    await writeFileAsync(markdown_file_path, markdownContent, "utf8");
    console.log(`Markdown file has been generated at ${markdown_file_path}`);
  } catch (error) {
    console.error("Error generating markdown file:", error);
  }
}

generateMarkdown();
