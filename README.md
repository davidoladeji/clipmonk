# ClipMonk

**Open source AI-powered video clipping and social media management platform.**

ClipMonk turns long-form videos into viral short-form clips, adds AI captions and face tracking, and publishes to every social platform from a single dashboard.

## Features

### Video Clipping Engine
- **AI Auto-Curation** — Scores every moment for virality and suggests the best clips
- **Smart Face Tracking** — Auto-centers faces when converting to vertical (9:16) format
- **Auto Captioning** — Speech-to-text in 30+ languages with multiple styles (Bold, Karaoke, Typewriter, Minimal)
- **Caption Translation** — Translate captions while preserving original audio
- **Hook & CTA Generator** — AI-generated scroll-stopping hooks
- **Multiple Aspect Ratios** — 9:16, 1:1, 16:9, 4:5

### Social Media Management
- **7+ Platform Support** — YouTube, TikTok, Instagram, Facebook, LinkedIn, X/Twitter, Pinterest
- **Multi-Account Management** — Connect unlimited accounts per platform
- **Post Composer** — Rich editor with media, hashtags, mentions, and link previews
- **Smart Scheduling** — AI-powered optimal timing with calendar view
- **Bulk Publishing** — Post to multiple accounts simultaneously
- **Campaign Management** — Organize content into campaigns

### AI Studio
- **Multi-Provider AI** — OpenAI GPT-4o, Claude, Gemini, and more
- **Content Templates** — Pre-built prompts for hooks, captions, descriptions, ad copy
- **Tone & Language Control** — Generate in any tone across 30+ languages
- **Auto Hashtag Generation** — AI-powered trending hashtag suggestions

### Team & Collaboration
- **Team Workspaces** — Invite members with role-based access
- **Permission Roles** — Owner, Editor, Publisher, Viewer
- **Shared Media Library** — Cloud storage with Google Drive, Dropbox, OneDrive, S3
- **Activity Tracking** — See who did what and when

### Analytics Dashboard
- **Cross-Platform Metrics** — Unified views, likes, shares, followers
- **Platform Breakdown** — Per-network engagement and growth rates
- **Top Performing Content** — Ranked clips with engagement data
- **Best Posting Times** — AI-recommended scheduling windows
- **Export Reports** — Download analytics as CSV/PDF

### Additional Features
- RSS Feed Automation
- URL Shortening (Bitly, TinyURL, Rebrandly)
- Watermarking
- Cloud Storage Integration
- Webhook & API Access
- Self-Hostable

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Design:** Custom dark theme with Syne + Plus Jakarta Sans typography
- **License:** MIT

## Getting Started

```bash
# Clone the repo
git clone https://github.com/davidoladeji/clipmonk.git
cd clipmonk

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
clipmonk/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Entry point
│   │   └── globals.css         # Tailwind imports
│   ├── components/
│   │   └── ClipMonkApp.tsx     # Main application component
│   └── lib/                    # Utilities (coming soon)
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Roadmap

- [ ] Backend API (Node.js / Python)
- [ ] Database schema (PostgreSQL)
- [ ] YouTube/Twitch video download integration
- [ ] FFmpeg video processing pipeline
- [ ] Whisper-based speech-to-text
- [ ] Face detection with MediaPipe
- [ ] OAuth2 social platform connections
- [ ] Stripe billing integration
- [ ] Real-time notifications (WebSocket)
- [ ] Mobile responsive views
- [ ] Docker deployment
- [ ] Self-host documentation

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License — see [LICENSE](LICENSE) for details.
