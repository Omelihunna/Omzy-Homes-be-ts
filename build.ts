import * as fs from 'fs-extra';
import { join } from 'path';
import { execSync } from 'child_process';

// Transpile TypeScript files to JavaScript
execSync('tsc');

// Copy EJS files to the output directory
const sourceDir = join(__dirname, 'src', 'views');
const destDir = join(__dirname, 'dist', 'views');
fs.copySync(sourceDir, destDir);

// Copy CSS files to the output directory
const cssSourceDir = join(__dirname, "src/public", "stylesheets");
const cssDestDir = join(__dirname, "dist/public", "stylesheets");
fs.copySync(cssSourceDir, cssDestDir)