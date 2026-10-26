#requires -Version 7.0
[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$Destination)
$ErrorActionPreference = 'Stop'
$sourceRoot = [System.IO.Path]::GetFullPath($PSScriptRoot).TrimEnd([System.IO.Path]::DirectorySeparatorChar)
$destinationRoot = [System.IO.Path]::GetFullPath($Destination).TrimEnd([System.IO.Path]::DirectorySeparatorChar)
if ($sourceRoot -eq $destinationRoot) { throw 'La carpeta de origen y la de destino deben ser distintas.' }
if (-not (Test-Path -LiteralPath (Join-Path $destinationRoot 'angular.json'))) { throw 'El destino debe ser la carpeta de un proyecto Angular existente.' }
if (-not (Test-Path -LiteralPath (Join-Path $sourceRoot 'src/app/pages/home.ts'))) { throw 'No se encuentran los archivos de PHP2Shell junto al script.' }
$backupRoot = Join-Path $destinationRoot ('.php2shell-backups/' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
[System.IO.Directory]::CreateDirectory($backupRoot) | Out-Null
$items = @('src','public','scripts','docs','package.json','package-lock.json','angular.json','tsconfig.json','tsconfig.app.json','tsconfig.spec.json','README.md','.gitignore')
foreach ($item in $items) {
  $existing = Join-Path $destinationRoot $item
  if (Test-Path -LiteralPath $existing) { Copy-Item -LiteralPath $existing -Destination (Join-Path $backupRoot $item) -Recurse -Force }
}
foreach ($item in $items) {
  $sourceItem = Join-Path $sourceRoot $item
  $targetItem = Join-Path $destinationRoot $item
  if (Test-Path -LiteralPath $sourceItem) {
    if ((Get-Item -LiteralPath $sourceItem).PSIsContainer) {
      [System.IO.Directory]::CreateDirectory($targetItem) | Out-Null
      Get-ChildItem -LiteralPath $sourceItem -Force | Copy-Item -Destination $targetItem -Recurse -Force
    } else { Copy-Item -LiteralPath $sourceItem -Destination $targetItem -Force }
  }
}
# Retirar cuatro archivos del starter SSR, ya respaldados. No se borra ningun directorio.
foreach ($relative in @('src/main.server.ts','src/server.ts','src/app/app.config.server.ts','src/app/app.routes.server.ts')) {
  $oldFile = [System.IO.Path]::GetFullPath((Join-Path $destinationRoot $relative))
  if (-not $oldFile.StartsWith($destinationRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) { throw 'Ruta fuera del destino.' }
  if (Test-Path -LiteralPath $oldFile -PathType Leaf) { Remove-Item -LiteralPath $oldFile }
}
Write-Output "Codigo aplicado a: $destinationRoot"
Write-Output "Respaldo: $backupRoot"
Write-Output 'No se han ejecutado operaciones Git ni despliegues.'
Write-Output 'Siguiente: abre el destino, ejecuta npm.cmd run test:ci y npm.cmd start -- --port 4201'
