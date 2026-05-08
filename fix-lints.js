const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, searchRegex, replaceValue) {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(searchRegex, replaceValue);
    fs.writeFileSync(fullPath, content);
}

// ./src/app/(auth)/auth/login/page.tsx
replaceInFile('./src/app/(auth)/auth/login/page.tsx', /catch \(error: any\)/g, 'catch (error: unknown)');
replaceInFile('./src/app/(auth)/auth/login/page.tsx', /error\.response\?\.data\?\.error/g, '(error as any).response?.data?.error');

// ./src/app/(auth)/layout.tsx
replaceInFile('./src/app/(auth)/layout.tsx', /"The best time to plant a tree was 20 years ago\. The second best time is now\."/g, '&quot;The best time to plant a tree was 20 years ago. The second best time is now.&quot;');

// ./src/app/(dashboard)/dashboard/admin/ideas/page.tsx
replaceInFile('./src/app/(dashboard)/dashboard/admin/ideas/page.tsx', /Clock, /g, '');
replaceInFile('./src/app/(dashboard)/dashboard/admin/ideas/page.tsx', /, Clock/g, '');

// ./src/app/(dashboard)/dashboard/admin/users/page.tsx
replaceInFile('./src/app/(dashboard)/dashboard/admin/users/page.tsx', /Shield, /g, '');
replaceInFile('./src/app/(dashboard)/dashboard/admin/users/page.tsx', /, Shield/g, '');

// ./src/app/(dashboard)/dashboard/page.tsx
replaceInFile('./src/app/(dashboard)/dashboard/page.tsx', /Legend, /g, '');
replaceInFile('./src/app/(dashboard)/dashboard/page.tsx', /, Legend/g, '');

// ./src/app/(dashboard)/dashboard/ideas/new/page.tsx
replaceInFile('./src/app/(dashboard)/dashboard/ideas/new/page.tsx', /const watchIsPaid = watch\("isPaid"\);/g, '// const watchIsPaid = watch("isPaid");');

// ./src/app/(main)/contact/page.tsx
replaceInFile('./src/app/(main)/contact/page.tsx', /We'd/g, 'We&apos;d');
replaceInFile('./src/app/(main)/contact/page.tsx', /Don't/g, 'Don&apos;t');
replaceInFile('./src/app/(main)/contact/page.tsx', /you're/g, 'you&apos;re');
replaceInFile('./src/app/(main)/contact/page.tsx', /Let's/g, 'Let&apos;s');
replaceInFile('./src/app/(main)/contact/page.tsx', /it's/g, 'it&apos;s');
// Contact page line 27 has '
replaceInFile('./src/app/(main)/contact/page.tsx', /"/g, '&quot;'); // wait, need to be careful with quotes. Let's just do single quote replace:
replaceInFile('./src/app/(main)/contact/page.tsx', /Let's/g, 'Let&apos;s'); // already there

// ./src/app/(main)/ideas/page.tsx
replaceInFile('./src/app/(main)/ideas/page.tsx', /Filter, /g, '');
replaceInFile('./src/app/(main)/ideas/page.tsx', /, Filter/g, '');
replaceInFile('./src/app/(main)/ideas/page.tsx', /let's/g, 'let&apos;s');
replaceInFile('./src/app/(main)/ideas/page.tsx', /Don't/g, 'Don&apos;t');

// ./src/app/(main)/ideas/[slug]/page.tsx
replaceInFile('./src/app/(main)/ideas/[slug]/page.tsx', /require\(/g, '// eslint-disable-next-line @typescript-eslint/no-require-imports\nrequire(');

// ./src/components/home/CTASection.tsx
replaceInFile('./src/components/home/CTASection.tsx', /const { ref, inView } = useInView/g, 'const { ref } = useInView');

// ./src/components/home/FeaturedIdeas.tsx
replaceInFile('./src/components/home/FeaturedIdeas.tsx', /import { motion } from "framer-motion";\n/g, '');
replaceInFile('./src/components/home/FeaturedIdeas.tsx', /const { ref, inView } = useInView/g, 'const { ref } = useInView');

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
replaceInFile('./src/components/ideas/IdeaCard.tsx', /import { motion } from "framer-motion";\n/g, '');
replaceInFile('./src/components/ideas/IdeaCard.tsx', /index: number;/g, '// index: number;');

// ./src/components/ideas/PaymentModal.tsx
replaceInFile('./src/components/ideas/PaymentModal.tsx', /const PaymentModal = \({ isOpen, onClose, ideaId/g, 'const PaymentModal = ({ isOpen, /* onClose, */ ideaId');
replaceInFile('./src/components/ideas/PaymentModal.tsx', /onClose,/g, '/* onClose, */');

// ./src/components/ui/input.tsx
replaceInFile('./src/components/ui/input.tsx', /export interface InputProps\n  extends React\.InputHTMLAttributes<HTMLInputElement> {}/g, 'export type InputProps = React.InputHTMLAttributes<HTMLInputElement>');
replaceInFile('./src/components/ui/input.tsx', /export interface InputProps extends React\.InputHTMLAttributes<HTMLInputElement> {}/g, 'export type InputProps = React.InputHTMLAttributes<HTMLInputElement>');

console.log("Done");
