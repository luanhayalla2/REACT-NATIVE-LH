Param()

# Gera um GIF a partir das imagens listadas em gif_list.txt
# Requisitos: ffmpeg disponível no PATH, PowerShell

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
$gifList = Join-Path $repoRoot 'gif_list.txt'
$videosDir = Join-Path $repoRoot 'videos'
$palette = Join-Path $videosDir 'palette.png'
$outGif = Join-Path $videosDir 'screenshots-slideshow.gif'

if (-not (Test-Path $gifList)) {
    Write-Error "Arquivo gif_list.txt não encontrado em $repoRoot. Crie a lista de imagens e tente novamente."
    exit 1
}

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host "ffmpeg não encontrado no PATH. Instale ffmpeg antes de rodar este script." -ForegroundColor Yellow
    Write-Host "Sugestão (Chocolatey): choco install ffmpeg -y" -ForegroundColor Gray
    exit 1
}

Write-Host "Gerando paleta (palette.png)..."
& ffmpeg -y -f concat -safe 0 -i "$gifList" -vf palettegen "$palette"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Erro ao gerar paleta com ffmpeg. Código: $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "Gerando GIF otimizado em $outGif..."
& ffmpeg -y -f concat -safe 0 -i "$gifList" -i "$palette" -filter_complex "fps=10,scale=800:-1:flags=lanczos[x];[x][1:v]paletteuse" "$outGif"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Erro ao gerar GIF com ffmpeg. Código: $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "GIF gerado com sucesso: $outGif" -ForegroundColor Green

# Opcional: adicionar ao git, commitar e push (descomente se desejar)
# git add "$outGif"
# git commit -m "Adiciona GIF de slideshow das screenshots"
# git push origin main

exit 0
