# 📚 PDF Genie

Welcome to **PDF Genie**! Your ultimate tool for converting PDF files into images effortlessly. 🚀

## ✨ Features

- **Convert PDFs to Images**: Transform each page of your PDF into high-quality images.
- **Easy to Use**: Simple command-line interface for quick conversions.
- **Custom Output Directory**: Specify where you want your images saved.

## 🛠️ Installation

1. **Clone the Repository**:

   ```sh
   git clone https://github.com/yourusername/pdf-genie.git
   cd pdf-genie
   ```

2. **Install Dependencies**:

   ```sh
   bun install
   ```

3. **Install GraphicsMagick**:

   - **macOS**:
     ```
     brew install graphicsmagick
     brew install ghostscript
     ```
   - **Ubuntu/Debian**:
     ```
     sudo apt-get install graphicsmagick
     sudo apt-get install ghostscript
     ```

4. **Verify Installation**:
   ```
   gm -version
   ```

## 🚀 Usage

Convert your PDFs to images with a single command:

```
bun index.ts [options] <files...>
```

### Options

- `-o, --output <directory>`: Specify the output directory for the converted images (default: `output`).

### Example

```
bun index.ts -o my_images /path/to/your/file.pdf
```

## 📝 License

This project is licensed under the MIT License.

Happy Converting! 🎉
