import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

dotenv.config();

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

export interface ScraperResult {
  success: boolean;
  name?: string;
  info?: string[];
  error?: string;
}

export class PersonScraper {
  /**
   * Uploads a local image to ImgBB to get a public URL.
   */
  private async uploadToImgBB(imagePath: string): Promise<string> {
    if (!IMGBB_API_KEY) {
      throw new Error('IMGBB_API_KEY is missing in .env file');
    }

    try {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));

      const response = await axios.post(`https://api.imgbb.com/1/upload`, formData, {
        params: {
          key: IMGBB_API_KEY,
        },
        headers: {
          ...formData.getHeaders(),
        },
      });

      if (response.data.success) {
        return response.data.data.url;
      } else {
        throw new Error(`ImgBB upload failed: ${JSON.stringify(response.data.error)}`);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(`ImgBB API Error: ${JSON.stringify(error.response.data.error)}`);
      }
      throw new Error(`ImgBB upload error: ${error.message}`);
    }
  }

  async scrape(imagePath: string): Promise<ScraperResult> {
    try {
      if (!SERPAPI_KEY) {
        throw new Error('SERPAPI_KEY is missing in .env file');
      }

      // 1. Handle Image Hosting
      let imageURL: string;
      if (imagePath.startsWith('http')) {
        imageURL = imagePath;
      } else {
        console.log(`Uploading local image to ImgBB...`);
        imageURL = await this.uploadToImgBB(imagePath);
        console.log(`Image uploaded successfully: ${imageURL}`);
      }

      // 2. Identify the person using Google Lens via SerpApi
      console.log(`Searching Google Lens for identity...`);
      const lensParams = {
        engine: 'google_lens',
        api_key: SERPAPI_KEY,
        url: imageURL,
      };

      const lensResponse = await axios.get('https://serpapi.com/search', { params: lensParams });
      const visualMatches = lensResponse.data.visual_matches;

      if (!visualMatches || visualMatches.length === 0) {
        return { success: false, error: "Can't find the person in the internet" };
      }

      // Extract the name from the first few matches
      const personName = visualMatches[0].title || visualMatches[0].source;
      if (!personName) {
        return { success: false, error: "Could not identify the person" };
      }

      console.log(`Identified as: ${personName}`);

      // 3. Gather information using the identified name
      console.log(`Gathering detailed information...`);
      const searchParams = {
        engine: 'google',
        api_key: SERPAPI_KEY,
        q: `${personName} biography information`,
      };

      const searchResponse = await axios.get('https://serpapi.com/search', { params: searchParams });
      const organicResults = searchResponse.data.organic_results;

      if (!organicResults || organicResults.length === 0) {
        return { success: false, error: "Could not gather information from browser" };
      }

      // 4. Extract information point-wise from snippets
      const infoPoints: string[] = [];
      organicResults.slice(0, 5).forEach((result: any) => {
        if (result.snippet) {
          infoPoints.push(result.snippet);
        }
      });

      return {
        success: true,
        name: personName,
        info: infoPoints,
      };

    } catch (error: any) {
      console.error('Error during scraping:', error.message);
      return { success: false, error: error.message };
    }
  }
}
