# 🔍 Information Scraper

An automated tool that identifies people from images using reverse image search and gathers detailed information about them from the internet.

## ✨ Features

- **Reverse Image Search**: Uses Google Lens (via SerpApi) to identify people from provided images.
- **Automated Info Gathering**: Once identified, it searches for biographies and key information about the person.
- **Point-wise Results**: Presents gathered information in a clear, bulleted list.
- **Error Handling**: Notifies if the person cannot be identified or if no information is available online.

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **API**: [SerpApi](https://serpapi.com/) (Google Lens & Google Search)
- **Libraries**: `axios`, `dotenv`

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- A [SerpApi Account](https://serpapi.com/) to get your API key.

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd information-scrapper
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and provide your API keys:
     - `SERPAPI_KEY`: Get this from [SerpApi](https://serpapi.com/).
     - `IMGBB_API_KEY`: Get this from [ImgBB API](https://api.imgbb.com/).

### Usage

1. **Add Images**:
   Place the images you want to scrape into the `images/` folder. Supported formats: `.jpg`, `.jpeg`, `.png`.

2. **Run the Tool**:
   ```bash
   npm start
   ```

## 📁 Project Structure

```text
information-scrapper/
├── images/             # Target images for identification
├── src/
│   ├── index.ts        # Main entry point and file handler
│   └── scraper.ts     # Core logic for API interaction and data extraction
├── .env               # Private API keys (ignored by git)
├── .env.example        # Template for environment variables
├── package.json        # Scripts and dependencies
└── tsconfig.json       # TypeScript configuration
```

## ⚠️ Important Note on Image Hosting

The Google Lens API requires images to be accessible via a **public URL**. 

Current implementation:
- The tool scans the `images/` folder.
- To successfully identify people, the image paths provided to the API must be public URLs. 
- **Recommendation**: For local images, integrate a cloud upload service (like Imgur or AWS S3) to host the image temporarily before passing the URL to the scraper.

## 📜 License

ISC License
