
echo "Iniciando servidor NestJS..."
node dist/main.js &

echo "Esperando que el servidor se inicie..."
until curl --silent --fail http://localhost:3000/api/seed; do
  echo "Esperando backend (retry en 3s)..."
  sleep 3
done

echo "Seed ejecutado correctamente"

wait
