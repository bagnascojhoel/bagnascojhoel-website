This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Extra portfolio descriptions

- The site supports optional `.portfolio-description.json` files in individual GitHub repositories to provide richer metadata for projects (custom title, tags, website, complexity, etc.).
- See `.ai/features/github-extra-descriptions/SCHEMA.md` for the schema and examples.

## To Do's

- Certifications and articles should be retrieved dynamically without needing a redeploy.
- Certifications should have a link to the certification badge/certificate.
- Should localize the action labels for certifications and articles.
- Use the startsOpen flag from portfolio-description.json.
- Introduce a ignore flag on portfolio-description.json that makes the project ignored.
- Update project README.
- Localization in PT-BR of projects.
- Add google analytics or similar to track accesses.
- Links from articles should take to the actual article.
- The ADRs are beign generated too verbosely. And other files, besides the ADR, were created.
- The implementation plans are not being split amongst files.
