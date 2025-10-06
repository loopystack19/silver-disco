$crops = @('wheat', 'beans', 'tomatoes', 'cabbage', 'carrots', 'bananas', 'rice', 'tilapia', 'sweet_potatoes', 'coffee', 'avocados', 'sorghum', 'potatoes', 'peas', 'green_grams', 'cowpeas', 'groundnuts', 'sugarcane', 'tea', 'macadamia', 'milk', 'passion_fruits', 'kale')

foreach($crop in $crops) {
    $content = "Placeholder image for $crop"
    $path = "public\images\farming\$crop.jpg"
    $content | Out-File -FilePath $path -Encoding UTF8
}

$farmers = @('john_kamau', 'mary_wanjiku', 'peter_omondi', 'grace_akinyi', 'david_kipchoge', 'sarah_muthoni', 'james_mutua', 'lucy_njeri', 'daniel_kimani', 'esther_wangari')

foreach($farmer in $farmers) {
    $content = "Placeholder profile image for $farmer"
    $path = "public\images\farmers\$farmer.jpg"
    $content | Out-File -FilePath $path -Encoding UTF8
}

Write-Host "Placeholder images created successfully!"
