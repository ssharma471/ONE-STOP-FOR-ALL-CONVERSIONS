# ONE STOP FOR CONVERSIONS Clean Modern MVP

A clean, modern, minimal all-in-one converter website.

## Includes

- Modern responsive UI
- Homepage with search
- Popular tools
- Category sections
- Individual tool pages
- Selected file preview after upload
- Remove selected file button
- Working backend for core MVP tools
- Placeholder UI for future AI/video/social integrations
- Footer credit: Built by Intop Digital

## Working tools

- Word to PDF
- PDF to Word
- JPG/PNG to PDF
- PDF to JPG ZIP
- Merge PDF
- Split PDF
- Compress PDF
- Rotate PDF
- Image Converter
- Image Compressor
- Image Resizer
- YouTube Thumbnail Downloader
- JSON Formatter
- JSON to CSV
- CSV to JSON
- QR Code Generator
- Base64 Encoder
- URL Encoder

## Install

```bash
pip install -r requirements.txt
```

Install LibreOffice for Word/PDF conversions:

```bash
brew install --cask libreoffice
```

## Run

```bash
python3 app.py
```

Open:

```text
http://localhost:8000
```

## Social Media Compliance

Social media tools are included only for content users own, have permission to use, or are legally allowed to download. This app does not bypass private accounts, paywalls, DRM, login walls, or copyright protections.


## Fixes in this version

- Navbar works correctly even when you are inside an individual tool page.
- Brand name changed to ONE STOP FOR CONVERSIONS.
- All tools are shown as active in the UI.
- More safe/local backend actions added for PDF, image, video/audio through FFmpeg, developer tools, and compliant social-media safe mode.

Note: Video/audio tools require FFmpeg installed. Word/PDF tools require LibreOffice. Advanced AI tools require an AI API for production-level output.


## Added Features Version

Added additional useful tools across:
- GIF Tools
- More PDF and Document tools
- More Image tools
- More Video and Audio tools
- More Social Media utilities
- More Developer tools
- More AI and Business placeholders

Tools that can run locally with current dependencies are marked Working. Tools that need APIs, OCR, advanced FFmpeg workflows, browser rendering, or AI models are marked Coming Soon.


## GIF Fix

The GIF section is now populated with:
- Image to GIF
- GIF to Images
- GIF to MP4
- GIF Compressor
- GIF Resizer
- GIF Speed Changer
- GIF Cropper
- Video to GIF

Working GIF tools:
- Image to GIF
- GIF to Images
- GIF to MP4, requires FFmpeg
- Video to GIF, requires FFmpeg


## Verified Status Cleanup

This version is conservative:
- Only tools with real implemented local backend logic are marked **Working**.
- Tools that need AI APIs, OCR, social-media providers, advanced FFmpeg workflows, or additional production testing are marked **Coming Soon**.
- Coming Soon tools are disabled from processing and show a clear reason on the tool page.
- PDF to Word includes a fallback editable-text DOCX converter if LibreOffice fails.


## Document Tools Fix

The Document section now contains actual tool cards.

Working Document tools:
- Excel to PDF
- PowerPoint to PDF
- Word to Text
- Text to PDF
- Text to Word
- Markdown to PDF
- Markdown to Word
- HTML to PDF
- CSV to Excel
- JSON to Excel

Coming Soon Document tools:
- URL to PDF
- Excel to CSV
- Excel to JSON
- EPUB to PDF
- PDF to EPUB
