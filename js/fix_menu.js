const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Update body.menu-open #navbar block
    const oldCssRegex = /body\.menu-open #navbar\s*\{[\s\S]*?border-bottom-color:\s*transparent\s*!important;\s*\}/g;
    
    const newCss = `body.menu-open #navbar {
            background: transparent !important;
            border-bottom-color: transparent !important;
            box-shadow: none !important;
        }`;

    if (content.match(oldCssRegex)) {
        content = content.replace(oldCssRegex, newCss);
    } else if (content.includes('body.menu-open #navbar')) {
        // Fallback if the regex didn't perfectly match (e.g., missing border-bottom-color)
        content = content.replace(/body\.menu-open #navbar\s*\{[\s\S]*?\}/, newCss);
    }

    // 2. Add rule for the logo to be white when menu opens
    const logoRegex = /body\.menu-open \.nav-logo\s*\{[\s\S]*?\}/g;
    const logoWhiteCss = `
        body.menu-open .nav-logo {
            filter: brightness(0) invert(1) !important;
        }`;
    
    if (content.match(logoRegex)) {
        content = content.replace(logoRegex, logoWhiteCss.trim());
    } else {
        // Inject after nav-scrolled rule
        content = content.replace(
            /(\.nav-scrolled:not\(\.menu-open\)\s*\.nav-logo\s*\{[\s\S]*?\})/,
            `$1\n${logoWhiteCss}`
        );
    }

    // 3. Make the mobile-menu-overlay physically "dello stesso blu" (i.e. bg-primary without gradient)
    content = content.replace(/id="mobile-menu-overlay" class="([^"]*)bg-gradient-animate/g, 'id="mobile-menu-overlay" class="$1bg-primary');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', file);
});
