# Download landing page images
$landingDir = "public/images/landing"

# African farmers in field - hero image
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1920&h=1080&fit=crop&q=80" -OutFile "$landingDir/hero.jpg"

# Farmers section - African farmer with produce
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop&q=80" -OutFile "$landingDir/farmers-section.jpg"

# Learners section - students learning
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=800&fit=crop&q=80" -OutFile "$landingDir/learners-section.jpg"

# Students section - young professionals
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop&q=80" -OutFile "$landingDir/students-section.jpg"

Write-Host "Landing page images downloaded successfully!" -ForegroundColor Green
