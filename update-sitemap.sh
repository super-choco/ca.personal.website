#!/bin/bash
# Genera sitemap.xml con index.html + blog.html + todos los posts del blog
# Lee slugs y fechas desde js/posts-data.js
# Uso: ./update-sitemap.sh

DIR="$(cd "$(dirname "$0")" && pwd)"
POSTS_DATA="$DIR/js/posts-data.js"
OUTPUT="$DIR/sitemap.xml"
TODAY=$(date +%Y-%m-%d)

# Extraer slugs y fechas de posts-data.js
slugs=($(grep "slug:" "$POSTS_DATA" | sed "s/.*slug:[[:space:]]*['\"]//;s/['\"].*$//"))
dates=($(grep "date:" "$POSTS_DATA" | sed "s/.*date:[[:space:]]*['\"]//;s/['\"].*$//"))

cat > "$OUTPUT" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://carlos-arranz.com/</loc>
        <lastmod>$TODAY</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://carlos-arranz.com/blog.html</loc>
        <lastmod>$TODAY</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
EOF

for i in "${!slugs[@]}"; do
    slug="${slugs[$i]}"
    date="${dates[$i]}"
    cat >> "$OUTPUT" << EOF
    <url>
        <loc>https://carlos-arranz.com/blog.html?post=$slug</loc>
        <lastmod>$date</lastmod>
        <changefreq>never</changefreq>
        <priority>0.6</priority>
    </url>
EOF
done

echo "</urlset>" >> "$OUTPUT"

count=${#slugs[@]}
echo "Sitemap generado con $((count + 2)) URLs ($count posts) → $OUTPUT"
