This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Prerequisites

Node.js (v18+ recommended)

Docker (for containerized deployment)

## Setting up environment variables

A .env.local file has been provided as a template in the code.

The actual environment variables will be shared via email.

Copy the template and fill in the necessary values

## Running Locally

git clone https://github.com/ayzahamid/wedding-planner.git


Install Packages

```bash
  yarn install
```

Run migrations
```bash
  npx drizzle-kit migrate
```


First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Running with docker

```bash
docker-compose -f docker-compose-local-dev.yml up
```

## Technologies

Next.js: Server-side rendering and frontend framework.

Supabase: Authentication, database, and storage.

Drizzle ORM: Database schema management and optimized queries.

TailwindCSS: Responsive UI design.

Docker: Containerized deployment.

Lucide Icons: UI enhancements with icons.
