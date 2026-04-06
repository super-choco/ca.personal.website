#!/bin/bash
# Genera js/gallery-data.js a partir de las fotos en images/gallery/
# Convención de nombres: YYYY_Descripción.jpg
# Ejemplo: 2025_Londres - Tour Estadio Wembley.jpg

DIR="$(cd "$(dirname "$0")" && pwd)"
GALLERY="$DIR/images/gallery"
OUTPUT="$DIR/js/gallery-data.js"

echo "var galleryData = [" > "$OUTPUT"

for file in "$GALLERY"/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}; do
    [ -f "$file" ] || continue
    filename=$(basename "$file")

    # Extraer año (YYYY) del inicio del nombre
    year=$(echo "$filename" | grep -oE '^[0-9]{4}')
    [ -z "$year" ] && continue

    # Extraer nombre: todo después de YYYY_ y sin extensión
    name=$(echo "$filename" | sed 's/^[0-9]*_//' | sed 's/\.[^.]*$//')

    echo "    { file: '$filename', year: '$year', name: '$name' }," >> "$OUTPUT"
done

echo "];" >> "$OUTPUT"

count=$(grep -c "file:" "$OUTPUT")
echo "Generadas $count entradas en $OUTPUT"
