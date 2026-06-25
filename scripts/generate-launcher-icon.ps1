#Requires -Version 5.1
param(
  [Parameter(Mandatory)][string]$PngPath,
  [Parameter(Mandatory)][string]$IcoPath
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$bmp = [System.Drawing.Bitmap]::FromFile($PngPath)
try {
  $resized = New-Object System.Drawing.Bitmap(256, 256)
  $graphics = [System.Drawing.Graphics]::FromImage($resized)
  try {
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($bmp, 0, 0, 256, 256)
  } finally {
    $graphics.Dispose()
  }
  $ptr = $resized.GetHicon()
  $icon = [System.Drawing.Icon]::FromHandle($ptr)
  try {
    $fs = [System.IO.File]::Create($IcoPath)
    try {
      $icon.Save($fs)
    } finally {
      $fs.Close()
    }
  } finally {
    $icon.Dispose()
    $resized.Dispose()
  }
} finally {
  $bmp.Dispose()
}
