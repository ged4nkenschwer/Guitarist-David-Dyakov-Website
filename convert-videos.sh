#!/bin/bash

echo "========================================"
echo "Video Optimization Script for macOS/Linux"
echo "========================================"
echo ""
echo "This script converts all .mov files to optimized MP4 format"
echo "Make sure FFmpeg is installed"
echo ""

# Check if FFmpeg is available
if ! command -v ffmpeg &> /dev/null; then
    echo "ERROR: FFmpeg is not installed or not in PATH"
    echo "Please install FFmpeg:"
    echo "  macOS: brew install ffmpeg"
    echo "  Ubuntu/Debian: sudo apt-get install ffmpeg"
    echo "  CentOS/RHEL: sudo yum install ffmpeg"
    echo ""
    exit 1
fi

echo "FFmpeg found! Starting conversion..."
echo ""

count=0
for file in *.mov; do
    # Check if file exists (handles case when no .mov files found)
    if [ ! -f "$file" ]; then
        continue
    fi
    
    count=$((count + 1))
    echo "[$count] Converting: $file"
    echo ""
    
    # Get filename without extension
    output="${file%.mov}.mp4"
    
    # Convert video with optimization settings
    ffmpeg -i "$file" \
      -c:v libx264 \
      -preset slow \
      -crf 23 \
      -c:a aac \
      -b:a 128k \
      -movflags +faststart \
      -pix_fmt yuv420p \
      -y \
      "$output"
    
    if [ $? -eq 0 ]; then
        echo "[SUCCESS] Created: $output"
        
        # Show file size comparison
        if [ -f "$file" ] && [ -f "$output" ]; then
            original_size=$(du -h "$file" | cut -f1)
            new_size=$(du -h "$output" | cut -f1)
            echo "  Original size: $original_size"
            echo "  New size: $new_size"
        fi
    else
        echo "[ERROR] Failed to convert: $file"
    fi
    echo ""
done

if [ $count -eq 0 ]; then
    echo "No .mov files found in current directory"
    exit 1
fi

echo "========================================"
echo "Conversion complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Check the new .mp4 files"
echo "2. Compare file sizes (MP4 should be 50-80% smaller)"
echo "3. Test the videos in a browser"
echo "4. Update index.html to use .mp4 files if desired"
echo ""





