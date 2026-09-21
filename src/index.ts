import fs from 'fs';
import path from 'path';
import { PersonScraper } from './scraper';

async function main() {
  const scraper = new PersonScraper();
  const imagesDir = path.join(__dirname, '..', 'images');

  if (!fs.existsSync(imagesDir)) {
    console.error('Images folder not found. Please create an "images" folder in the root directory.');
    process.exit(1);
  }

  const files = fs.readdirSync(imagesDir).filter(file =>
    ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
  );

  if (files.length === 0) {
    console.log('No images found in the images folder.');
    return;
  }

  console.log(`Found ${files.length} images. Starting scrape...\n`);

  for (const file of files) {
    const imagePath = path.join(imagesDir, file);
    console.log(`--- Processing ${file} ---`);

    // Note: As implemented in scraper.ts, this expects a URL.
    // To use local files with SerpApi, you would need to upload them first.
    // For this tool, we'll pass the path and note that a public URL is required for the API.
    const result = await scraper.scrape(imagePath);

    if (result.success) {
      console.log(`Person: ${result.name}`);
      console.log('Information:');
      result.info?.forEach((point, index) => {
        console.log(`${index + 1}. ${point}`);
      });
    } else {
      console.log(`Result: ${result.error}`);
    }
    console.log('\n');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
});
