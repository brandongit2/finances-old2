# Finances

<p align="center"><b>A personal finance tracker.</b></p>
<p align="center">Built with <a href="https://remix.run/">Remix</a> and <a href="https://tailwindcss.com/">Tailwind CSS</a>, deployed on <a href="https://www.netlify.com/">Netlify</a> and <a href="https://supabase.com/">Supabase</a>!</p>
<p fontsize="10px" align="center">https://finances.brandontsang.net/</p>

_(Screenshots coming soon)_

## Dev set-up

> Please note that these instructions are written for macOS users. If you're on a different OS, feel free to adapt the steps for yourself. (And maybe submit a PR with the amended instructions!)

Prerequisites: [Git](https://git-scm.com/), [Yarn](https://yarnpkg.com/), Supabase CLI.

<details>
  <summary>How to install the Supabase CLI</summary>

  <p>Simple! just run the following command if you have [Brew](https://brew.sh/) installed:</p>

```bash
brew install supabase/tap/supabase
```

---

</details>

1. Close the Git repository:

   ```bash
   git clone git@github.com:brandongit2/finances.git
   ```

1. Install the required packages:

   ```bash
   yarn
   ```

1. Set your environment variables:

   1. Make a copy of .env.example:

      ```bash
      cp .env.example .env
      ```

   1. Populate the new .env file with values of your own.

1. Set up the database:

   1. Start a local Postgres database with Supabase:

      ```bash
      supabase start
      ```

   1. Push the Prisma schema to the database:

      ```bash
      yarn prisma db push
      ```

   1. Seed the database:

      ```bash
      yarn prisma db seed
      ```

1. Start the local dev server:

   ```bash
   yarn start:dev
   ```

And that's it! The site will be up at http://localhost:3000.
