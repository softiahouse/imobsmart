@echo off
echo ============================================
echo  CRM Soft IA House - Iniciando...
echo ============================================
echo.

echo [1/4] Instalando dependencias del backend...
cd backend
call npm install
echo.

echo [2/4] Inicializando base de datos y datos de demo...
call npm run seed
echo.

echo [3/4] Instalando dependencias del frontend...
cd ..\frontend
call npm install
echo.

echo [4/4] Iniciando servidores...
echo.
echo  Backend:  http://localhost:3001
echo  Frontend: http://localhost:5173
echo.

start "CRM Backend" cmd /k "cd ..\backend && npm run dev"
timeout /t 2 /nobreak > nul
start "CRM Frontend" cmd /k "npm run dev"

echo.
echo Abre http://localhost:5173 en tu navegador
echo Usuario: admin@fedchess.es / admin123
echo.
pause
