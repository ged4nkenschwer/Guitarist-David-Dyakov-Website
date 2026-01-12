# Video Optimization Guide

This guide will help you optimize your video files for better web performance and faster loading times.

## Current Situation

Your website currently uses `.mov` (QuickTime) files which are:
- Not optimized for web delivery
- Often larger in file size than necessary
- May not be supported by all browsers
- Load slower than optimized formats

## Recommended Solution: Convert to Optimized MP4

Converting your videos to optimized MP4 format will:
- **Reduce file size by 50-80%** (depending on original quality)
- **Improve browser compatibility** (MP4 is universally supported)
- **Enable faster loading** with proper compression
- **Support range requests** for better streaming

## Step 1: Install FFmpeg

FFmpeg is a free, open-source tool for video conversion. Install it based on your operating system:

### Windows
1. Download from: https://www.gyan.dev/ffmpeg/builds/
2. Extract and add to PATH, or use the full path to `ffmpeg.exe`

### macOS
```bash
brew install ffmpeg
```

### Linux
```bash
sudo apt-get install ffmpeg  # Ubuntu/Debian
sudo yum install ffmpeg      # CentOS/RHEL
```

## Step 2: Convert Videos

Run these commands in your project directory to convert each video:

### Video 1: Capricio Diabolico
```bash
ffmpeg -i "Capricio Diabolico Slow Movement.Postojna Festival.mov" \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -pix_fmt yuv420p \
  "Capricio Diabolico Slow Movement.Postojna Festival.mp4"
```

### Video 2: Homenaje
```bash
ffmpeg -i "Homenaje pour Le Tombeau de Claude Debussy by Manuel de Falla.Finale.Postojna Festival.mov" \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -pix_fmt yuv420p \
  "Homenaje pour Le Tombeau de Claude Debussy by Manuel de Falla.Finale.Postojna Festival.mp4"
```

### Video 3: Rossiniana
```bash
ffmpeg -i "Rossiniana Nr.1 op.119 .Finale . Postoja Guitar Festival 2025.mov" \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -pix_fmt yuv420p \
  "Rossiniana Nr.1 op.119 .Finale . Postoja Guitar Festival 2025.mp4"
```

### Video 4: Hora
```bash
ffmpeg -i "Hora by Stephan Rak.Finale.Donnersbergiade 2025.mov" \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  -pix_fmt yuv420p \
  "Hora by Stephan Rak.Finale.Donnersbergiade 2025.mp4"
```

## What These Settings Do

- **`-c:v libx264`**: Uses H.264 codec (best browser support)
- **`-preset slow`**: Better compression (smaller files), takes longer to encode
- **`-crf 23`**: Quality setting (18-28 range, 23 is good balance)
- **`-c:a aac`**: AAC audio codec (universal support)
- **`-b:a 128k`**: Audio bitrate (128k is good for music)
- **`-movflags +faststart`**: Moves metadata to beginning (enables faster streaming)
- **`-pix_fmt yuv420p`**: Ensures compatibility with all browsers

## Step 3: Batch Conversion Script

For convenience, here's a batch script to convert all videos at once:

### Windows (convert-videos.bat)
```batch
@echo off
echo Converting all .mov files to optimized MP4...

for %%f in (*.mov) do (
    echo Converting: %%f
    ffmpeg -i "%%f" -c:v libx264 -preset slow -crf 23 -c:a aac -b:a 128k -movflags +faststart -pix_fmt yuv420p "%%~nf.mp4"
)

echo Conversion complete!
pause
```

### macOS/Linux (convert-videos.sh)
```bash
#!/bin/bash
echo "Converting all .mov files to optimized MP4..."

for file in *.mov; do
    if [ -f "$file" ]; then
        echo "Converting: $file"
        ffmpeg -i "$file" \
          -c:v libx264 \
          -preset slow \
          -crf 23 \
          -c:a aac \
          -b:a 128k \
          -movflags +faststart \
          -pix_fmt yuv420p \
          "${file%.mov}.mp4"
    fi
done

echo "Conversion complete!"
```

Make the script executable (Linux/macOS):
```bash
chmod +x convert-videos.sh
```

## Step 4: Update HTML (Optional - Only if you want to use MP4)

After conversion, you can optionally update `index.html` to use the `.mp4` files instead of `.mov`. However, the current setup will work with both formats.

## Step 5: Verify File Sizes

After conversion, check the file sizes:
- Original `.mov` files are typically 50-200MB+
- Optimized `.mp4` files should be 10-50MB (50-80% smaller)

## Additional Optimization Tips

### For Even Smaller Files (Lower Quality)
If file size is still too large, you can:
1. Reduce resolution: Add `-vf "scale=1280:720"` (for 720p) or `-vf "scale=1920:1080"` (for 1080p)
2. Lower quality: Change `-crf 23` to `-crf 28` (lower quality, smaller file)
3. Reduce frame rate: Add `-r 30` (if original is 60fps)

### For Better Quality (Larger Files)
If you want better quality:
1. Higher quality: Change `-crf 23` to `-crf 18` (higher quality, larger file)
2. Higher audio: Change `-b:a 128k` to `-b:a 192k`

## Expected Results

After optimization:
- ✅ **50-80% smaller file sizes**
- ✅ **Faster initial load times**
- ✅ **Better streaming performance** (with range requests)
- ✅ **Improved browser compatibility**
- ✅ **Better mobile performance**

## Server Configuration

The `netlify.toml` file has been updated with:
- ✅ Long-term caching for video files (1 year)
- ✅ Range request support (for video streaming)
- ✅ Proper MIME types
- ✅ Compression headers

These optimizations work automatically once deployed to Netlify.

## Testing

After conversion and deployment:
1. Test video loading in different browsers
2. Check network tab in browser DevTools to see file sizes
3. Verify videos play smoothly on mobile devices
4. Monitor page load times (should be significantly faster)

## Need Help?

If you encounter issues:
- Ensure FFmpeg is installed and in your PATH
- Check video file paths are correct
- Verify you have enough disk space
- Test one video first before batch conversion






