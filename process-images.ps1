# Food Image Processor Script
# This script copies, renames, and prepares food images for the project

param(
    [string]$DownloadsPath = "$env:USERPROFILE\Downloads",
    [string]$TargetPath = "d:\202601app\1228food\public\items"
)

# Food items mapping (index 9-50)
$foodItems = @{
    9 = "ramen"
    10 = "pasta"
    11 = "burger"
    12 = "peking-duck"
    13 = "xiaolongbao"
    14 = "bak-kut-teh"
    15 = "satay"
    16 = "hainanese-chicken"
    17 = "char-siu"
    18 = "oyster-omelette"
    19 = "beef-noodle"
    20 = "bubble-tea"
    21 = "kimchi"
    22 = "bibimbap"
    23 = "korean-fried-chicken"
    24 = "steak"
    25 = "hot-dog"
    26 = "macaron"
    27 = "escargot"
    28 = "french-onion-soup"
    29 = "schweinshaxe"
    30 = "bratwurst"
    31 = "paella"
    32 = "greek-salad"
    33 = "doner-kebab"
    34 = "tagine"
    35 = "borscht"
    36 = "pirozhki"
    37 = "tacos"
    38 = "churros"
    39 = "feijoada"
    40 = "meat-pie"
    41 = "butter-chicken"
    42 = "biryani"
    43 = "green-curry"
    44 = "pho"
    45 = "poke-bowl"
    46 = "tiramisu"
}

Write-Host "Food Image Processor" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""

# Get all PNG files from Downloads sorted by date (newest first)
$pngFiles = Get-ChildItem -Path $DownloadsPath -Filter "*.png" | 
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-1) } |
    Sort-Object LastWriteTime

Write-Host "Found $($pngFiles.Count) PNG files from today in Downloads" -ForegroundColor Yellow

if ($pngFiles.Count -eq 0) {
    Write-Host "No PNG files found. Please check if images were downloaded." -ForegroundColor Red
    exit 1
}

# Display files found
Write-Host ""
Write-Host "Files found:" -ForegroundColor Green
$pngFiles | ForEach-Object { 
    Write-Host "  - $($_.Name) ($(($_.Length / 1KB).ToString('N1')) KB) - $($_.LastWriteTime)" 
}

# Ask user to confirm mapping
Write-Host ""
Write-Host "These files will be mapped to food items 9-$($8 + $pngFiles.Count)" -ForegroundColor Yellow
Write-Host "Press Enter to continue or Ctrl+C to cancel..."
Read-Host

# Copy and rename files
$index = 9
foreach ($file in $pngFiles) {
    if ($index -gt 50) { break }
    
    $foodName = $foodItems[$index]
    if ($foodName) {
        $newName = "{0:D2}-{1}.png" -f $index, $foodName
        $targetFile = Join-Path $TargetPath $newName
        
        Write-Host "Copying: $($file.Name) -> $newName" -ForegroundColor Green
        Copy-Item -Path $file.FullName -Destination $targetFile -Force
    }
    $index++
}

Write-Host ""
Write-Host "Done! Files copied to $TargetPath" -ForegroundColor Cyan
Write-Host "Now run: node convert-to-webp.mjs" -ForegroundColor Yellow
