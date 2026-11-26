JAVED KHAN PORTFOLIO – HOW TO USE

Files: index.html (text) | style.css (colours, layout) | script.js (animations)
       projects.js (your designs list) | points.js (data for the animated face) | images/

EDIT TEXT: open index.html in a text editor (name, about text, links).
EDIT DESIGNS: images are in images/work/. Titles and categories are in projects.js:
  {t:'Title', c:'Category', k:'Short label', thumb:'card-image.jpg', img:'full-image.jpg'}
  To add a design: put both images in images/work/ and add one line to projects.js.

PREVIEW: double-click index.html (if something does not load, run "python -m http.server" in this folder and open localhost:8000).
DEPLOY (free): Netlify -> app.netlify.com/drop, drag this whole folder in. Or GitHub Pages / Vercel.
