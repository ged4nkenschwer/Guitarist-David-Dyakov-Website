@echo off
echo ========================================
echo Video Optimization Script for Windows
echo ========================================
echo.
echo This script converts all .mov files to optimized MP4 format
echo Make sure FFmpeg is installed and accessible
echo.

REM Check if FFmpeg is available
where ffmpeg >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: FFmpeg is not installed or not in PATH
    echo Please install FFmpeg from: https://www.gyan.dev/ffmpeg/builds/
    echo.
    pause
    exit /b 1
)

echo FFmpeg found! Starting conversion...
echo.

set count=0
for %%f in (*.mov) do (
    set /a count+=1
    echo [%count%] Converting: %%f
    echo.
    
    REM Get filename without extension
    set "input=%%f"
    set "output=%%~nf.mp4"
    
    REM Convert video with optimization settings
    ffmpeg -i "%%f" ^
      -c:v libx264 ^
      -preset slow ^
      -crf 23 ^
      -c:a aac ^
      -b:a 128k ^
      -movflags +faststart ^
      -pix_fmt yuv420p ^
      -y ^
      "%%~nf.mp4"
    
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] Created: %%~nf.mp4
    ) else (
        echo [ERROR] Failed to convert: %%f
    )
    echo.
)

echo ========================================
echo Conversion complete!
echo ========================================
echo.
echo Next steps:
echo 1. Check the new .mp4 files
echo 2. Compare file sizes (MP4 should be 50-80%% smaller)
echo 3. Test the videos in a browser
echo 4. Update index.html to use .mp4 files if desired
echo.
pause

