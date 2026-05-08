const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, searchRegex, replaceValue) {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(searchRegex, replaceValue);
    fs.writeFileSync(fullPath, content);
}

// ./src/app/(main)/contact/page.tsx
replaceInFile('./src/app/(main)/contact/page.tsx', /we'll/g, 'we&apos;ll');

// ./src/app/(main)/ideas/page.tsx
replaceInFile('./src/app/(main)/ideas/page.tsx', /You haven't/g, 'You haven&apos;t');
replaceInFile('./src/app/(main)/ideas/page.tsx', /we've/g, 'we&apos;ve');
replaceInFile('./src/app/(main)/ideas/page.tsx', /they're/g, 'they&apos;re');

// ./src/components/home/HeroSection.tsx
replaceInFile('./src/components/home/HeroSection.tsx', /Badge, /g, '');
replaceInFile('./src/components/home/HeroSection.tsx', /, Badge/g, '');

// ./src/components/home/NewsletterSection.tsx
replaceInFile('./src/components/home/NewsletterSection.tsx', /won't/g, 'won&apos;t');

// ./src/components/home/TestimonialsSection.tsx
replaceInFile('./src/components/home/TestimonialsSection.tsx', /"This platform/g, '&quot;This platform');
replaceInFile('./src/components/home/TestimonialsSection.tsx', /game!"/g, 'game!&quot;');
replaceInFile('./src/components/home/TestimonialsSection.tsx', /"The community/g, '&quot;The community');
replaceInFile('./src/components/home/TestimonialsSection.tsx', /reality."/g, 'reality.&quot;');

// ./src/components/ideas/IdeaCard.tsx
replaceInFile('./src/components/ideas/IdeaCard.tsx', /index,/g, '/* index, */');

console.log("Done");
