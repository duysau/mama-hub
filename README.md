# MamaHub

MamaHub is a personal family management web application built with a Micro Frontend (MFE) architecture. It helps families manage finances, baby care schedules, and more in a unified interface with real-time synchronization and offline support.

## 🏗 Architecture

The project uses **Next.js Multi-Zones** within a **Turborepo** monorepo:

- **Shell App (`apps/shell-app`)**: The main entry point and orchestrator. Handles authentication and routing to other micro-apps. Runs on `http://localhost:3000`.
- **Finance App (`apps/finance-app`)**: Handles family budget, expenses, and savings. Accessed via `/finance`. Runs on `http://localhost:3002`.
- **Baby App (`apps/baby-app`)**: Tracks feeding, sleep, and medical records for babies. Accessed via `/baby`. Runs on `http://localhost:3001`.
- **Shared UI (`packages/ui`)**: A shared component library using Tailwind CSS v4 and designed principles from Shadcn UI.
- **Shared Config (`packages/config`)**: Centralized ESLint and TypeScript configurations.

## 🛠 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Monorepo Tool**: [Turborepo](https://turbo.build/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Real-time**: [Socket.io](https://socket.io/) (via Shell App) + [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
- **Offline/PWA**: [@ducanh2912/next-pwa](https://github.com/ducanh2912/next-pwa) + [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (via `idb-keyval`)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
pnpm install
```

### Development

Start all applications in development mode:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`. Next.js rewrites are configured to proxy `/finance` to the Finance App and `/baby` to the Baby App.

### Build

To create a production build for all apps:

```bash
pnpm build
```

## 📂 Project Structure

```text
.
├── apps/
│   ├── shell-app/      # Main entry & Auth
│   ├── finance-app/    # Finance micro-app
│   └── baby-app/       # Baby care micro-app
├── packages/
│   ├── ui/             # Shared React components & Tailwind styles
│   └── config/         # Shared ESLint & TS configs
├── docs/               # Architecture & Project plans
├── package.json
└── turbo.json
```
