# Verificación local de UI

```bash
npm ci --ignore-scripts
npm test
npm run check
python3 -m http.server 8764
```

Abrí `http://localhost:8764/tests/visual.html` y tocá **Probar matriz**. El iframe usa la app real con `?demo=1`, en 320×568, 393×740 y 1280×640, claro/oscuro. La barra permite inspeccionar cada escena después de **Restablecer demo**. No accede a datos reales ni llama a Firestore; el harness se niega a correr fuera de localhost. El tamaño del iframe es el viewport CSS probado; la escala exterior de escritorio sólo permite verlo completo en el navegador APX.

La matriz verifica geometría, contraste calculado de estilos renderizados (composición alfa y color-mix), SVGs, navegación/filtros, estados/confirmaciones, cuotas, edición de tres productos, selección fija, modal/foco, aviso con vacío y favicon. Los rectángulos admiten 0,01px de error de coma flotante por transformaciones de entrada; además se exige `offsetHeight >= 44`.

`npm test` ejecuta funciones reales de `index.html` en jsdom con Firebase simulado y aborta si la demo intenta acceder a una colección. No simula layout: eso corresponde al harness del navegador. No reemplaza pruebas en teléfono, lector de pantalla ni un despliegue con service worker.
