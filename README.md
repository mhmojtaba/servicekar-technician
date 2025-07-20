This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

{
"name": "technician",
"version": "0.1.0",
"private": true,
"scripts": {
"dev": "next dev --turbopack",
"build": "next build",
"start": "next start",
"lint": "next lint"
},
"dependencies": {
"@emotion/react": "^11.14.0",
"@emotion/styled": "^11.14.0",
"@headlessui/react": "^2.2.0",
"@heroicons/react": "^2.2.0",
"@heroui/react": "^2.7.9",
"@mui/icons-material": "^7.0.1",
"@mui/material": "^7.0.1",
"@react-leaflet/core": "^3.0.0",
"@sweetalert2/theme-material-ui": "^5.0.27",
"@tanstack/react-query": "^5.71.0",
"@zxing/library": "^0.21.3",
"axios": "^1.8.4",
"chart.js": "^4.4.9",
"class-variance-authority": "^0.7.1",
"clsx": "^2.1.1",
"dayjs": "^1.11.13",
"file-saver": "^2.0.5",
"framer-motion": "^12.6.3",
"leaflet": "^1.9.4",
"leaflet-defaulticon-compatibility": "^0.1.2",
"leaflet-draw": "^1.0.4",
"lucide-react": "^0.486.0",
"next": "15.1.4",
"react": "^19.0.0",
"react-chartjs-2": "^5.3.0",
"react-dom": "^19.0.0",
"react-icons": "^5.5.0",
"react-leaflet": "^5.0.0",
"react-media-devices": "^1.2.1",
"react-multi-date-picker": "^4.5.2",
"react-select": "^5.10.1",
"react-signature-canvas": "^1.1.0-alpha.2",
"react-spinners": "^0.15.0",
"react-to-pdf": "^2.0.0",
"react-toastify": "^11.0.5",
"recharts": "^2.15.3",
"sweetalert2": "^11.17.2",
"sweetalert2-react-content": "^5.1.0",
"tailwind-hamburgers": "^1.3.5",
"tailwind-merge": "^3.1.0",
"tailwind-scrollbar": "^3.1.0",
"tailwindcss-animate": "^1.0.7",
"xlsx": "^0.18.5"
},
"devDependencies": {
"autoprefixer": "^10.4.21",
"postcss": "^8",
"prettier": "^3.5.3",
"prettier-plugin-tailwindcss": "^0.6.11",
"tailwindcss": "^3.4.1"
}
}
