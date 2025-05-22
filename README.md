# Todo Summary Assistant

A full-stack application that allows users to manage their to-do items, generate summaries using an LLM, and send those summaries to a Slack channel.

## Features

- Create, read, update, and delete to-do items
- Generate summaries of pending to-dos using OpenAI
- Send generated summaries to a Slack channel
- Responsive UI built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React with Next.js
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **LLM Integration**: OpenAI
- **Styling**: Tailwind CSS with shadcn/ui components

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Supabase account
- OpenAI API key
- Slack workspace with permission to create webhooks

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
SLACK_WEBHOOK_URL=your_slack_webhook_url
\`\`\`

### Database Setup

1. Create a new Supabase project
2. Create a `todos` table with the following schema:

\`\`\`sql
create table todos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);
\`\`\`

### Slack Webhook Setup

1. Go to your Slack workspace
2. Create a new Slack app (or use an existing one)
3. Enable "Incoming Webhooks" feature
4. Create a new webhook URL for a specific channel
5. Copy the webhook URL to your `.env.local` file

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application can be deployed to Vercel with minimal configuration:

1. Push your code to a GitHub repository
2. Import the repository to Vercel
3. Configure the environment variables in the Vercel dashboard
4. Deploy

## License

MIT
"# todo-summary-assistant" 
"# todo-summary-assistant" 
