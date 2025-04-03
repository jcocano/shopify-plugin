import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define the schemas directory and the initialization file
const schemasDir = path.join(__dirname, '../schemas');
const initializationFile = 'initialization.schema.prisma';

// Read all files in the schemas directory, excluding the initialization file
const schemaFiles = fs.readdirSync(schemasDir)
    .filter(file => file.endsWith('.prisma') && file !== initializationFile);

let combinedSchema = '';

// Ensure the initialization file is processed first
const initializationPath = path.join(schemasDir, initializationFile);
if (fs.existsSync(initializationPath)) {
    const initializationContent = fs.readFileSync(initializationPath, { encoding: 'utf8' });
    combinedSchema += initializationContent + '\n\n';
} else {
    console.error(`Initialization file (${initializationFile}) not found in schemas directory.`);
    process.exit(1);
}

// Process and append content from the other schema files
schemaFiles.forEach(file => {
    const fullPath = path.join(schemasDir, file);
    let content = fs.readFileSync(fullPath, { encoding: 'utf8' });

    // Remove generator and datasource blocks from additional files
    const exclusionPatterns = [/generator\s*{[^}]*}/g, /datasource\s*db\s*{[^}]*}/g];
    exclusionPatterns.forEach(pattern => {
        content = content.replace(pattern, '');
    });

    combinedSchema += content + '\n\n';
});

// Write the combined schema to the output file
const outputPath = path.join(__dirname, '..', 'schema.prisma');
fs.writeFileSync(outputPath, combinedSchema);
console.log('Prisma schema file has been initialized successfully');
