const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add CSS for navbar becoming same color as menu, and invert logo on scroll
    const cssToAdd = `
        body.menu-open #navbar {
            background: linear-gradient(-45deg, #0A2B43, #0A2B43, #0A2B43, #222222) !important;
            background-size: 400% 400% !important;
            animation: gradientBG 15s ease infinite !important;
            border-bottom-color: transparent !important;
        }

        .nav-scrolled:not(.menu-open) .nav-logo {
            filter: invert(1) brightness(0);
        }
    `;
    
    if (!content.includes('body.menu-open #navbar {')) {
        content = content.replace(
            /(body\.menu-open #mobile-menu-overlay\s*\{[\s\S]*?\}\s*)/g,
            '$1' + cssToAdd + '\n'
        );
    }

    // 2. Replace text logo in the navbar with logo.png
    // We specifically look for the <a> tag inside the flex container that holds the logo
    // Some files might have different formatting, so we use a robust regex block replacement.
    content = content.replace(
        /(<div class="flex items-center relative z-\[65\]">\s*<a[^>]*class="[^"]*nav-text[^"]*"[^>]*>)\s*NOME\s*<span class="text-secondary italic">&<\/span>\s*STUDIO\s*(<\/a>)/g,
        '$1\n                    <img src="logo.png" alt="CCM Studio Legale" class="h-10 md:h-12 w-auto nav-logo transition-all duration-500">\n                $2'
    );

    // 3. Replace NOME STUDIO in the footer
    content = content.replace(
        /NOME\s*<span class="text-secondary italic">&<\/span>\s*STUDIO/g,
        'CCM STUDIO LEGALE'
    );

    // 4. Replace NOME STUDIO in <title> and Copyright
    content = content.replace(/NOME STUDIO/g, 'CCM Studio Legale');
    content = content.replace(/Nome Studio/ig, 'CCM Studio Legale');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});
