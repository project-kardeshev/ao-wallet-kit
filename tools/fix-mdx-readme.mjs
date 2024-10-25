import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * Function to remove content between <!-- toc --> and <!-- tocstop -->
 * @param {string} filePath - The path to the file to be modified.
 */
function removeTOC(filePath) {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');

    // Use a regex to remove the content between <!-- toc --> and <!-- tocstop -->
    const updatedContent = content.replace(
      /<!-- toc -->[\s\S]*?<!-- tocstop -->/g,
      '',
    );

    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`TOC removed from ${filePath}`);
  } catch (error) {
    console.error(`Error processing the file: ${error.message}`);
  }
}

// Example usage
const filePath = path.join(__dirname, '../docs/README.mdx');
removeTOC(filePath);
