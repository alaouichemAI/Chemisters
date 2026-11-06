/* Chemisters field page — shared by every field page. Data comes from <script id="field-data">. */
(() => {
/* Lucide icons (ISC license, lucide.dev) */
const ICONS = {"flame":"<path d=\"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4\"/>","snowflake":"<path d=\"m10 20-1.25-2.5L6 18\"/><path d=\"M10 4 8.75 6.5 6 6\"/><path d=\"m14 20 1.25-2.5L18 18\"/><path d=\"m14 4 1.25 2.5L18 6\"/><path d=\"m17 21-3-6h-4\"/><path d=\"m17 3-3 6 1.5 3\"/><path d=\"M2 12h6.5L10 9\"/><path d=\"m20 10-1.5 2 1.5 2\"/><path d=\"M22 12h-6.5L14 15\"/><path d=\"m4 10 1.5 2L4 14\"/><path d=\"m7 21 3-6-1.5-3\"/><path d=\"m7 3 3 6h4\"/>","volume-2":"<path d=\"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z\"/><path d=\"M16 9a5 5 0 0 1 0 6\"/><path d=\"M19.364 18.364a9 9 0 0 0 0-12.728\"/>","volume-x":"<path d=\"M11 4.702a.7.7 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.7.7 0 0 0 11 19.298z\"/><path d=\"m16.5 14.5 5-5\"/><path d=\"m16.5 9.5 5 5\"/>","maximize-2":"<path d=\"M15 3h6v6\"/><path d=\"m21 3-7 7\"/><path d=\"m3 21 7-7\"/><path d=\"M9 21H3v-6\"/>","minimize-2":"<path d=\"m14 10 7-7\"/><path d=\"M20 10h-6V4\"/><path d=\"m3 21 7-7\"/><path d=\"M4 14h6v6\"/>","heart":"<path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\"/>","heart-crack":"<path d=\"M12.409 5.824c-.702.792-1.15 1.496-1.415 2.166l2.153 2.156a.5.5 0 0 1 0 .707l-2.293 2.293a.5.5 0 0 0 0 .707L12 15\"/><path d=\"M13.508 20.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.677.6.6 0 0 0 .818.001A5.5 5.5 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5z\"/>","heart-pulse":"<path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\"/><path d=\"M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27\"/>","flask-conical":"<path d=\"M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2\"/><path d=\"M6.453 15h11.094\"/><path d=\"M8.5 2h7\"/>","timer":"<line x1=\"10\" x2=\"14\" y1=\"2\" y2=\"2\"/><line x1=\"12\" x2=\"15\" y1=\"14\" y2=\"11\"/><circle cx=\"12\" cy=\"14\" r=\"8\"/>","lock":"<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>","list-checks":"<path d=\"M13 5h8\"/><path d=\"M13 12h8\"/><path d=\"M13 19h8\"/><path d=\"m3 17 2 2 4-4\"/><path d=\"m3 7 2 2 4-4\"/>","circle-check":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m16 9-5.5 5.5L8 12\"/>","circle":"<circle cx=\"12\" cy=\"12\" r=\"10\"/>","award":"<path d=\"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526\"/><circle cx=\"12\" cy=\"8\" r=\"6\"/>","chart-column":"<path d=\"M3 3v16a2 2 0 0 0 2 2h16\"/><path d=\"M18 17V9\"/><path d=\"M13 17V5\"/><path d=\"M8 17v-3\"/>","mountain-snow":"<path d=\"m8 3 4 8 5-5 5 15H2L8 3z\"/><path d=\"M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19\"/>","list":"<path d=\"M3 5h.01\"/><path d=\"M3 12h.01\"/><path d=\"M3 19h.01\"/><path d=\"M8 5h13\"/><path d=\"M8 12h13\"/><path d=\"M8 19h13\"/>","sliders-horizontal":"<path d=\"M10 5H3\"/><path d=\"M12 19H3\"/><path d=\"M14 3v4\"/><path d=\"M16 17v4\"/><path d=\"M21 12h-9\"/><path d=\"M21 19h-5\"/><path d=\"M21 5h-7\"/><path d=\"M8 10v4\"/><path d=\"M8 12H3\"/>","arrow-down-up":"<path d=\"m3 16 4 4 4-4\"/><path d=\"M7 20V4\"/><path d=\"m21 8-4-4-4 4\"/><path d=\"M17 4v16\"/>","puzzle":"<path d=\"M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z\"/>","scissors":"<circle cx=\"6\" cy=\"6\" r=\"3\"/><path d=\"M8.12 8.12 12 12\"/><path d=\"M20 4 8.12 15.88\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><path d=\"M14.8 14.8 20 20\"/>","shuffle":"<path d=\"m18 14 4 4-4 4\"/><path d=\"m18 2 4 4-4 4\"/><path d=\"M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22\"/><path d=\"M2 6h1.972a4 4 0 0 1 3.6 2.2\"/><path d=\"M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45\"/>","zap":"<path d=\"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z\"/>","target":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/>","clock":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/>","trophy":"<path d=\"M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2\"/><path d=\"M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2\"/><path d=\"M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3\"/><path d=\"M4 22h16\"/><path d=\"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z\"/><path d=\"M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3\"/>","notebook-pen":"<path d=\"M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4\"/><path d=\"M2 6h4\"/><path d=\"M2 10h4\"/><path d=\"M2 14h4\"/><path d=\"M2 18h4\"/><path d=\"M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z\"/>","check":"<path d=\"M20 6 9 17l-5-5\"/>","x":"<path d=\"M18 6 6 18\"/><path d=\"m6 6 12 12\"/>","share-2":"<circle cx=\"18\" cy=\"5\" r=\"3\"/><circle cx=\"6\" cy=\"12\" r=\"3\"/><circle cx=\"18\" cy=\"19\" r=\"3\"/><line x1=\"8.59\" x2=\"15.42\" y1=\"13.51\" y2=\"17.49\"/><line x1=\"15.41\" x2=\"8.59\" y1=\"6.51\" y2=\"10.49\"/>","copy":"<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"/><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"/>","gamepad-2":"<line x1=\"6\" x2=\"10\" y1=\"11\" y2=\"11\"/><line x1=\"8\" x2=\"8\" y1=\"9\" y2=\"13\"/><line x1=\"15\" x2=\"15.01\" y1=\"12\" y2=\"12\"/><line x1=\"18\" x2=\"18.01\" y1=\"10\" y2=\"10\"/><path d=\"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z\"/>","arrow-up":"<path d=\"m5 12 7-7 7 7\"/><path d=\"M12 19V5\"/>","skull":"<path d=\"m12.5 17-.5-1-.5 1h1z\"/><path d=\"M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z\"/><circle cx=\"15\" cy=\"12\" r=\"1\"/><circle cx=\"9\" cy=\"12\" r=\"1\"/>","sparkles":"<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\"/><path d=\"M20 2v4\"/><path d=\"M22 4h-4\"/><circle cx=\"4\" cy=\"20\" r=\"2\"/>","beaker":"<path d=\"M4.5 3h15\"/><path d=\"M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3\"/><path d=\"M6 14h12\"/>","test-tubes":"<path d=\"M9 2v17.5A2.5 2.5 0 0 1 6.5 22A2.5 2.5 0 0 1 4 19.5V2\"/><path d=\"M20 2v17.5a2.5 2.5 0 0 1-2.5 2.5a2.5 2.5 0 0 1-2.5-2.5V2\"/><path d=\"M3 2h7\"/><path d=\"M14 2h7\"/><path d=\"M9 16H4\"/><path d=\"M20 16h-5\"/>","landmark":"<path d=\"M10 18v-7\"/><path d=\"M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z\"/><path d=\"M14 18v-7\"/><path d=\"M18 18v-7\"/><path d=\"M3 22h18\"/><path d=\"M6 18v-7\"/>","book-open":"<path d=\"M12 5v16\"/><path d=\"M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z\"/>","library":"<path d=\"m16 6 4 14\"/><path d=\"M12 6v14\"/><path d=\"M8 8v12\"/><path d=\"M4 4v16\"/>","brain":"<path d=\"M12 18V5\"/><path d=\"M15 13a4.17 4.17 0 01-3-4 4.17 4.17 0 01-3 4\"/><path d=\"M17.707 6.294A3 3 0 1012 5a3 3 0 10-5.707 1.294\"/><path d=\"M17.996 5.125a4 4 0 012.526 5.77\"/><path d=\"M18 18a4 4 0 002-7.465\"/><path d=\"M19.967 17.482a4 4 0 11-7.967.517 4 4 0 11-7.967-.517\"/><path d=\"M6 18a4 4 0 01-2-7.465\"/><path d=\"M6.004 5.125a4 4 0 00-2.526 5.77\"/>","gem":"<path d=\"M10.5 3 8 9l4 13 4-13-2.5-6\"/><path d=\"M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z\"/><path d=\"M2 9h20\"/>","diamond":"<path d=\"M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z\"/>","crown":"<path d=\"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z\"/><path d=\"M5 21h14\"/>","shield-check":"<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"m9 12 2 2 4-4\"/>","rotate-ccw":"<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/>","link":"<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"/><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/>","flame-kindling":"<path d=\"M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z\"/><path d=\"m5 22 14-4\"/><path d=\"m5 18 14 4\"/>","sun":"<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2\"/><path d=\"M12 20v2\"/><path d=\"m4.93 4.93 1.41 1.41\"/><path d=\"m17.66 17.66 1.41 1.41\"/><path d=\"M2 12h2\"/><path d=\"M20 12h2\"/><path d=\"m6.34 17.66-1.41 1.41\"/><path d=\"m19.07 4.93-1.41 1.41\"/>","cloud-lightning":"<path d=\"M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973\"/><path d=\"m13 12-3 5h4l-3 5\"/>","gauge":"<path d=\"m12 14 4-4\"/><path d=\"M3.34 19a10 10 0 1 1 17.32 0\"/>","calendar-check":"<path d=\"M8 2v3\"/><path d=\"M16 2v3\"/><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"m9 15 2 2 4-4\"/>","compass":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z\"/>","scroll":"<path d=\"M19 17V5a2 2 0 0 0-2-2H4\"/><path d=\"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3\"/>","network":"<rect x=\"16\" y=\"16\" width=\"6\" height=\"6\" rx=\"1\"/><rect x=\"2\" y=\"16\" width=\"6\" height=\"6\" rx=\"1\"/><rect x=\"9\" y=\"2\" width=\"6\" height=\"6\" rx=\"1\"/><path d=\"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3\"/><path d=\"M12 12V8\"/>","rocket":"<path d=\"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5\"/><path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09\"/><path d=\"M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z\"/><path d=\"M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05\"/>","orbit":"<path d=\"M20.341 6.484A10 10 0 0 1 10.266 21.85\"/><path d=\"M3.659 17.516A10 10 0 0 1 13.74 2.152\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/><circle cx=\"19\" cy=\"5\" r=\"2\"/><circle cx=\"5\" cy=\"19\" r=\"2\"/>","star":"<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"/>","shield":"<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/>","castle":"<path d=\"M10 5V3\"/><path d=\"M14 5V3\"/><path d=\"M15 21v-3a3 3 0 0 0-6 0v3\"/><path d=\"M18 3v8\"/><path d=\"M18 5H6\"/><path d=\"M22 11H2\"/><path d=\"M22 9v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9\"/><path d=\"M6 3v8\"/>","swords":"<path d=\"m13 19 6-6\"/><path d=\"M14.5 17.5 3.586 6.586A2 2 0 013 5.172V3h2.172a2 2 0 011.414.586L17.5 14.5\"/><path d=\"m14.828 6.172 2.586-2.586A2 2 0 0118.828 3H21v2.172a2 2 0 01-.586 1.414l-2.586 2.586\"/><path d=\"m16 16 4 4\"/><path d=\"m19 21 2-2\"/><path d=\"m5 14 4 4\"/><path d=\"m5 21-2-2\"/><path d=\"M7.5 16.5 4 20\"/>","calendar-days":"<path d=\"M8 2v3\"/><path d=\"M16 2v3\"/><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"M8 13h.01\"/><path d=\"M12 13h.01\"/><path d=\"M16 13h.01\"/><path d=\"M8 17h.01\"/><path d=\"M12 17h.01\"/><path d=\"M16 17h.01\"/>","moon":"<path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"/>","badge-check":"<path d=\"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z\"/><path d=\"m16 9-5.5 5.5L8 12\"/>","atom":"<circle cx=\"12\" cy=\"12\" r=\"1\"/><path d=\"M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z\"/><path d=\"M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z\"/>","dna":"<path d=\"m10 16 1.5 1.5\"/><path d=\"m14 8-1.5-1.5\"/><path d=\"M15 2c-1.798 1.998-2.518 3.995-2.807 5.993\"/><path d=\"m16.5 10.5 1 1\"/><path d=\"m17 6-2.891-2.891\"/><path d=\"M2 15c6.667-6 13.333 0 20-6\"/><path d=\"m20 9 .891.891\"/><path d=\"M3.109 14.109 4 15\"/><path d=\"m6.5 12.5 1 1\"/><path d=\"m7 18 2.891 2.891\"/><path d=\"M9 22c1.798-1.998 2.518-3.995 2.807-5.993\"/>","cog":"<path d=\"M11 10.27 7 3.34\"/><path d=\"m11 13.73-4 6.93\"/><path d=\"M12 22v-2\"/><path d=\"M12 2v2\"/><path d=\"M14 12h8\"/><path d=\"m17 20.66-1-1.73\"/><path d=\"m17 3.34-1 1.73\"/><path d=\"M2 12h2\"/><path d=\"m20.66 17-1.73-1\"/><path d=\"m20.66 7-1.73 1\"/><path d=\"m3.34 17 1.73-1\"/><path d=\"m3.34 7 1.73 1\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"8\"/>","microscope":"<path d=\"M6 18h8\"/><path d=\"M3 22h18\"/><path d=\"M14 22a7 7 0 1 0 0-14h-1\"/><path d=\"M9 14h2\"/><path d=\"M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z\"/><path d=\"M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3\"/>","graduation-cap":"<path d=\"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z\"/><path d=\"M22 10v6\"/><path d=\"M6 12.5V16a6 3 0 0 0 12 0v-3.5\"/>","medal":"<path d=\"M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15\"/><path d=\"M11 12 5.12 2.2\"/><path d=\"m13 12 5.88-9.8\"/><path d=\"M8 7h8\"/><circle cx=\"12\" cy=\"17\" r=\"5\"/><path d=\"M12 18v-2h-.5\"/>","door-open":"<path d=\"M10 21H2\"/><path d=\"M10 3H7a2 2 0 00-2 2v16\"/><path d=\"M14 12h.01\"/><path d=\"M19 21V5a2 2 0 00-1.675-1.974l-6.163-1.013A1 1 0 0010 3v18a1 1 0 001.124.992z\"/><path d=\"M22 21h-3\"/>","map":"<path d=\"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z\"/><path d=\"M15 5.764v15\"/><path d=\"M9 3.236v15\"/>","globe":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\"/><path d=\"M2 12h20\"/>","telescope":"<path d=\"m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44\"/><path d=\"m13.56 11.747 4.332-.924\"/><path d=\"m16 21-3.105-6.21\"/><path d=\"M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z\"/><path d=\"m6.158 8.633 1.114 4.456\"/><path d=\"m8 21 3.105-6.21\"/><circle cx=\"12\" cy=\"13\" r=\"2\"/>","clipboard-check":"<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\"/><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/><path d=\"m9 14 2 2 4-4\"/>","party-popper":"<path d=\"M5.8 11.3 2 22l10.7-3.79\"/><path d=\"M4 3h.01\"/><path d=\"M22 8h.01\"/><path d=\"M15 2h.01\"/><path d=\"M22 20h.01\"/><path d=\"m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10\"/><path d=\"m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17\"/><path d=\"m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7\"/><path d=\"M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z\"/>","moon-star":"<path d=\"M18 5h4\"/><path d=\"M20 3v4\"/><path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"/>","sunrise":"<path d=\"M12 2v8\"/><path d=\"m4.93 10.93 1.41 1.41\"/><path d=\"M2 18h2\"/><path d=\"M20 18h2\"/><path d=\"m19.07 10.93-1.41 1.41\"/><path d=\"M22 22H2\"/><path d=\"m8 6 4-4 4 4\"/><path d=\"M16 18a4 4 0 0 0-8 0\"/>","sofa":"<path d=\"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3\"/><path d=\"M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\"/><path d=\"M4 18v2\"/><path d=\"M20 18v2\"/><path d=\"M12 4v9\"/>","megaphone":"<path d=\"M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z\"/><path d=\"M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14\"/><path d=\"M8 6v8\"/>","radio-tower":"<path d=\"M4.9 16.1C1 12.2 1 5.8 4.9 1.9\"/><path d=\"M7.8 4.7a6.14 6.14 0 0 0-.8 7.5\"/><circle cx=\"12\" cy=\"9\" r=\"2\"/><path d=\"M16.2 4.8c2 2 2.26 5.11.8 7.47\"/><path d=\"M19.1 1.9a9.96 9.96 0 0 1 0 14.1\"/><path d=\"M9.5 18h5\"/><path d=\"m8 22 4-11 4 11\"/>","triangle-alert":"<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"/><path d=\"M12 9v4\"/><path d=\"M12 17h.01\"/>","pi":"<line x1=\"9\" x2=\"9\" y1=\"4\" y2=\"20\"/><path d=\"M4 7c0-1.7 1.3-3 3-3h13\"/><path d=\"M18 20c-1.7 0-3-1.3-3-3V4\"/>","earth":"<path d=\"M21.54 15H17a2 2 0 0 0-2 2v4.54\"/><path d=\"M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17\"/><path d=\"M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/>","calendar-range":"<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M16 2v3\"/><path d=\"M3 9h18\"/><path d=\"M8 2v3\"/><path d=\"M17 13h-6\"/><path d=\"M13 17H7\"/><path d=\"M7 13h.01\"/><path d=\"M17 17h.01\"/>","history":"<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/><path d=\"M12 7v5l4 2\"/>","external-link":"<path d=\"M15 3h6v6\"/><path d=\"M10 14 21 3\"/><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"/>","thumbs-up":"<path d=\"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z\"/><path d=\"M7 10v12\"/>","message-circle":"<path d=\"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719\"/>","repeat-2":"<path d=\"m2 9 3-3 3 3\"/><path d=\"M13 18H7a2 2 0 0 1-2-2V6\"/><path d=\"m22 15-3 3-3-3\"/><path d=\"M11 6h6a2 2 0 0 1 2 2v10\"/>","eye":"<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>","newspaper":"<path d=\"M15 18h-5\"/><path d=\"M18 14h-8\"/><path d=\"M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2\"/><rect width=\"8\" height=\"4\" x=\"10\" y=\"6\" rx=\"1\"/>","chevron-right":"<path d=\"m9 18 6-6-6-6\"/>","chevron-left":"<path d=\"m15 18-6-6 6-6\"/>","play":"<path d=\"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z\"/>","rotate-cw":"<path d=\"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8\"/><path d=\"M21 3v5h-5\"/>","hourglass":"<path d=\"M5 22h14\"/><path d=\"M5 2h14\"/><path d=\"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22\"/><path d=\"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2\"/>","crosshair":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"22\" x2=\"18\" y1=\"12\" y2=\"12\"/><line x1=\"6\" x2=\"2\" y1=\"12\" y2=\"12\"/><line x1=\"12\" x2=\"12\" y1=\"6\" y2=\"2\"/><line x1=\"12\" x2=\"12\" y1=\"22\" y2=\"18\"/>","download":"<path d=\"M12 15V3\"/><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><path d=\"m7 10 5 5 5-5\"/>","image":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\"/><circle cx=\"9\" cy=\"9\" r=\"2\"/><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\"/>"};
const ic = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ""}</svg>`;
'use strict';
const F = JSON.parse(document.getElementById('field-data').textContent);
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const buzz = p => { try { navigator.vibrate && navigator.vibrate(p); } catch {} };
const day = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);

/* ---------- analytics (only if GoatCounter is enabled in site.json) ---------- */
const track = name => { try { window.goatcounter && window.goatcounter.count && window.goatcounter.count({ path: name, title: name, event: true }); } catch {} };
document.addEventListener('click', e => {
  const a = e.target.closest('a.btn.li:not(.read), a.btn.fb:not(.read), a.chip.li, a.chip.fb');
  if (a) track(`follow-${a.classList.contains('li') ? 'linkedin' : 'facebook'}/${F.slug}`);
});

/* ---------- copy link + toast ---------- */
const toastEl = $('#toast');
const toast = msg => { (document.fullscreenElement || document.webkitFullscreenElement || document.body).appendChild(toastEl); toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => toastEl.classList.remove('show'), 1600); };
$$('[data-copy]').forEach(b => b.addEventListener('click', async () => { try { await navigator.clipboard.writeText(F.url); } catch {} toast('Link copied'); }));

/* ---------- sticky follow bar ---------- */
const sticky = $('#sticky');
let stickyClosed = store.get('chem-sticky-closed', 0) > Date.now() - 864e5;
$('#sticky-x').onclick = () => { stickyClosed = true; sticky.classList.remove('show'); store.set('chem-sticky-closed', Date.now()); };
let heroGone = false, quizInView = false;
const paintSticky = () => sticky.classList.toggle('show', heroGone && !quizInView && !stickyClosed);
new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting && e.boundingClientRect.top < 0; paintSticky(); }).observe($('#hero-follow'));
new IntersectionObserver(([e]) => { quizInView = e.isIntersecting; paintSticky(); }).observe($('#qz'));

/* ---------- timeline ---------- */
const T = F.timeline, tlTrack = $('#tl-track'), tlPanel = $('#tl-panel');
let ti = 0;
tlTrack.innerHTML = T.map((e, i) => `<button class="tl-dot" role="tab" data-i="${i}">${e.year}</button>`).join('');
function showT(i, focus) {
  ti = Math.max(0, Math.min(T.length - 1, i));
  const e = T[ti];
  tlPanel.innerHTML = `<div class="tl-year">${e.year}</div><div><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p>${e.why ? `<p class="tl-why"><b>Why it matters:</b> ${esc(e.why)}</p>` : ''}</div>`;
  tlPanel.classList.remove('anim'); void tlPanel.offsetWidth; tlPanel.classList.add('anim');
  $$('.tl-dot').forEach((d, k) => d.setAttribute('aria-selected', k === ti));
  const dot = tlTrack.children[ti];
  tlTrack.scrollTo({ left: dot.offsetLeft - tlTrack.clientWidth / 2 + dot.clientWidth / 2, behavior: 'smooth' });
  if (focus) dot.focus({ preventScroll: true });
  $('#tl-prev').disabled = ti === 0; $('#tl-next').disabled = ti === T.length - 1;
}
tlTrack.addEventListener('click', e => { const b = e.target.closest('.tl-dot'); if (b) showT(+b.dataset.i); });
tlTrack.addEventListener('keydown', e => { if (e.key === 'ArrowRight') showT(ti + 1, 1); if (e.key === 'ArrowLeft') showT(ti - 1, 1); });
$('#tl-prev').onclick = () => showT(ti - 1); $('#tl-next').onclick = () => showT(ti + 1);
showT(0);

/* ---------- "What are you into?" picker ---------- */
(() => {
  const chips = $$('.pk-chip'), cards = $$('.pk-card'), hint = $('#pk-hint');
  if (!chips.length) return;
  const KEY = 'chem-interests', saved = new Set(store.get(KEY, []));
  function apply() {
    const sel = chips.filter(c => c.getAttribute('aria-pressed') === 'true').map(c => c.dataset.k);
    cards.forEach(c => c.classList.toggle('on', sel.length ? sel.includes(c.dataset.k) : c.hasAttribute('data-def')));
    hint.textContent = sel.length ? `Follow these ${sel.length} page${sel.length > 1 ? 's' : ''} to fill your feed:` : `Popular with ${F.name} followers:`;
    store.set(KEY, [...new Set([...store.get(KEY, []).filter(k => !chips.some(c => c.dataset.k === k)), ...sel])]);
  }
  chips.forEach(c => {
    if (saved.has(c.dataset.k)) c.setAttribute('aria-pressed', 'true');
    c.onclick = () => { c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); apply(); };
  });
  apply();
})();

/* ---------- live data: weekly top post, daily papers, extra quiz questions (written by n8n) ---------- */
const live = fetch(`/data/live/${F.slug}.json?v=${Math.floor(Date.now() / 36e5)}`).then(r => r.ok ? r.json() : {}).catch(() => ({}));
const ICON = { linkedin: F.icons.li, facebook: F.icons.fb };

/* ---------- live posts & papers: visual cards ---------- */
const fmtN = n => n >= 1e4 ? `${Math.round(n / 1e3)}k` : n >= 1e3 ? `${(n / 1e3).toFixed(1).replace('.0', '')}k` : String(n);
const ago = d => {
  if (!d) return '';
  const n = daysBetween(d, day());
  if (isNaN(n)) return d;
  return n <= 0 ? 'Today' : n === 1 ? 'Yesterday' : n < 7 ? `${n} days ago` : new Date(d + 'T12:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};
const hashStr = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const initials = s => String(s || '').replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter(w => w.length > 2 || /^[A-Z]/.test(w)).slice(0, 3).map(w => w[0].toUpperCase()).join('') || F.symbol;
/* generated cover used when a post or paper has no image (or the image fails to load) */
const cover = (title, big, sub) => `<div class="cover" style="--hr:${hashStr(title) % 70 - 35}deg"><span class="cv-big">${esc(big)}</span><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</div>`;
const media = (img, title, big, sub) => `${cover(title, big, sub)}${img ? `<img src="${esc(img)}" alt="" loading="lazy" onerror="this.remove()">` : ''}`;

live.then(d => {
  const posts = (d.top_posts || []).filter(p => p && p.url);
  if (!posts.length) return;
  const p = posts[0], plat = p.platform === 'facebook' ? 'facebook' : 'linkedin', platName = plat === 'facebook' ? 'Facebook' : 'LinkedIn';
  const eng = [['thumbs-up', p.reactions, 'reactions'], ['message-circle', p.comments, 'comments'], ['repeat-2', p.reposts, 'reposts'], ['eye', p.impressions, 'views']]
    .filter(([, v]) => Number(v) > 0).map(([i, v, l]) => `<span>${ic(i)}<b>${fmtN(+v)}</b> ${l}</span>`).join('');
  const title = p.title || (p.text || '').split(/[.\n]/)[0].slice(0, 110);
  let html = p.embed_url
    ? `<iframe class="tp-embed" src="${esc(p.embed_url)}" title="Top post of the week" loading="lazy" allowfullscreen></iframe>`
    : `<article class="tp2">
      <a class="tp2-media" href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="Open the post on ${platName}">
        ${media(p.image, title, F.symbol, p.label)}
        <span class="tp2-rank">${ic('trophy')}#1 this week</span>
        <span class="tp2-plat ${plat}">${ICON[plat]}</span>
      </a>
      <div class="tp2-body">
        <div class="tp2-head"><span class="av">${esc(F.symbol)}</span><div><b>${esc(F.name)}</b><small>Chemisters · ${esc(ago(p.date) || p.week || 'This week')}</small></div></div>
        ${p.label ? `<span class="tp2-label">${esc(p.label)}</span>` : ''}
        <h3>${esc(title)}</h3>
        ${p.text ? `<p class="tp2-text">${esc(p.text)}</p>` : ''}
        ${eng ? `<div class="tp2-eng">${eng}</div>` : ''}
        <div class="tp2-cta"><a class="btn ${plat === 'facebook' ? 'fb' : 'li'} read" href="${esc(p.url)}" target="_blank" rel="noopener">Read the full post ${ic('external-link')}</a></div>
      </div>
    </article>`;
  const older = posts.slice(1, 7);
  if (older.length) html += `<div class="rail-h"><h4>Earlier top posts</h4><div class="rail-nav"><button type="button" data-rail="-1" aria-label="Scroll left">${ic('chevron-left')}</button><button type="button" data-rail="1" aria-label="Scroll right">${ic('chevron-right')}</button></div></div>
    <div class="rail" id="rail">${older.map(o => {
      const t = o.title || (o.text || '').split(/[.\n]/)[0].slice(0, 90), r = Number(o.reactions) || 0;
      return `<a class="rc" href="${esc(o.url)}" target="_blank" rel="noopener"><div class="rc-media">${media(o.image, t, F.symbol)}</div>
        <div class="rc-b"><small>${esc(o.week || ago(o.date))}</small><b>${esc(t)}</b>${r ? `<span>${ic('thumbs-up')}${fmtN(r)}</span>` : ''}</div></a>`;
    }).join('')}</div>`;
  $('#tp').innerHTML = html;
  $$('[data-rail]').forEach(b => b.onclick = () => { const r = $('#rail'); r.scrollBy({ left: +b.dataset.rail * r.clientWidth * .8, behavior: 'smooth' }); });
  $('#top-post').style.display = 'block';
});

live.then(d => {
  const papers = (d.papers || []).filter(p => p && p.title && p.url).slice(0, 6);
  if (!papers.length) return;
  $('#papers-list').innerHTML = papers.map((p, i) => {
    const fresh = p.date && daysBetween(p.date, day()) <= 2;
    return `<a class="pc${i === 0 ? ' feat' : ''}" href="${esc(p.url)}" target="_blank" rel="noopener">
      <div class="pc-media">${media(p.image, p.title, initials(p.source), p.source)}</div>
      <div class="pc-b"><div class="pc-meta">${p.source ? `<span class="jr">${esc(p.source)}</span>` : ''}${fresh ? '<span class="pnew">New</span>' : ''}<small>${esc(ago(p.date))}</small></div>
        <b>${esc(p.title)}</b>${p.summary ? `<p>${esc(p.summary)}</p>` : ''}<span class="pc-go">Read the paper ${ic('external-link')}</span></div></a>`;
  }).join('');
  $('#papers').hidden = false;
});

/* =====================================================================
   THE CHALLENGE
   Modes: Classic (5 mixed rounds), Blitz (60 s), Survival (3 hearts).
   XP, levels, 66 badges, daily quests, streak + freezes, lifelines,
   speed bonus, sound, screen effects, fullscreen, stats, review,
   downloadable score card. Progress is shared across every Chemisters page.
   ===================================================================== */
const qz = $('#qz'), PER = 5, SEEN = `chem-quiz-seen:${F.slug}`, GKEY = 'chem-game', SPEED_MS = 7000;
const TODAY = day();

/* ---------- sound effects: synthesized with Web Audio, no files ---------- */
const SFX = (() => {
  let ctx = null, on = store.get('chem-sound', true), lastTick = 0;
  const ac = () => { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); return ctx; };
  function tone(f, at, dur, o = {}) {
    const c = ac(), osc = c.createOscillator(), g = c.createGain(), t = c.currentTime + at, vol = o.vol || .14;
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    osc.connect(g).connect(c.destination); osc.start(t); osc.stop(t + dur + .03);
  }
  const seq = (fs, step, o = {}) => fs.forEach((f, i) => tone(f, i * step, o.dur || .18, o));
  const P = {
    tap: () => tone(660, 0, .05, { type: 'triangle', vol: .05 }),
    start: () => { tone(300, 0, .35, { type: 'triangle', vol: .08, to: 900 }); seq([523, 784], .12, { dur: .2, vol: .09 }); },
    correct: c => { const k = Math.pow(2, Math.min(c || 0, 10) / 12); seq([1047 * k, 1319 * k], .07, { dur: .22, vol: .12 }); },
    wrong: () => { tone(220, 0, .28, { type: 'sawtooth', vol: .06, to: 110 }); tone(233, .02, .26, { type: 'square', vol: .025, to: 116 }); },
    tick: () => { const n = performance.now(); if (n - lastTick < 45) return; lastTick = n; tone(1400, 0, .02, { type: 'square', vol: .02 }); },
    lock: () => tone(520, 0, .12, { type: 'triangle', vol: .1, to: 780 }),
    combo: c => seq([784, 988, 1175, 1568].map(f => f * Math.pow(2, Math.min(c, 12) / 24)), .05, { dur: .12, vol: .07 }),
    badge: () => seq([1047, 1319, 1568, 2093], .07, { dur: .26, vol: .09, type: 'triangle' }),
    level: () => { seq([523, 659, 784, 1047], .11, { dur: .3, vol: .11, type: 'triangle' }); tone(1047, .5, .7, { vol: .09 }); tone(1568, .5, .7, { vol: .05 }); },
    quest: () => seq([880, 1175, 1760], .08, { dur: .2, vol: .09 }),
    life: () => tone(440, 0, .5, { type: 'triangle', vol: .11, to: 140 }),
    clock: () => tone(1000, 0, .05, { type: 'square', vol: .035 }),
    pop: () => tone(900, 0, .1, { vol: .09, to: 420 }),
    whoosh: () => tone(200, 0, .4, { type: 'sawtooth', vol: .03, to: 1600 }),
    record: () => seq([784, 988, 1175, 1568, 1976], .07, { dur: .25, vol: .09, type: 'triangle' }),
    end: good => good ? seq([659, 784, 988, 1319], .1, { dur: .3, vol: .1, type: 'triangle' }) : seq([523, 494, 523], .14, { dur: .25, vol: .07 })
  };
  return { get on() { return on; }, toggle() { on = !on; store.set('chem-sound', on); if (on) P.tap(); return on; }, play(n, a) { if (!on) return; try { P[n](a); } catch {} } };
})();

/* ---------- player state (shared by all Chemisters pages) ---------- */
const G = Object.assign({
  xp: 0, streak: 0, best: 0, last: '', freezes: 0, freezesUsed: 0, playDays: 0,
  sets: 0, answered: 0, correct: 0, perfects: 0, bulls: 0, exacts: 0, orders: 0, matches: 0, speeds: 0,
  comboBest: 0, blitzBest: 0, blitzPlays: 0, survBest: 0, survPlays: 0,
  questsDone: 0, sweeps: 0, shares: 0, halves: 0, swaps: 0, badges: [], fields: [], quests: null
}, store.get(GKEY, {}));
const saveG = () => store.set(GKEY, G);

const LEVELS = [[0, 'Atom'], [60, 'Ion'], [150, 'Molecule'], [300, 'Reagent'], [500, 'Intermediate'], [800, 'Catalyst'], [1200, 'Synthesist'], [1700, 'Chemist'], [2400, 'Senior Chemist'], [3300, 'Professor'], [4500, 'Nobel Laureate']];
const level = xp => { let i = 0; while (i < LEVELS.length - 1 && xp >= LEVELS[i + 1][0]) i++; return { i, name: LEVELS[i][1], from: LEVELS[i][0], to: LEVELS[i + 1] ? LEVELS[i + 1][0] : null, next: LEVELS[i + 1] ? LEVELS[i + 1][1] : null }; };
const MODES = {
  classic: { icon: 'flask-conical', name: 'Classic', desc: '5 rounds · 4 question types', unlock: 0 },
  blitz: { icon: 'timer', name: 'Blitz', desc: '60 seconds. As many as you can.', unlock: 1 },
  surv: { icon: 'heart-pulse', name: 'Survival', desc: '3 hearts. How far can you go?', unlock: 2 }
};
const unlocked = m => level(G.xp).i >= MODES[m].unlock;

/* ---------- badges: [id, icon, name, how, tier, category, test, secret] ---------- */
const CATS = { start: 'Getting started', know: 'Knowledge', acc: 'Accuracy', combo: 'Combos', speed: 'Speed', hist: 'History', blitz: 'Blitz', surv: 'Survival', streak: 'Streaks', level: 'Levels', explore: 'Exploration', quest: 'Quests', life: 'Lifestyle', secret: 'Secret' };
const TIERS = ['', 'Common', 'Rare', 'Epic', 'Legendary'];
const hourNow = () => new Date().getHours();
const BADGES = [
  ['first', 'flask-conical', 'First reaction', 'Finish your first challenge', 1, 'start', g => g.sets + g.blitzPlays + g.survPlays >= 1],
  ['sets10', 'beaker', 'Regular', 'Finish 10 challenges', 1, 'start', g => g.sets >= 10],
  ['sets50', 'test-tubes', 'Lab rat', 'Finish 50 challenges', 2, 'start', g => g.sets >= 50],
  ['sets200', 'landmark', 'Institution', 'Finish 200 challenges', 4, 'start', g => g.sets >= 200],
  ['c10', 'circle-check', 'Warm-up', '10 right answers', 1, 'know', g => g.correct >= 10],
  ['c50', 'book-open', 'Well-read', '50 right answers', 2, 'know', g => g.correct >= 50],
  ['c200', 'library', 'Encyclopedic', '200 right answers', 3, 'know', g => g.correct >= 200],
  ['c1000', 'brain', 'Walking textbook', '1,000 right answers', 4, 'know', g => g.correct >= 1000],
  ['perfect', 'gem', 'Flawless', '5/5 in a Classic challenge', 2, 'acc', g => g.perfects >= 1],
  ['perfect5', 'diamond', 'Diamond run', '5 flawless challenges', 3, 'acc', g => g.perfects >= 5],
  ['perfect25', 'crown', 'Crown jewel', '25 flawless challenges', 4, 'acc', g => g.perfects >= 25],
  ['unassisted', 'shield-check', 'Unassisted', 'Flawless without any lifeline', 2, 'acc', (g, s) => s && s.end && s.mode === 'classic' && s.score === PER && !s.used.half && !s.used.swap],
  ['comeback', 'rotate-ccw', 'Comeback', 'Miss the first round, then win the other 4', 2, 'acc', (g, s) => s && s.end && s.mode === 'classic' && s.firstWrong && s.score === PER - 1],
  ['combo3', 'flame', 'Ignition', 'Reach a ×3 combo', 1, 'combo', g => g.comboBest >= 3],
  ['combo', 'link', 'Chain reaction', 'Reach a ×5 combo', 2, 'combo', g => g.comboBest >= 5],
  ['combo10', 'flame-kindling', 'Runaway reaction', 'Reach a ×10 combo', 3, 'combo', g => g.comboBest >= 10],
  ['combo25', 'sun', 'Supernova', 'Reach a ×25 combo', 4, 'combo', g => g.comboBest >= 25],
  ['speed1', 'zap', 'Quick thinker', 'Earn a speed bonus', 1, 'speed', g => g.speeds >= 1],
  ['speedset', 'cloud-lightning', 'Lightning round', '3 speed bonuses in one challenge', 2, 'speed', (g, s) => s && s.speeds >= 3],
  ['speed50', 'gauge', 'Rapid kinetics', '50 speed bonuses', 3, 'speed', g => g.speeds >= 50],
  ['bull', 'target', 'Time traveler', 'Guess a year within 3 years', 1, 'hist', g => g.bulls >= 1],
  ['exact', 'clock', 'Precise clock', 'Guess the exact year', 3, 'hist', g => g.exacts >= 1],
  ['bull10', 'calendar-check', 'Living calendar', '10 bullseye years', 3, 'hist', g => g.bulls >= 10],
  ['order', 'compass', 'Historian', 'Put history in perfect order', 1, 'hist', g => g.orders >= 1],
  ['order10', 'scroll', 'Chronicler', '10 perfect orders', 3, 'hist', g => g.orders >= 10],
  ['match', 'puzzle', 'Connector', 'Match every pair', 1, 'hist', g => g.matches >= 1],
  ['match10', 'network', 'Master networker', '10 perfect matchings', 3, 'hist', g => g.matches >= 10],
  ['blitz1', 'timer', 'Blitz debut', 'Play a Blitz round', 1, 'blitz', g => g.blitzPlays >= 1],
  ['blitz10', 'rocket', 'Liftoff', '10 right in one Blitz', 2, 'blitz', g => g.blitzBest >= 10],
  ['blitz15', 'orbit', 'Hyperdrive', '15 right in one Blitz', 3, 'blitz', g => g.blitzBest >= 15],
  ['blitz20', 'star', 'Shooting star', '20 right in one Blitz', 4, 'blitz', g => g.blitzBest >= 20],
  ['surv1', 'heart', 'Survivor', 'Play Survival', 1, 'surv', g => g.survPlays >= 1],
  ['surv10', 'shield', 'Shielded', 'Reach 10 in Survival', 2, 'surv', g => g.survBest >= 10],
  ['surv25', 'castle', 'Fortress', 'Reach 25 in Survival', 3, 'surv', g => g.survBest >= 25],
  ['surv50', 'swords', 'Unkillable', 'Reach 50 in Survival', 4, 'surv', g => g.survBest >= 50],
  ['s3', 'calendar-days', 'Three days running', 'Reach a 3-day streak', 1, 'streak', g => g.best >= 3],
  ['s7', 'trophy', 'Week of chemistry', 'Reach a 7-day streak', 2, 'streak', g => g.best >= 7],
  ['s14', 'sun', 'Fortnight', 'Reach a 14-day streak', 3, 'streak', g => g.best >= 14],
  ['s30', 'moon', 'Full moon', 'Reach a 30-day streak', 4, 'streak', g => g.best >= 30],
  ['s100', 'badge-check', 'Centurion', 'Reach a 100-day streak', 4, 'streak', g => g.best >= 100],
  ['freeze', 'snowflake', 'Ice cold', 'A streak freeze saved your streak', 2, 'streak', g => g.freezesUsed >= 1],
  ['lv3', 'atom', 'Molecule', 'Reach level 3', 1, 'level', g => level(g.xp).i >= 2],
  ['lv5', 'dna', 'Intermediate', 'Reach level 5', 2, 'level', g => level(g.xp).i >= 4],
  ['lv6', 'cog', 'Catalyst', 'Reach level 6', 2, 'level', g => level(g.xp).i >= 5],
  ['lv8', 'microscope', 'Chemist', 'Reach level 8', 3, 'level', g => level(g.xp).i >= 7],
  ['lv10', 'graduation-cap', 'Professor', 'Reach level 10', 4, 'level', g => level(g.xp).i >= 9],
  ['lv11', 'medal', 'Nobel Laureate', 'Reach the top level', 4, 'level', g => level(g.xp).i >= 10],
  ['ex2', 'door-open', 'Curious', 'Play on 2 Chemisters pages', 1, 'explore', g => g.fields.length >= 2],
  ['explorer', 'map', 'Explorer', 'Play on 3 Chemisters pages', 2, 'explore', g => g.fields.length >= 3],
  ['ex10', 'globe', 'Globetrotter', 'Play on 10 Chemisters pages', 3, 'explore', g => g.fields.length >= 10],
  ['ex25', 'telescope', 'Polymath', 'Play on 25 Chemisters pages', 4, 'explore', g => g.fields.length >= 25],
  ['q1', 'clipboard-check', 'On a mission', 'Complete a daily quest', 1, 'quest', g => g.questsDone >= 1],
  ['sweep', 'sparkles', 'Clean sweep', 'Complete all 3 quests in one day', 2, 'quest', g => g.sweeps >= 1],
  ['q30', 'award', 'Quest master', 'Complete 30 quests', 3, 'quest', g => g.questsDone >= 30],
  ['sweep10', 'party-popper', 'Unstoppable', '10 clean sweeps', 4, 'quest', g => g.sweeps >= 10],
  ['owl', 'moon-star', 'Night owl', 'Play between midnight and 5 am', 2, 'life', (g, s) => s && s.end && hourNow() < 5],
  ['bird', 'sunrise', 'Early bird', 'Play between 5 and 8 am', 2, 'life', (g, s) => s && s.end && hourNow() >= 5 && hourNow() < 8],
  ['weekend', 'sofa', 'Weekend scientist', 'Play on a weekend', 1, 'life', (g, s) => s && s.end && [0, 6].includes(new Date().getDay())],
  ['half', 'scissors', 'Fifty-fifty', 'Use a 50/50', 1, 'life', g => g.halves >= 1],
  ['swap', 'shuffle', 'Second thoughts', 'Swap a question', 1, 'life', g => g.swaps >= 1],
  ['share', 'megaphone', 'Spreading science', 'Share your score', 1, 'life', g => g.shares >= 1],
  ['share10', 'radio-tower', 'Broadcaster', 'Share 10 scores', 3, 'life', g => g.shares >= 10],
  ['accident', 'triangle-alert', 'Lab accident', 'Score 0/5 — every great chemist has one', 1, 'secret', (g, s) => s && s.end && s.mode === 'classic' && s.score === 0, 1],
  ['pi', 'pi', 'Pi time', 'Play at 3:14', 2, 'secret', (g, s) => { const d = new Date(); return s && s.end && d.getHours() % 12 === 3 && d.getMinutes() === 14; }, 1],
  ['answer42', 'earth', 'The answer', 'Exactly 42 right answers in total', 2, 'secret', g => g.correct === 42, 1],
  ['lastheart', 'heart-pulse', 'Last-heart hero', '10 right in Survival on your last heart', 3, 'secret', (g, s) => s && s.mode === 'surv' && s.lastHeartRun >= 10, 1]
];
/* progress toward counter badges: id -> [stat, needed] */
const NEED = { sets10: ['sets', 10], sets50: ['sets', 50], sets200: ['sets', 200], c10: ['correct', 10], c50: ['correct', 50], c200: ['correct', 200], c1000: ['correct', 1000],
  perfect5: ['perfects', 5], perfect25: ['perfects', 25], speed50: ['speeds', 50], bull10: ['bulls', 10], order10: ['orders', 10], match10: ['matches', 10],
  s3: ['best', 3], s7: ['best', 7], s14: ['best', 14], s30: ['best', 30], s100: ['best', 100], ex2: ['fields', 2], explorer: ['fields', 3], ex10: ['fields', 10], ex25: ['fields', 25],
  q30: ['questsDone', 30], sweep10: ['sweeps', 10], share10: ['shares', 10], blitz10: ['blitzBest', 10], blitz15: ['blitzBest', 15], blitz20: ['blitzBest', 20],
  surv10: ['survBest', 10], surv25: ['survBest', 25], surv50: ['survBest', 50], combo3: ['comboBest', 3], combo: ['comboBest', 5], combo10: ['comboBest', 10], combo25: ['comboBest', 25] };
const have = k => k === 'fields' ? G.fields.length : (G[k] || 0);
const medal = (icon, tier, locked, size = '') => `<span class="medal t${tier}${locked ? ' locked' : ''} ${size}">${ic(icon)}${locked ? `<span class="m-lock">${ic('lock')}</span>` : ''}</span>`;
function nextBadge() {
  let best = null;
  for (const [id, need] of Object.entries(NEED)) {
    if (G.badges.includes(id)) continue;
    const r = have(need[0]) / need[1];
    if (r < 1 && (!best || r > best.r)) best = { id, r, h: have(need[0]), n: need[1] };
  }
  return best && { ...best, b: BADGES.find(x => x[0] === best.id) };
}

/* ---------- layers: things that must show in fullscreen too ---------- */
const layer = () => document.fullscreenElement || document.webkitFullscreenElement || document.body;
const stack = document.createElement('div'); stack.className = 'btoasts';
const placeStack = () => layer().appendChild(stack); placeStack();
function bigToast(icon, title, sub, cls = '', tier = 1) {
  placeStack();
  const el = document.createElement('div'); el.className = `btoast ${cls}`;
  el.innerHTML = `${medal(icon, tier, false, 'sm')}<div><b>${esc(title)}</b><small>${esc(sub)}</small></div>`;
  stack.appendChild(el); setTimeout(() => el.classList.add('out'), 3200); setTimeout(() => el.remove(), 3700);
}
function checkBadges(S) {
  for (const [id, icon, nm, , tier, , test] of BADGES) {
    if (G.badges.includes(id)) continue;
    let ok = false; try { ok = test(G, S); } catch {}
    if (!ok) continue;
    G.badges.push(id); if (S) S.newBadges.push(id);
    bigToast(icon, nm, `${TIERS[tier]} badge unlocked`, `t${tier}`, tier); SFX.play('badge');
    if (tier >= 3) { confetti(120); flash('gold'); }
  }
  saveG();
}

/* ---------- screen effects ---------- */
function confetti(n = 80, x = innerWidth / 2, y = innerHeight / 3) {
  if (REDUCED) return;
  const c = document.createElement('canvas'), ctx = c.getContext('2d'), dpr = devicePixelRatio || 1;
  c.className = 'confetti'; c.width = innerWidth * dpr; c.height = innerHeight * dpr; layer().appendChild(c); ctx.scale(dpr, dpr);
  const cs = getComputedStyle(document.documentElement);
  const cols = ['--accent', '--accent2', '--ok'].map(v => cs.getPropertyValue(v).trim()).concat(['#fbbf24', '#f472b6']);
  const P = Array.from({ length: n }, () => ({ x, y, vx: (Math.random() - .5) * 13, vy: -Math.random() * 12 - 3, r: Math.random() * 6 + 3, c: pick(cols), a: Math.random() * 6, va: (Math.random() - .5) * .4, hex: Math.random() < .35 }));
  let t = 0;
  (function f() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    P.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += .35; p.vx *= .99; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - t / 90);
      if (p.hex) { ctx.beginPath(); for (let k = 0; k < 6; k++) ctx.lineTo(p.r * Math.cos(k * Math.PI / 3), p.r * Math.sin(k * Math.PI / 3)); ctx.closePath(); ctx.strokeStyle = p.c; ctx.lineWidth = 2; ctx.stroke(); }
      else ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
      ctx.restore();
    });
    if (++t < 90) requestAnimationFrame(f); else c.remove();
  })();
}
const center = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
const burstAt = el => { const [x, y] = center(el); confetti(30, x, y); };
function floatXP(el, txt) {
  const r = el.getBoundingClientRect(), s = document.createElement('span');
  s.className = 'xp-float'; s.textContent = txt; s.style.left = `${r.left + r.width / 2}px`; s.style.top = `${r.top}px`;
  layer().appendChild(s); setTimeout(() => s.remove(), 1100);
}
/* full-screen vignette flash: good / bad / gold / fire */
function flash(kind) {
  if (REDUCED && kind !== 'bad') return;
  const v = document.createElement('div'); v.className = `vfx ${kind}`; layer().appendChild(v); setTimeout(() => v.remove(), 900);
}
/* expanding ring from the clicked element */
function ripple(el, good) {
  if (REDUCED || !el) return;
  const [x, y] = center(el), r = document.createElement('span');
  r.className = `ripple ${good ? 'good' : 'bad'}`; r.style.left = `${x}px`; r.style.top = `${y}px`; layer().appendChild(r); setTimeout(() => r.remove(), 800);
}
function quake() { qz.classList.remove('quake'); void qz.offsetWidth; qz.classList.add('quake'); }
function pulseCard() { qz.classList.remove('pulse-ok'); void qz.offsetWidth; qz.classList.add('pulse-ok'); }
function banner(text, icon, cls = '') {
  const b = document.createElement('div'); b.className = `qbanner ${cls}`; b.innerHTML = `${ic(icon)}<span>${esc(text)}</span>`;
  qz.appendChild(b); setTimeout(() => b.remove(), 1500);
}
function levelOverlay(L, extra) {
  const o = document.createElement('div'); o.className = 'lvl-over';
  o.innerHTML = `<div class="lo-rays"></div><div class="lo-in">${medal('arrow-up', 4, false, 'xl')}<small>Level up</small><b>Lv ${L.i + 1} · ${esc(L.name)}</b>${extra ? `<p>${esc(extra)}</p>` : ''}<span>Tap to continue</span></div>`;
  qz.appendChild(o); SFX.play('level'); confetti(180); flash('gold');
  const close = () => { o.classList.add('out'); setTimeout(() => o.remove(), 400); };
  o.onclick = close; setTimeout(close, 3600);
}

/* ---------- fullscreen ---------- */
const fsOn = () => qz.classList.contains('is-fs');
function setFsIcons() { $$('#qz .fs').forEach(b => { b.innerHTML = ic(fsOn() ? 'minimize-2' : 'maximize-2'); b.title = fsOn() ? 'Exit fullscreen' : 'Fullscreen'; }); }
function toggleFS() {
  SFX.play('tap');
  const native = document.fullscreenElement === qz || document.webkitFullscreenElement === qz;
  if (native) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
  if (qz.classList.contains('pseudo-fs')) { qz.classList.remove('pseudo-fs', 'is-fs'); document.documentElement.classList.remove('no-scroll'); setFsIcons(); return; }
  const pseudo = () => { qz.classList.add('pseudo-fs', 'is-fs'); document.documentElement.classList.add('no-scroll'); setFsIcons(); };
  const req = qz.requestFullscreen || qz.webkitRequestFullscreen;
  if (!req) return pseudo();
  try { const p = req.call(qz); if (p && p.catch) p.catch(pseudo); } catch { pseudo(); }
}
['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, () => {
  const native = document.fullscreenElement === qz || document.webkitFullscreenElement === qz;
  qz.classList.toggle('is-fs', native || qz.classList.contains('pseudo-fs')); placeStack(); setFsIcons();
}));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && qz.classList.contains('pseudo-fs')) toggleFS(); });

/* ---------- daily quests ---------- */
const QUESTS = {
  answer10: ['Answer 10 questions', 10], correct8: ['Get 8 right answers', 8],
  combo3: ['Reach a ×3 combo', 3, 1], combo5: ['Reach a ×5 combo', 5, 1],
  bull: ['Guess a year within 3 years', 1], perfect: ['Score 5/5 in Classic', 1],
  speed3: ['Earn 3 speed bonuses', 3], history: ['Get a perfect order or matching', 1],
  classic2: ['Finish 2 Classic challenges', 2], pages2: ['Play on 2 Chemisters pages today', 2, 1],
  blitz8: ['Score 8+ in one Blitz', 1, 0, 'blitz'], surv5: ['Reach 5 in Survival', 1, 0, 'surv']
};
function ensureQuests() {
  if (G.quests && G.quests.day === TODAY) return;
  let h = 0; for (const c of TODAY) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => { h = (h + 0x6D2B79F5) >>> 0; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const pool = Object.keys(QUESTS).filter(k => !QUESTS[k][3] || unlocked(QUESTS[k][3]));
  const ids = []; while (ids.length < 3 && pool.length) ids.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  G.quests = { day: TODAY, ids, prog: {}, done: [], pages: [] }; saveG();
}
function quest(id, v = 1) {
  ensureQuests();
  const Q = G.quests, def = QUESTS[id];
  if (!def || !Q.ids.includes(id) || Q.done.includes(id)) return;
  Q.prog[id] = def[2] ? Math.max(Q.prog[id] || 0, v) : (Q.prog[id] || 0) + v;
  if (Q.prog[id] >= def[1]) {
    Q.done.push(id); G.xp += 25; G.questsDone++;
    bigToast('clipboard-check', `Quest complete: ${def[0]}`, '+25 XP', 'quest', 2); SFX.play('quest');
    if (Q.done.length === Q.ids.length) { G.xp += 50; G.sweeps++; setTimeout(() => { bigToast('sparkles', 'Clean sweep!', 'All daily quests done · +50 XP', 'quest', 3); SFX.play('level'); confetti(140); flash('gold'); }, 700); }
  }
  saveG();
}

/* ---------- streak (with freezes) ---------- */
function streakInfo() {
  if (!G.last) return { state: 'none', n: 0 };
  const d = daysBetween(G.last, TODAY);
  if (d === 0) return { state: 'done', n: G.streak };
  if (d === 1) return { state: 'alive', n: G.streak };
  if (d === 2 && G.freezes > 0) return { state: 'frozen', n: G.streak };
  return { state: 'lost', n: 0 };
}
function updateStreak(S) {
  if (G.last === TODAY) return;
  const d = G.last ? daysBetween(G.last, TODAY) : 99;
  if (d === 1) G.streak++;
  else if (d === 2 && G.freezes > 0) { G.freezes--; G.freezesUsed++; G.streak++; S.notes.push(['snowflake', 'A streak freeze saved your streak.']); }
  else G.streak = 1;
  G.last = TODAY; G.playDays++; S.xp += 10;
  if (G.streak % 7 === 0 && G.freezes < 2) { G.freezes++; S.notes.push(['snowflake', 'You earned a streak freeze: it protects one missed day.']); }
  G.best = Math.max(G.best, G.streak);
  SFX.play('whoosh');
}

/* ---------- question generators ---------- */
const BR = F.branches.filter(b => b.example);
const EV = T.map((e, i) => ({ ...e, i }));
let BANK = [];
function genYear(avoid) { const c = shuffle(EV).find(e => !avoid.has(`y${e.i}`)) || pick(EV); return { id: `y${c.i}`, type: 'year', ev: c }; }
function genOrder() {
  const evs = [], used = new Set();
  for (const e of shuffle(EV)) { if (!used.has(e.year)) { used.add(e.year); evs.push(e); } if (evs.length === 4) break; }
  return { id: `o${evs.map(e => e.i).sort((a, b) => a - b).join('-')}`, type: 'order', evs };
}
function genMatch() { const bs = shuffle(BR).slice(0, 3); return { id: `m${bs.map(b => b.name).join('|')}`, type: 'match', bs }; }
function genBranchMCQ(avoid = new Set()) {
  const i = shuffle(F.branches.map((_, k) => k)).find(k => !avoid.has(`b${k}`)) ?? 0, b = F.branches[i];
  return { id: `b${i}`, type: 'mcq', q: `Which branch is this? “${b.summary}”`, options: [b.name, ...shuffle(F.branches.filter((_, k) => k !== i)).slice(0, 3).map(x => x.name)], answer: 0, explain: `${b.name}. Example: ${b.example}` };
}
function genFirst() {
  let a, b; do { [a, b] = shuffle(EV).slice(0, 2); } while (a.year === b.year);
  const [e, l] = a.year < b.year ? [a, b] : [b, a];
  return { id: `f${e.i}-${l.i}`, type: 'mcq', q: 'Which came first?', options: [e.title, l.title], answer: 0, explain: `${e.title} — ${e.year}. ${l.title} — ${l.year}.` };
}
function genYearMCQ() {
  const e = pick(EV), others = shuffle([...new Set(EV.filter(x => x.year !== e.year).map(x => x.year))]).slice(0, 3);
  return { id: `ym${e.i}`, type: 'mcq', q: `In which year? ${e.title}`, options: [String(e.year), ...others.map(String)], answer: 0, explain: `${e.year}: ${e.text}` };
}
function quickQ(used) {
  for (let t = 0; t < 40; t++) {
    const r = Math.random();
    const q = r < .4 && BANK.length ? { ...pick(BANK), type: 'mcq' } : r < .62 ? genFirst() : r < .82 ? genYearMCQ() : genBranchMCQ();
    if (!used.has(q.id)) { used.add(q.id); return q; }
  }
  return genFirst();
}
function nextSet() {
  let seen = store.get(SEEN, []);
  const recent = new Set(seen.slice(-60));
  let fresh = shuffle(BANK.filter(q => !seen.includes(q.id)));
  if (fresh.length < 3) { const last = new Set(seen.slice(-PER)); seen = seen.slice(-PER); fresh = shuffle(BANK.filter(q => !last.has(q.id))); }
  const mcqs = fresh.slice(0, 3).map(q => ({ ...q, type: 'mcq' }));
  while (mcqs.length < 3) mcqs.push(genBranchMCQ(recent));
  const set = [mcqs[0], genYear(recent), mcqs[1], Math.random() < .5 && BR.length >= 3 ? genMatch() : genOrder(), mcqs[2]];
  store.set(SEEN, [...seen, ...set.map(q => q.id)].slice(-2000));
  return set;
}
function swapFor(q, set) {
  const ids = new Set(set.map(x => x.id));
  if (q.type === 'year') return genYear(ids);
  if (q.type === 'order') return genOrder();
  if (q.type === 'match') return genMatch();
  const seen = store.get(SEEN, []), cand = shuffle(BANK.filter(b => !seen.includes(b.id) && !ids.has(b.id)));
  if (cand.length) { store.set(SEEN, [...seen, cand[0].id]); return { ...cand[0], type: 'mcq' }; }
  return genBranchMCQ(ids);
}

/* ---------- HUD ---------- */
function hud(S) {
  const xp = G.xp + (S ? S.xp : 0), L = level(xp), pct = L.to ? Math.min(100, (xp - L.from) / (L.to - L.from) * 100) : 100, st = streakInfo();
  return `<div class="hud">
    <div class="hud-lvl"><span class="lvl-badge">Lv ${L.i + 1}</span><div><b>${L.name}</b><div class="xpbar" title="${xp} XP"><i style="width:${pct}%"></i></div></div></div>
    <div class="hud-right">
      ${S && S.mode === 'surv' ? `<span class="hearts" aria-label="${S.lives} hearts left">${[0, 1, 2].map(i => i < S.lives ? ic('heart', 'full') : ic('heart-crack', 'lost')).join('')}</span>` : ''}
      ${S ? `<span class="chip-c combo${S.combo > 1 ? ' on' : ''}" title="Combo">${ic('zap')}×${S.combo}</span>` : ''}
      <span class="chip-c streak${st.n ? ' on' : ''}" title="Daily streak">${ic('flame')}${st.n}</span>
      ${G.freezes ? `<span class="chip-c frz" title="Streak freezes: each protects one missed day">${ic('snowflake')}${G.freezes}</span>` : ''}
      <button class="icbtn snd" type="button" aria-label="Sound on or off" title="Sound">${ic(SFX.on ? 'volume-2' : 'volume-x')}</button>
      <button class="icbtn fs" type="button" aria-label="Fullscreen" title="${fsOn() ? 'Exit fullscreen' : 'Fullscreen'}">${ic(fsOn() ? 'minimize-2' : 'maximize-2')}</button>
    </div></div>`;
}
qz.addEventListener('click', e => {
  if (e.target.closest('.snd')) { const on = SFX.toggle(); $$('#qz .snd').forEach(b => b.innerHTML = ic(on ? 'volume-2' : 'volume-x')); }
  if (e.target.closest('.fs')) toggleFS();
});

/* ---------- start screen ---------- */
function startScreen() {
  ensureQuests();
  qz.classList.remove('onfire', 'danger');
  const st = streakInfo(), Q = G.quests;
  const line = st.state === 'done' ? `Streak safe today: <b>${G.streak} day${G.streak > 1 ? 's' : ''}</b>. Keep playing for XP and quests.`
    : st.state === 'alive' ? `Play today to keep your <b>${G.streak}-day streak</b> alive.`
    : st.state === 'frozen' ? `You missed yesterday. A streak freeze will save your <b>${G.streak}-day streak</b> if you play today.`
    : st.state === 'lost' ? `Your ${G.streak}-day streak ended. Start a new one today.`
    : 'Play today to start your streak. It counts on every Chemisters page.';
  const best = { blitz: G.blitzBest, surv: G.survBest }, nb = nextBadge();
  qz.innerHTML = `${hud()}
  <div class="start">
    <div class="start-hero" aria-hidden="true"><span class="sh-ring"></span>${ic('flask-conical')}<i></i><i></i><i></i></div>
    <h3>Choose your mode</h3>
    <p class="start-streak">${ic('flame')}<span>${line}</span></p>
    <div class="modes">${Object.entries(MODES).map(([k, m]) => {
      const open = unlocked(k);
      return `<button class="mode m-${k}${open ? '' : ' locked'}" type="button" data-mode="${k}" ${open ? '' : 'aria-disabled="true"'}>
        <span class="m-ic">${ic(open ? m.icon : 'lock')}</span><b>${m.name}</b><small>${open ? m.desc : `Unlocks at ${LEVELS[m.unlock][1]} (level ${m.unlock + 1})`}</small>
        ${open && best[k] ? `<em>${ic('trophy')}Best ${best[k]}</em>` : ''}</button>`;
    }).join('')}</div>
    <div class="quests"><div class="qh"><b>${ic('list-checks')}Daily quests</b><small>New ones tomorrow · +25 XP each · +50 for all 3</small></div>
      ${Q.ids.map(id => { const [t, goal] = QUESTS[id], p = Math.min(goal, Q.prog[id] || 0), done = Q.done.includes(id);
        return `<div class="qr${done ? ' done' : ''}"><span class="qi">${ic(done ? 'circle-check' : 'circle')}</span><div><p>${esc(t)}</p><div class="qbar"><i style="width:${p / goal * 100}%"></i></div></div><small>${p}/${goal}</small></div>`; }).join('')}</div>
    ${nb ? `<div class="nextb">${medal(nb.b[1], nb.b[4], true, 'sm')}<div><small>Next badge</small><b>${esc(nb.b[2])}</b><div class="qbar"><i style="width:${nb.r * 100}%"></i></div></div><em>${nb.h}/${nb.n}</em></div>` : ''}
    <div class="start-links">
      <button class="pill" type="button" data-panel="badges">${ic('award')}Badges ${G.badges.length}/${BADGES.length}</button>
      <button class="pill" type="button" data-panel="stats">${ic('chart-column')}Stats</button>
      <button class="pill" type="button" data-panel="levels">${ic('mountain-snow')}Levels</button>
    </div>
    <div class="panel" id="panel" hidden></div>
  </div>`;
  $$('#qz .mode').forEach(b => b.onclick = () => {
    const m = b.dataset.mode;
    if (!unlocked(m)) { SFX.play('wrong'); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); toast(`Reach ${LEVELS[MODES[m].unlock][1]} to unlock ${MODES[m].name}`); return; }
    track(`quiz-start-${m}/${F.slug}`); SFX.play('start');
    ({ classic: playClassic, blitz: playBlitz, surv: playSurvival })[m]();
  });
  bindPanels();
}
function bindPanels() {
  $$('#qz [data-panel]').forEach(b => b.onclick = () => {
    const p = $('#panel'), which = b.dataset.panel;
    if (!p.hidden && p.dataset.on === which) { p.hidden = true; return; }
    p.dataset.on = which; p.hidden = false; SFX.play('tap');
    p.innerHTML = which === 'badges' ? badgeWall() : which === 'stats' ? statsPanel() : levelsPanel();
  });
}
function badgeWall(fresh = []) {
  return `<div class="bw-legend">${[1, 2, 3, 4].map(t => `<span class="lg t${t}"><i></i>${TIERS[t]}</span>`).join('')}</div>` + Object.entries(CATS).map(([c, title]) => {
    const list = BADGES.filter(b => b[5] === c), got = list.filter(b => G.badges.includes(b[0])).length;
    return `<div class="bw-cat"><h4>${title}<span>${got}/${list.length}</span></h4><div class="badges">${list.map(([id, icon, nm, how, tier, , , secret]) => {
      const owned = G.badges.includes(id), hide = secret && !owned, need = NEED[id];
      const prog = !owned && need ? `<div class="bprog"><i style="width:${Math.min(100, have(need[0]) / need[1] * 100)}%"></i></div><em>${Math.min(have(need[0]), need[1])}/${need[1]}</em>` : '';
      return `<div class="badge${owned ? ' got' : ''}${fresh.includes(id) ? ' new' : ''}" title="${esc(hide ? 'Secret badge' : how)}">
        ${medal(hide ? 'lock' : icon, tier, !owned)}<b>${esc(hide ? 'Secret' : nm)}</b><small>${esc(hide ? 'Keep playing to find it' : how)}</small>${prog}<i class="tier t${tier}">${TIERS[tier]}</i></div>`;
    }).join('')}</div></div>`;
  }).join('');
}
function statsPanel() {
  const acc = G.answered ? Math.round(G.correct / G.answered * 100) : 0;
  const tiles = [['crosshair', `${acc}%`, 'accuracy'], ['circle-check', G.correct, 'right answers'], ['flask-conical', G.sets, 'Classic played'], ['gem', G.perfects, 'flawless'],
    ['zap', G.comboBest, 'best combo'], ['flame', G.best, 'longest streak'], ['timer', G.blitzBest, 'best Blitz'], ['heart-pulse', G.survBest, 'best Survival'],
    ['gauge', G.speeds, 'speed bonuses'], ['target', G.bulls, 'bullseye years'], ['map', G.fields.length, 'pages played'], ['clipboard-check', G.questsDone, 'quests done']];
  return `<div class="stats">${tiles.map(([i, v, l]) => `<div>${ic(i)}<b>${v}</b><small>${l}</small></div>`).join('')}</div>`;
}
function levelsPanel() {
  const cur = level(G.xp).i;
  return `<ol class="lvls">${LEVELS.map(([xp, n], i) => `<li class="${i < cur ? 'past' : i === cur ? 'cur' : ''}"><span class="lv-n">${i < cur ? ic('check') : i + 1}</span><b>${n}</b><small>${xp} XP${i === 1 ? ' · unlocks Blitz' : i === 2 ? ' · unlocks Survival' : ''}</small></li>`).join('')}</ol>`;
}

/* ---------- shared answer bookkeeping ---------- */
const PRAISE = ['Nailed it!', 'Exactly right!', 'Textbook!', 'Spot on!', 'Brilliant!', 'Perfect yield!', 'Clean reaction!', 'You know your stuff!', 'Sharp!', 'Beautiful!'];
const NUDGE = ['Not quite. Here’s the trick:', 'Close call. Remember this:', 'Good guess, but:', 'This one fools many chemists:', 'Now you’ll never forget it:'];
function newS(mode) {
  return { mode, k: 0, score: 0, xp: 0, combo: 0, maxCombo: 0, lives: 3, log: [], newBadges: [], notes: [], used: { half: false, swap: false }, speeds: 0, lvl0: level(G.xp).i, firstWrong: false, lastHeartRun: 0, end: false };
}
function recordAnswer(S, ok, el, base, info = {}) {
  G.answered++; quest('answer10');
  if (ok) {
    S.score++; S.combo++; S.maxCombo = Math.max(S.maxCombo, S.combo); G.correct++;
    G.comboBest = Math.max(G.comboBest, S.combo);
    const bonus = Math.min(10, (S.combo - 1) * 2) + (info.speed ? 3 : 0);
    S.xp += base + bonus;
    if (el) { floatXP(el, `+${base + bonus} XP`); ripple(el, true); if (S.mode !== 'blitz') burstAt(el); }
    flash('good'); pulseCard();
    SFX.play('correct', S.combo);
    if ([3, 5, 10, 15, 20, 25].includes(S.combo)) { SFX.play('combo', S.combo); banner(`Combo ×${S.combo}`, 'flame', 'fire'); flash('fire'); }
    quest('correct8'); quest('combo3', S.combo); quest('combo5', S.combo);
    if (S.mode === 'surv' && S.lives === 1) S.lastHeartRun++;
    buzz(15);
  } else {
    if (S.k === 0 && S.mode === 'classic') S.firstWrong = true;
    if (S.combo >= 3) banner('Combo lost', 'zap', 'lost');
    S.combo = 0; S.xp += S.mode === 'blitz' ? 0 : 2; SFX.play('wrong'); buzz([30, 40, 30]);
    flash('bad'); quake(); ripple(el, false);
    if (el) el.classList.add('shake');
  }
  qz.classList.toggle('onfire', S.combo >= 3);
  if (info.speed) { G.speeds++; S.speeds++; quest('speed3'); }
  if (info.bull) { G.bulls++; quest('bull'); }
  if (info.exact) G.exacts++;
  if (info.order) { G.orders++; quest('history'); }
  if (info.match) { G.matches++; quest('history'); }
  checkBadges(S); saveG();
}

/* ---------- MCQ renderer (all modes) ---------- */
const KIND = { mcq: ['list', 'Multiple choice'], year: ['calendar-range', 'Guess the year'], order: ['arrow-down-up', 'Put in order'], match: ['puzzle', 'Match the pairs'], blitz: ['timer', 'Blitz'], surv: ['heart-pulse', 'Survival'] };
const kindLabel = (k, extra = '') => `<div class="q-kind">${ic(KIND[k][0])}<span>${KIND[k][1]}${extra}</span></div>`;
function mcqHTML(q, order, kind, extra, speedRing) {
  return `<div class="q-row">${kindLabel(kind, extra)}${speedRing ? `<span class="spdring" title="Answer before the ring empties for +3 XP"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15"/></svg>${ic('zap')}</span>` : ''}</div>
    <div class="q-text">${esc(q.q)}</div>
    <div class="opts${order.length === 2 ? ' two' : ''}">${order.map((o, i) => `<button class="opt" type="button" data-i="${i}"><kbd>${'ABCD'[i]}</kbd><span>${esc(o.t)}</span></button>`).join('')}</div>`;
}
function bindMCQ(order, onPick) {
  const btns = $$('#qz .opt');
  const choose = i => {
    if (!btns[i] || btns[0].disabled || btns[i].classList.contains('gone')) return;
    btns.forEach((x, j) => { x.disabled = true; if (order[j].ok) x.classList.add('right'); });
    if (!order[i].ok) btns[i].classList.add('wrong');
    const ring = $('#qz .spdring'); if (ring) ring.classList.add('stop');
    onPick(order[i].ok, btns[i], order[i].t, order.find(o => o.ok).t);
  };
  btns.forEach((b, i) => b.onclick = () => choose(i));
  qz.onkeydown = e => { const k = 'abcd'.indexOf(e.key.toLowerCase()), n = +e.key; if (k >= 0) choose(k); else if (n >= 1 && n <= 4) choose(n - 1); };
  return btns;
}
const fbHead = (ok, text, icon) => `<b class="fb-h">${ic(icon || (ok ? 'check' : 'x'))}<span>${text}</span></b>`;

/* =============== CLASSIC =============== */
function playClassic() {
  const set = nextSet(), S = newS('classic');
  const dots = () => `<div class="q-bar">${set.map((_, i) => `<i class="${S.log[i] ? (S.log[i].ok ? 'ok' : 'no') : (i === S.k ? 'on' : '')}"></i>`).join('')}</div>`;
  let t0 = 0;
  function frame(inner) {
    const q = set[S.k], canHalf = !S.used.half && q.type === 'mcq' && q.options.length >= 4;
    qz.innerHTML = `${hud(S)}<div class="q-top"><span>Round ${S.k + 1} of ${set.length}</span>${dots()}</div>
      <div class="lifelines"><button type="button" class="ll" id="ll-half" ${canHalf ? '' : 'disabled'}>${ic('scissors')}50/50</button><button type="button" class="ll" id="ll-swap" ${S.used.swap ? 'disabled' : ''}>${ic('shuffle')}Swap</button><span class="ll-tip">${ic('zap')}Fast answers earn bonus XP · keys A–D</span></div>
      <div class="q-stage">${inner}</div><div class="qfb" id="fb" hidden aria-live="polite"></div>`;
    $('#ll-swap').onclick = () => { S.used.swap = true; G.swaps++; SFX.play('pop'); set[S.k] = swapFor(q, set); checkBadges(S); show(); };
    t0 = performance.now();
  }
  function resolve(ok, base, el, explain, headline, info = {}, logItem, icon) {
    $$('#qz .ll').forEach(b => b.disabled = true);
    recordAnswer(S, ok, el, base, info);
    S.log.push({ ok, ...logItem });
    const fb = $('#fb');
    fb.className = `qfb ${ok ? 'good' : 'bad'}`;
    fb.innerHTML = `${fbHead(ok, headline || (ok ? pick(PRAISE) : pick(NUDGE)), icon)}${info.speed ? `<span class="spd">${ic('zap')}Speed bonus +3</span>` : ''}<div class="fb-x">${explain}</div>
      <button class="btn go" type="button" id="cont">${S.k < set.length - 1 ? 'Continue' : 'See results'} ${ic('chevron-right')}</button>`;
    fb.hidden = false;
    qz.querySelector('.hud').outerHTML = hud(S);
    qz.querySelector('.q-bar').outerHTML = dots();
    $('#cont').onclick = () => { SFX.play('tap'); S.k++; S.k < set.length ? show() : finishClassic(S, set); };
    qz.onkeydown = e => { if (e.key === 'Enter') $('#cont') && $('#cont').click(); };
    $('#cont').focus({ preventScroll: true });
    if (!fsOn()) fb.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'nearest' });
  }
  function show() { const q = set[S.k]; ({ mcq: showMCQ, year: showYear, order: showOrder, match: showMatch })[q.type](q); }
  function showMCQ(q) {
    const order = shuffle(q.options.map((t, i) => ({ t, ok: i === q.answer })));
    frame(mcqHTML(q, order, 'mcq', '', true));
    const btns = bindMCQ(order, (ok, el, yours, right) => {
      const speed = ok && performance.now() - t0 < SPEED_MS;
      resolve(ok, 10, el, esc(q.explain), null, { speed }, { q: q.q, yours, right });
    });
    const half = $('#ll-half');
    if (!half.disabled) half.onclick = () => {
      S.used.half = true; G.halves++; SFX.play('pop'); half.disabled = true;
      shuffle(order.map((o, i) => i).filter(i => !order[i].ok)).slice(0, order.length - 2).forEach(i => { btns[i].classList.add('gone'); btns[i].disabled = true; });
      checkBadges(S);
    };
  }
  function showYear(q) {
    const e = q.ev, lo = Math.floor((Math.min(...T.map(t => t.year)) - 40) / 10) * 10, hi = Math.max(new Date().getFullYear(), Math.max(...T.map(t => t.year))), start = Math.round((lo + hi) / 2);
    frame(`${kindLabel('year')}<div class="q-text">When did this happen?</div>
      <div class="yr-card"><b>${esc(e.title)}</b><p>${esc(e.text)}</p></div>
      <div class="yr"><output id="yr-out">${start}</output>
        <div class="yr-wrap"><input type="range" id="yr" min="${lo}" max="${hi}" value="${start}" step="1" aria-label="Year"><div class="yr-mark" id="yr-mark" hidden></div></div>
        <div class="yr-scale"><span>${lo}</span><span>${hi}</span></div>
        <div class="yr-fine"><button type="button" data-d="-10">−10</button><button type="button" data-d="-1">−1</button><button type="button" data-d="1">+1</button><button type="button" data-d="10">+10</button></div>
        <p class="yr-rule">${ic('target')}Within 3 years: bullseye · within 15: correct</p>
        <button class="btn go" type="button" id="lock">${ic('lock')}Lock in</button></div>`);
    const r = $('#yr'), out = $('#yr-out');
    const upd = () => { out.textContent = r.value; r.style.setProperty('--p', `${(r.value - lo) / (hi - lo) * 100}%`); SFX.play('tick'); };
    r.oninput = upd; r.style.setProperty('--p', '50%');
    $$('.yr-fine button').forEach(b => b.onclick = () => { r.value = +r.value + +b.dataset.d; upd(); });
    $('#ll-half').disabled = true;
    qz.onkeydown = ev => { if (ev.key === 'Enter' && $('#lock')) $('#lock').click(); };
    $('#lock').onclick = () => {
      const g = +r.value, d = Math.abs(g - e.year);
      SFX.play('lock'); r.disabled = true; $$('.yr-fine button').forEach(b => b.disabled = true); $('#lock').remove();
      const m = $('#yr-mark'); m.hidden = false; m.style.left = `${(e.year - lo) / (hi - lo) * 100}%`; m.dataset.y = e.year;
      const ok = d <= 15, bull = d <= 3;
      const head = d === 0 ? 'The exact year! Incredible.' : bull ? `Bullseye: only ${d} year${d > 1 ? 's' : ''} off!` : ok ? `Close: ${d} years off. Counts!` : `${d} years off.`;
      resolve(ok, bull ? 15 : 10, out, `<b>${e.year}:</b> ${esc(e.title)}. ${esc(e.why || '')}`, head, { bull, exact: d === 0 }, { q: `When: ${e.title}`, yours: g, right: e.year }, d === 0 ? 'clock' : bull ? 'target' : null);
    };
  }
  function showOrder(q) {
    const cards = shuffle(q.evs), seq = [];
    frame(`${kindLabel('order')}<div class="q-text">Tap from the <u>earliest</u> to the <u>latest</u>.</div>
      <div class="ord">${cards.map((e, i) => `<button class="ord-card" type="button" data-i="${i}"><span class="ord-n"></span><span>${esc(e.title)}</span></button>`).join('')}</div>
      <button class="btn go" type="button" id="chk" disabled>${ic('check')}Check order</button>`);
    $('#ll-half').disabled = true;
    const btns = $$('#qz .ord-card');
    const paint = () => { btns.forEach((b, i) => { const p = seq.indexOf(i); b.classList.toggle('sel', p >= 0); b.querySelector('.ord-n').textContent = p >= 0 ? p + 1 : ''; }); $('#chk').disabled = seq.length !== cards.length; };
    btns.forEach((b, i) => b.onclick = () => { const p = seq.indexOf(i); if (p >= 0) seq.splice(p); else seq.push(i); SFX.play('tap'); paint(); });
    $('#chk').onclick = () => {
      const right = cards.map((e, i) => i).sort((a, b) => cards[a].year - cards[b].year);
      let pos = 0; seq.forEach((i, k) => { if (right[k] === i) pos++; });
      btns.forEach((b, i) => { b.disabled = true; b.classList.add(right.indexOf(i) === seq.indexOf(i) ? 'right' : 'wrong'); b.insertAdjacentHTML('beforeend', `<em>${cards[i].year}</em>`); });
      $('#chk').remove();
      const ok = pos === cards.length;
      resolve(ok, 15, $('#qz .ord'), `Correct order: ${right.map(i => `<b>${cards[i].year}</b> ${esc(cards[i].title)}`).join(' → ')}`, ok ? 'Perfect timeline!' : `${pos} of ${cards.length} in the right place.`, { order: ok }, { q: 'Put events in order', yours: `${pos}/${cards.length} in place`, right: 'all 4' }, ok ? 'compass' : null);
    };
  }
  function showMatch(q) {
    const L = q.bs, R = shuffle(L.map((b, i) => ({ t: b.example, i }))), pairs = {}; let selL = 0;
    frame(`${kindLabel('match')}<div class="q-text">Match each branch to its example.</div>
      <div class="mt"><div class="mt-col">${L.map((b, i) => `<button class="mt-l" type="button" data-i="${i}">${esc(b.name)}</button>`).join('')}</div>
      <div class="mt-col">${R.map((r, j) => `<button class="mt-r" type="button" data-j="${j}">${esc(r.t)}</button>`).join('')}</div></div>
      <button class="btn go" type="button" id="chk" disabled>${ic('check')}Check pairs</button>`);
    $('#ll-half').disabled = true;
    const lb = $$('#qz .mt-l'), rb = $$('#qz .mt-r'), COL = ['c1', 'c2', 'c3'];
    const paint = () => {
      lb.forEach((b, i) => { b.className = 'mt-l' + (selL === i ? ' sel' : '') + (pairs[i] !== undefined ? ` ${COL[i]}` : ''); });
      rb.forEach((b, j) => { const i = Object.keys(pairs).find(k => pairs[k] === j); b.className = 'mt-r' + (i !== undefined ? ` ${COL[i]}` : ''); });
      $('#chk').disabled = Object.keys(pairs).length !== L.length;
    };
    lb.forEach((b, i) => b.onclick = () => { if (pairs[i] !== undefined) delete pairs[i]; selL = selL === i ? null : i; SFX.play('tap'); paint(); });
    rb.forEach((b, j) => b.onclick = () => {
      const owner = Object.keys(pairs).find(k => pairs[k] === j); if (owner !== undefined) delete pairs[owner];
      if (selL !== null) { pairs[selL] = j; const nx = L.findIndex((_, k) => pairs[k] === undefined); selL = nx < 0 ? null : nx; }
      SFX.play('tap'); paint();
    });
    paint();
    $('#chk').onclick = () => {
      let good = 0;
      lb.forEach((b, i) => { const ok = R[pairs[i]].i === i; good += ok; b.classList.add(ok ? 'right' : 'wrong'); b.disabled = true; });
      rb.forEach(b => b.disabled = true); $('#chk').remove();
      const ok = good === L.length;
      resolve(ok, 15, $('#qz .mt'), L.map(b => `<b>${esc(b.name)}</b> → ${esc(b.example)}`).join('<br>'), ok ? 'All pairs matched!' : `${good} of ${L.length} pairs right.`, { match: ok }, { q: 'Match branches to examples', yours: `${good}/${L.length} pairs`, right: 'all 3' }, ok ? 'puzzle' : null);
    };
  }
  show();
}

/* =============== BLITZ =============== */
function playBlitz() {
  const S = newS('blitz'), used = new Set(), END = Date.now() + 60000; let lastSec = 60, timer;
  qz.innerHTML = `${hud(S)}<div class="bz"><span class="bz-ic">${ic('timer')}</span><div class="bz-bar"><i id="bzbar"></i></div><b id="bzt">60</b></div>
    <div class="bz-score">Score <b id="bzs">0</b></div><div class="q-stage" id="stage"></div>`;
  const over = () => { if (S.end) return; S.end = true; clearInterval(timer); qz.onkeydown = null; qz.classList.remove('danger'); finishQuick(S); };
  timer = setInterval(() => {
    const ms = END - Date.now(), sec = Math.max(0, Math.ceil(ms / 1000)), bar = $('#bzbar');
    if (!bar) return clearInterval(timer);
    bar.style.width = `${Math.max(0, ms / 600)}%`; $('#bzt').textContent = sec;
    if (sec !== lastSec) { lastSec = sec; if (sec <= 5 && sec > 0) { SFX.play('clock'); $('#bzt').classList.add('hot'); qz.classList.add('danger'); } }
    if (ms <= 0) over();
  }, 100);
  function next() {
    if (S.end) return;
    const q = quickQ(used), order = shuffle(q.options.map((t, i) => ({ t, ok: i === q.answer })));
    const st = $('#stage'); st.innerHTML = mcqHTML(q, order, 'blitz', ` · question ${S.log.length + 1}`);
    st.classList.remove('q-stage'); void st.offsetWidth; st.classList.add('q-stage');
    bindMCQ(order, (ok, el, yours, right) => {
      if (S.end) return;
      recordAnswer(S, ok, el, 4);
      S.log.push({ ok, q: q.q, yours, right });
      $('#bzs').textContent = S.score; qz.querySelector('.hud').outerHTML = hud(S);
      setTimeout(next, ok ? 380 : 950);
    });
  }
  next();
}

/* =============== SURVIVAL =============== */
function playSurvival() {
  const S = newS('surv'), used = new Set();
  function next() {
    const q = quickQ(used), order = shuffle(q.options.map((t, i) => ({ t, ok: i === q.answer })));
    qz.innerHTML = `${hud(S)}<div class="q-top"><span>Question ${S.log.length + 1}</span><span class="surv-score">Score <b>${S.score}</b></span></div>
      <div class="q-stage">${mcqHTML(q, order, 'surv')}</div><div class="qfb" id="fb" hidden aria-live="polite"></div>`;
    qz.classList.toggle('danger', S.lives === 1);
    bindMCQ(order, (ok, el, yours, right) => {
      if (!ok) { S.lives--; SFX.play('life'); banner(S.lives ? `${S.lives} heart${S.lives > 1 ? 's' : ''} left` : 'Out of hearts', 'heart-crack', 'lost'); }
      recordAnswer(S, ok, el, 5);
      S.log.push({ ok, q: q.q, yours, right });
      qz.querySelector('.hud').outerHTML = hud(S);
      if (S.score >= 5) quest('surv5');
      if (ok) { setTimeout(next, 650); return; }
      const fb = $('#fb'); fb.className = 'qfb bad'; fb.hidden = false;
      fb.innerHTML = `${fbHead(false, S.lives ? `${S.lives} heart${S.lives > 1 ? 's' : ''} left` : 'Out of hearts', S.lives ? 'heart-crack' : 'skull')}<div class="fb-x">${esc(q.explain)}</div>
        <button class="btn go" type="button" id="cont">${S.lives ? 'Keep going' : 'See results'} ${ic('chevron-right')}</button>`;
      $('#cont').onclick = () => { SFX.play('tap'); if (S.lives) next(); else { S.end = true; qz.onkeydown = null; qz.classList.remove('danger'); finishQuick(S); } };
      qz.onkeydown = e => { if (e.key === 'Enter') $('#cont').click(); };
      $('#cont').focus({ preventScroll: true });
    });
  }
  next();
}

/* =============== RESULTS =============== */
function closeOut(S) {
  S.end = true;
  qz.classList.remove('onfire', 'danger');
  updateStreak(S);
  if (!G.fields.includes(F.slug)) G.fields.push(F.slug);
  ensureQuests(); if (!G.quests.pages.includes(F.slug)) G.quests.pages.push(F.slug); quest('pages2', G.quests.pages.length);
  const before = G.xp; G.xp += S.xp; S.gained = S.xp; S.xp = 0;
  checkBadges(S); saveG();
  const after = level(G.xp);
  return { after, before, leveled: after.i > S.lvl0 };
}
function reviewHTML(S) {
  return `<details class="review"><summary>${ic('notebook-pen')}Review your answers</summary><ol>${S.log.map(l =>
    `<li class="${l.ok ? 'ok' : 'no'}"><span class="rv-i">${ic(l.ok ? 'check' : 'x')}</span><div><p>${esc(l.q)}</p><small>${l.ok ? `Your answer: ${esc(l.yours)}` : `You: ${esc(l.yours)} · Correct: <b>${esc(l.right)}</b>`}</small></div></li>`).join('')}</ol></details>`;
}
function shareHTML(text) {
  return `<div class="res-share"><p>Challenge your colleagues</p><div class="follow">
    <button class="btn go" type="button" id="sh-card">${ic('image')}Get my score card</button>
    <a class="btn share-li" href="https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}" target="_blank" rel="noopener">${F.icons.li}Post on LinkedIn</a>
    <a class="btn share-fb" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(F.url)}" target="_blank" rel="noopener">${F.icons.fb}Share on Facebook</a>
    <button class="btn ghost" type="button" id="sh-copy">${ic('copy')}Copy</button></div>
    <p class="sh-tip">Tip: download your score card and attach it to your post.</p></div>`;
}
/* score card image (1200×630) drawn on a canvas, to download or share */
function scoreCard(big, line1, line2) {
  const W = 1200, H = 630, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'), cs = getComputedStyle(document.documentElement);
  const A = cs.getPropertyValue('--accent').trim() || '#7aa2ff', A2 = cs.getPropertyValue('--accent2').trim() || A;
  const font = (w, s) => `${w} ${s}px "Space Grotesk", Inter, system-ui, sans-serif`;
  x.fillStyle = '#0a0f1e'; x.fillRect(0, 0, W, H);
  let g = x.createRadialGradient(240, 300, 10, 240, 300, 520); g.addColorStop(0, A + '55'); g.addColorStop(1, 'transparent'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  g = x.createRadialGradient(1100, 80, 10, 1100, 80, 420); g.addColorStop(0, A2 + '33'); g.addColorStop(1, 'transparent'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = A + '22'; x.lineWidth = 1.5;
  for (let yy = -40; yy < H + 60; yy += 84) for (let xx = -40; xx < W + 60; xx += 97) {
    x.beginPath(); for (let k = 0; k < 6; k++) x.lineTo(xx + 34 * Math.cos(k * Math.PI / 3 + Math.PI / 6), yy + 34 * Math.sin(k * Math.PI / 3 + Math.PI / 6)); x.closePath(); x.stroke();
  }
  x.fillStyle = '#15213d'; x.strokeStyle = A; x.lineWidth = 3;
  x.beginPath(); x.roundRect(80, 150, 300, 300, 34); x.fill(); x.stroke();
  x.fillStyle = A; x.font = font(500, 30); x.fillText(String(F.number || ''), 108, 196);
  x.fillStyle = '#dbe6ff'; x.font = font(700, 140); x.fillText(F.symbol, 108, 400);
  x.fillStyle = A; x.font = font(600, 26); x.fillText(`${F.name.toUpperCase()} CHALLENGE`, 440, 190);
  const gr = x.createLinearGradient(440, 0, 900, 0); gr.addColorStop(0, A); gr.addColorStop(1, A2);
  x.fillStyle = gr; x.font = font(700, 150); x.fillText(big, 434, 360);
  x.fillStyle = '#e8edf8'; x.font = font(600, 36); x.fillText(line1, 440, 420);
  x.fillStyle = '#97a3bf'; x.font = font(500, 28); x.fillText(line2, 440, 466);
  x.fillStyle = '#97a3bf'; x.font = font(500, 26); x.fillText(`Can you beat it?  chemisters.com/${F.slug}`, 80, 560);
  return new Promise(r => c.toBlob(r, 'image/png'));
}
function bindShare(text, card) {
  const shared = kind => { G.shares++; checkBadges(null); saveG(); track(`share-${kind}/${F.slug}`); };
  $('#sh-copy').onclick = async () => { try { await navigator.clipboard.writeText(text); } catch {} toast('Score copied. Paste it anywhere.'); shared('copy'); };
  $$('.share-li, .share-fb').forEach(a => a.addEventListener('click', () => shared(a.classList.contains('share-li') ? 'linkedin' : 'facebook')));
  $('#sh-card').onclick = async () => {
    SFX.play('pop');
    const blob = await scoreCard(...card), file = new File([blob], `chemisters-${F.slug}-score.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text }); shared('card'); return; } catch { /* fall back to download */ }
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast('Score card downloaded'); shared('card');
  };
}
function tailHTML(S) {
  const nb = nextBadge();
  return `${S.newBadges.length ? `<div class="res-badges"><p>New badge${S.newBadges.length > 1 ? 's' : ''} unlocked</p><div class="nb-row">${S.newBadges.map(id => { const b = BADGES.find(x => x[0] === id); return `<div class="nb">${medal(b[1], b[4], false)}<b>${esc(b[2])}</b><small>${TIERS[b[4]]}</small></div>`; }).join('')}</div></div>` : ''}
    ${S.notes.map(([i, n]) => `<p class="res-note">${ic(i)}${esc(n)}</p>`).join('')}
    ${nb ? `<div class="nextb">${medal(nb.b[1], nb.b[4], true, 'sm')}<div><small>Next badge</small><b>${esc(nb.b[2])}</b><div class="qbar"><i style="width:${nb.r * 100}%"></i></div></div><em>${nb.h}/${nb.n}</em></div>` : ''}
    ${reviewHTML(S)}`;
}
function xpBarHTML(before, after) {
  const L = level(after), from = Math.max(L.from, before), pct = v => L.to ? Math.min(100, (v - L.from) / (L.to - L.from) * 100) : 100;
  return `<div class="res-xp"><div class="rx-top"><b>Lv ${L.i + 1} · ${L.name}</b><small>${L.to ? `${L.to - after} XP to ${L.next}` : 'Maximum level'}</small></div>
    <div class="rx-bar"><i class="rx-old" style="width:${pct(from)}%"></i><i class="rx-new" id="rxnew" style="width:${pct(from)}%" data-w="${pct(after)}"></i></div></div>`;
}
function commonEnd(S, again, leveled, after) {
  $('#again').onclick = () => { SFX.play('start'); again(); if (!fsOn()) qz.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' }); };
  $('#modes').onclick = () => { SFX.play('tap'); startScreen(); };
  bindPanels();
  setTimeout(() => { const n = $('#rxnew'); if (n) n.style.width = `${n.dataset.w}%`; }, 300);
  const xc = $('#xpcount'); if (xc) { let v = 0; const step = Math.max(1, Math.ceil(S.gained / 30)); (function up() { v = Math.min(S.gained, v + step); xc.textContent = `+${v}`; if (v < S.gained) requestAnimationFrame(up); })(); }
  if (leveled) setTimeout(() => levelOverlay(after, after.i === 1 ? 'Blitz mode unlocked' : after.i === 2 ? 'Survival mode unlocked' : ''), 700);
  if (!fsOn()) qz.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
}
const resNav = again => `<button class="btn go big" type="button" id="again">${again} ${ic('chevron-right')}</button>
  <div class="start-links"><button class="pill" type="button" id="modes">${ic('gamepad-2')}Modes & quests</button><button class="pill" type="button" data-panel="badges">${ic('award')}Badges ${G.badges.length}/${BADGES.length}</button><button class="pill" type="button" data-panel="stats">${ic('chart-column')}Stats</button></div>
  <div class="panel" id="panel" hidden></div>`;

function finishClassic(S, set) {
  G.sets++; quest('classic2');
  const perfect = S.score === set.length;
  if (perfect) { G.perfects++; S.xp += 20; quest('perfect'); }
  const { after, before, leveled } = closeOut(S);
  const pct = S.score / set.length, R = 52, C = 2 * Math.PI * R;
  const head = pct === 1 ? 'Flawless.' : pct >= .8 ? 'Excellent work!' : pct >= .6 ? 'Solid chemistry!' : pct >= .4 ? 'Good effort. You learned something new.' : 'Every chemist starts here.';
  const text = `I scored ${S.score}/${set.length} on the ${F.name} challenge on Chemisters${G.streak > 1 ? ` (${G.streak}-day streak)` : ''}. Can you beat me? ${F.url}`;
  qz.innerHTML = `${hud()}
  <div class="res">
    <div class="ring${perfect ? ' gold' : ''}"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${R}" class="trk"/><circle cx="60" cy="60" r="${R}" class="val" style="stroke-dasharray:${C};stroke-dashoffset:${C}" id="ringv"/></svg>
      <div class="ring-t"><b>${S.score}/${set.length}</b><span>${head}</span></div></div>
    <div class="res-stats"><div>${ic('sparkles')}<b id="xpcount">+0</b><span>XP earned</span></div><div>${ic('flame')}<b>${G.streak}</b><span>day streak</span></div><div>${ic('zap')}<b>×${S.maxCombo}</b><span>best combo</span></div></div>
    ${xpBarHTML(before, G.xp)}
    ${tailHTML(S)}
    ${shareHTML(text)}
    ${F.followHtml ? `<div class="res-follow"><p>New questions every visit, new posts every day. Follow ${esc(F.name)}:</p><div class="follow">${F.followHtml}</div></div>` : ''}
    ${resNav('Play 5 new questions')}
  </div>`;
  requestAnimationFrame(() => setTimeout(() => { const v = $('#ringv'); if (v) v.style.strokeDashoffset = C * (1 - pct); }, 60));
  SFX.play('end', pct >= .6);
  if (perfect) { flash('gold'); qz.classList.add('gold-sweep'); setTimeout(() => qz.classList.remove('gold-sweep'), 1800); }
  if (pct >= .6) setTimeout(() => confetti(perfect ? 180 : 90), 250);
  bindShare(text, [`${S.score}/${set.length}`, perfect ? 'Flawless round' : 'Classic challenge', `Level ${after.i + 1} · ${after.name}${G.streak > 1 ? ` · ${G.streak}-day streak` : ''}`]);
  commonEnd(S, playClassic, leveled, after);
  track(`quiz-done-classic/${F.slug}/${S.score}`);
}

function finishQuick(S) {
  const isB = S.mode === 'blitz', key = isB ? 'blitzBest' : 'survBest', prev = G[key];
  if (isB) { G.blitzPlays++; if (S.score >= 8) quest('blitz8'); } else { G.survPlays++; if (S.score >= 5) quest('surv5'); }
  const record = S.score > prev && S.score > 0; G[key] = Math.max(prev, S.score);
  const { after, before, leveled } = closeOut(S);
  const m = MODES[S.mode];
  const text = `I got ${S.score} in ${m.name} mode on the ${F.name} challenge on Chemisters. Can you beat me? ${F.url}`;
  qz.innerHTML = `${hud()}
  <div class="res">
    <div class="big-score"><span>${ic(m.icon)}${m.name}</span><b>${S.score}</b><small>${isB ? 'right answers in 60 seconds' : 'right answers before your hearts ran out'}</small>
      ${record ? `<em class="rec">${ic('trophy')}New personal record!</em>` : prev ? `<em>Your best: ${prev}</em>` : ''}</div>
    <div class="res-stats"><div>${ic('sparkles')}<b id="xpcount">+0</b><span>XP earned</span></div><div>${ic('zap')}<b>×${S.maxCombo}</b><span>best combo</span></div><div>${ic('crosshair')}<b>${S.log.length ? Math.round(S.score / S.log.length * 100) : 0}%</b><span>accuracy</span></div></div>
    ${xpBarHTML(before, G.xp)}
    ${tailHTML(S)}
    ${shareHTML(text)}
    ${F.followHtml ? `<div class="res-follow"><p>Follow ${esc(F.name)} for new posts every day:</p><div class="follow">${F.followHtml}</div></div>` : ''}
    ${resNav(`Play ${m.name} again`)}
  </div>`;
  if (record) { SFX.play('record'); confetti(150); flash('gold'); } else SFX.play('end', S.score >= 5);
  bindShare(text, [String(S.score), `${m.name} mode${record ? ' · new record' : ''}`, `Level ${after.i + 1} · ${after.name}`]);
  commonEnd(S, isB ? playBlitz : playSurvival, leveled, after);
  track(`quiz-done-${S.mode}/${F.slug}/${S.score}`);
}

live.then(d => {
  const extra = (d.quiz || []).filter(q => q && q.id && Array.isArray(q.options) && q.options.length > 1 && Number.isInteger(q.answer));
  const ids = new Set(F.quiz.map(q => q.id));
  BANK = [...F.quiz, ...extra.filter(q => !ids.has(q.id))];
  checkBadges(null);
  startScreen();
});
})();
