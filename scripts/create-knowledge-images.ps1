# Create placeholder images for knowledge hub
$knowledgeDir = "public/images/knowledge"

# Ensure directory exists
if (-not (Test-Path $knowledgeDir)) {
    New-Item -ItemType Directory -Path $knowledgeDir -Force | Out-Null
}

# Image names and their associated colors
$images = @{
    "irrigation-tips.jpg" = "#2196F3"
    "maize-care.jpg" = "#FFC107"
    "greenhouse.jpg" = "#4CAF50"
    "composting.jpg" = "#8B4513"
    "pest-control.jpg" = "#FF5722"
    "crop-rotation.jpg" = "#9C27B0"
    "soil-health.jpg" = "#795548"
    "water-conservation.jpg" = "#00BCD4"
    "organic-farming.jpg" = "#8BC34A"
    "climate-smart.jpg" = "#607D8B"
    "market-trends.jpg" = "#FF9800"
    "livestock-care.jpg" = "#E91E63"
    "sustainable-farming.jpg" = "#4CAF50"
    "crop-diseases.jpg" = "#F44336"
    "fertilizer-use.jpg" = "#CDDC39"
}

Add-Type -AssemblyName System.Drawing

foreach ($image in $images.GetEnumerator()) {
    $filename = $image.Key
    $hexColor = $image.Value
    $path = Join-Path $knowledgeDir $filename
    
    # Skip if file already exists
    if (Test-Path $path) {
        Write-Host "Skipping $filename (already exists)" -ForegroundColor Yellow
        continue
    }
    
    # Create bitmap
    $bitmap = New-Object System.Drawing.Bitmap(800, 600)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Parse hex color
    $r = [Convert]::ToInt32($hexColor.Substring(1,2), 16)
    $g = [Convert]::ToInt32($hexColor.Substring(3,2), 16)
    $b = [Convert]::ToInt32($hexColor.Substring(5,2), 16)
    $color = [System.Drawing.Color]::FromArgb($r, $g, $b)
    
    # Fill background
    $brush = New-Object System.Drawing.SolidBrush($color)
    $graphics.FillRectangle($brush, 0, 0, 800, 600)
    
    # Add text
    $font = New-Object System.Drawing.Font("Arial", 32, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $text = $filename -replace "\.jpg$", "" -replace "-", " "
    $text = (Get-Culture).TextInfo.ToTitleCase($text)
    
    $textSize = $graphics.MeasureString($text, $font)
    $x = (800 - $textSize.Width) / 2
    $y = (600 - $textSize.Height) / 2
    
    $graphics.DrawString($text, $font, $textBrush, $x, $y)
    
    # Save
    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $textBrush.Dispose()
    $font.Dispose()
    
    Write-Host "Created $filename" -ForegroundColor Green
}

Write-Host "`nKnowledge hub placeholder images created successfully!" -ForegroundColor Cyan
