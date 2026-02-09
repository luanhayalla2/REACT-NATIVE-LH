Title: Adiciona GIF slideshow das screenshots

Description:

Este PR adiciona um GIF slideshow das principais telas do aplicativo gerado a partir
das screenshots existentes. Alterações incluídas:

- Script PowerShell `scripts/generate_gif.ps1` para gerar um GIF otimizado usando `ffmpeg`.
- Arquivo `gif_list.txt` com a ordem das imagens das screenshots.
- Atualização do `README.md` com instruções para gerar o GIF localmente e um placeholder
  para o GIF (`videos/screenshots-slideshow.gif`).

Como testar:

1. Instale o `ffmpeg` localmente (ex.: `choco install ffmpeg -y` no Windows).
2. Execute: `powershell -ExecutionPolicy Bypass -File scripts\generate_gif.ps1 -Commit` para gerar o GIF e enviar automaticamente ao remote.
3. Verifique que o arquivo `videos/screenshots-slideshow.gif` foi criado e que o README exibe o GIF.

Notas:

- O script requer `ffmpeg` no PATH.
- Se preferir não usar `-Commit`, gere o GIF e commite manualmente.
