@echo off
echo ========================================
echo    ENVIANDO PROJETO PARA O GITHUB
echo ========================================
echo.

echo 1. Verificando se o Git esta instalado...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Git nao encontrado!
    echo Por favor, instale o Git em: https://git-scm.com/download/win
    echo E reinicie o terminal apos a instalacao.
    pause
    exit /b 1
)
echo Git encontrado! Continuando...
echo.

echo 2. Configurando Git...
git config --global user.name "deds0099"
git config --global user.email "deds0099@github.com"
echo Configuracao concluida!
echo.

echo 3. Inicializando repositorio Git...
git init
echo Repositorio inicializado!
echo.

echo 4. Adicionando arquivos...
git add .
echo Arquivos adicionados!
echo.

echo 5. Fazendo primeiro commit...
git commit -m "Primeira versao do sistema EngordaPro"
echo Commit realizado!
echo.

echo 6. Adicionando repositorio remoto...
git remote add origin https://github.com/deds0099/engordapro.git
echo Repositorio remoto adicionado!
echo.

echo 7. Enviando para o GitHub...
git push -u origin main
echo.

echo ========================================
echo    PROCESSO CONCLUIDO!
echo ========================================
echo.
echo Seu projeto foi enviado para:
echo https://github.com/deds0099/engordapro.git
echo.
echo Verifique se tudo foi enviado corretamente!
pause 