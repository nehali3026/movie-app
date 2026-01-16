import * as fs from 'fs';
import * as path from 'path';

export function createUploadDirectories() {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const postersDir = path.join(uploadsDir, 'posters');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  if (!fs.existsSync(postersDir)) {
    fs.mkdirSync(postersDir, { recursive: true });
  }
}



