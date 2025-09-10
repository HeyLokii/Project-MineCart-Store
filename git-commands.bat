@echo off
echo === Git Commands Batch Script ===
echo.

:menu
echo Escolha uma opcao:
echo 1. git status
echo 2. git add . (adicionar todos os arquivos)
echo 3. git commit -m "mensagem"
echo 4. git push
echo 5. git pull
echo 6. git log --oneline (ultimos commits)
echo 7. git branch (listar branches)
echo 8. Sequencia completa (add + commit + push)
echo 9. Sair
echo.

set /p choice="Digite o numero da opcao: "

if "%choice%"=="1" goto status
if "%choice%"=="2" goto add
if "%choice%"=="3" goto commit
if "%choice%"=="4" goto push
if "%choice%"=="5" goto pull
if "%choice%"=="6" goto log
if "%choice%"=="7" goto branch
if "%choice%"=="8" goto sequence
if "%choice%"=="9" goto exit

echo Opcao invalida!
goto menu

:status
echo.
echo === Git Status ===
git status
echo.
pause
goto menu

:add
echo.
echo === Adicionando todos os arquivos ===
git add .
echo Arquivos adicionados!
echo.
pause
goto menu

:commit
echo.
set /p message="Digite a mensagem do commit: "
git commit -m "%message%"
echo.
pause
goto menu

:push
echo.
echo === Fazendo push ===
git push
echo.
pause
goto menu

:pull
echo.
echo === Fazendo pull ===
git pull
echo.
pause
goto menu

:log
echo.
echo === Ultimos commits ===
git log --oneline -10
echo.
pause
goto menu

:branch
echo.
echo === Branches ===
git branch -a
echo.
pause
goto menu

:sequence
echo.
echo === Sequencia Completa ===
echo.
echo 1. Status atual:
git status
echo.

set /p message="Digite a mensagem do commit: "
echo.

echo 2. Adicionando arquivos:
git add .
echo.

echo 3. Fazendo commit:
git commit -m "%message%"
echo.

echo 4. Fazendo push:
git push
echo.

echo Sequencia completa!
pause
goto menu

:exit
echo Saindo...
exit /b