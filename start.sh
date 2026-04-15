#!/bin/bash

echo "============================================"
echo " CRM Soft IA House - Iniciando..."
echo "============================================"

# Backend
echo "[1/4] Instalando dependencias del backend..."
cd backend && npm install

echo "[2/4] Inicializando base de datos y seed..."
npm run seed

echo "[3/4] Instalando dependencias del frontend..."
cd ../frontend && npm install

echo "[4/4] Iniciando servidores..."
cd ../backend && npm run dev &
BACKEND_PID=$!

cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo " ✅ Backend:  http://localhost:3001"
echo " ✅ Frontend: http://localhost:5173"
echo ""
echo " Usuario: admin@fedchess.es"
echo " Senha:   admin123"
echo ""
echo " Ctrl+C para parar ambos servidores"

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
