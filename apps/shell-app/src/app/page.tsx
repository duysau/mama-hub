"use client";

import { useAuth } from "@/lib/auth-context";
import { Button, Heading, DataLabel } from "@mamahub/ui";

export default function HomePage() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <DataLabel>Loading workspace...</DataLabel>
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative min-h-svh overflow-hidden bg-background">
        {/* Fragmented Background Decals (Optional organic lines) */}
        <div className="absolute top-10 left-10 w-64 h-64 border-2 border-foreground/10 rounded-none mix-blend-multiply opacity-50" />
        <div className="absolute bottom-20 right-[-50px] w-[30vw] h-[30vw] border-2 border-secondary rounded-none mix-blend-multiply opacity-20 rotate-12" />

        <div className="relative z-10 flex flex-col p-6 md:p-12 max-w-7xl mx-auto h-full min-h-svh">
          <header className="flex justify-between items-start mb-16 md:mb-24 mt-4">
            <div className="flex items-baseline gap-1 relative">
              <Heading
                variant="h2"
                className="text-foreground tracking-tighter"
              >
                MH.
              </Heading>
              <div className="h-2 w-2 bg-destructive ml-1" />
            </div>

            <div className="flex flex-col items-end gap-2">
              <DataLabel className="font-bold text-foreground">
                IDENT: {user.name.toUpperCase()}
              </DataLabel>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-muted-foreground border-transparent hover:border-foreground rounded-none shadow-none h-auto p-1"
              >
                Disconnect
              </Button>
            </div>
          </header>

          {/* Fragmented Depth Dashboard */}
          <div className="flex-1 relative w-full h-full pb-20">
            <Heading
              variant="h1"
              className="absolute top-0 left-0 md:text-8xl lg:text-[10rem] opacity-5 -z-10 leading-none"
            >
              CONTROL.
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-12 md:mt-32">
              {/* Finance App Card - Fragmented Left */}
              <a
                href="/finance"
                className="group md:col-start-1 md:col-span-5 bg-card border-2 border-foreground p-8 md:p-10 shadow-hard hover:active-translate transition-all block relative z-20 cursor-pointer"
              >
                <div className="absolute top-0 right-0 p-4 border-b-2 border-l-2 border-foreground bg-primary text-primary-foreground font-mono text-xs font-bold w-12 h-12 flex items-center justify-center">
                  01
                </div>
                <Heading variant="h3" className="mb-4 mt-6">
                  CAPITAL_
                </Heading>
                <DataLabel className="text-foreground/80 max-w-[80%] font-medium">
                  Family treasury, strict budgeting, and real-time expense
                  oversight.
                </DataLabel>

                <div className="mt-12 w-12 h-12 rounded-full border-2 border-foreground flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                  <span className="font-serif">↓</span>
                </div>
              </a>

              {/* Baby App Card - Fragmented Right, Neg Margin */}
              <a
                href="/baby"
                className="group md:col-start-6 md:col-span-6 md:-mt-16 bg-secondary border-2 border-foreground p-8 md:p-10 shadow-hard hover:active-translate transition-all block relative z-30 cursor-pointer"
              >
                <div className="absolute top-0 left-0 p-4 border-b-2 border-r-2 border-foreground bg-destructive text-destructive-foreground font-mono text-xs font-bold w-12 h-12 flex items-center justify-center">
                  02
                </div>
                <Heading variant="h3" className="mb-4 mt-6 text-foreground">
                  NURTURE_
                </Heading>
                <DataLabel className="text-foreground/90 max-w-[80%] font-medium">
                  Logistical management of feeding schedules, sleep intervals,
                  and medical tracking.
                </DataLabel>

                <div className="mt-12 w-12 h-12 rounded-full border-2 border-foreground flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                  <span className="font-serif">↓</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-svh bg-background overflow-hidden flex items-center justify-center">
      {/* Background typographical artifact */}
      <Heading
        variant="h1"
        className="absolute -top-10 -left-10 text-[20vw] opacity-5 pointer-events-none leading-none"
      >
        MAMA.
      </Heading>

      <div className="w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col md:flex-row relative z-10 items-center">
        {/* Asymmetric left column */}
        <div className="w-full md:w-[60%] lg:w-[70%] text-left pr-4 mb-16 md:mb-0">
          <div className="h-4 w-12 bg-destructive mb-8 border-2 border-foreground shadow-hard-sm" />
          <Heading variant="h1" className="mb-8 leading-[1.1]">
            FAMILY
            <br />
            LOGISTICS
            <br />
            ENGINE.
          </Heading>
          <DataLabel className="max-w-md text-foreground/80 font-medium">
            Overthrow the chaos of personal finance and baby scheduling. MamaHub
            relies on absolute precision architecture.
          </DataLabel>
        </div>

        {/* Fragmented Overlapping Right Login Box */}
        <div className="w-full md:w-[45%] md:absolute md:right-8 lg:right-16 md:-mr-12 bg-card border-2 border-foreground p-8 shadow-hard z-20 hover:active-translate transition-all">
          <Heading
            variant="h4"
            className="mb-6 uppercase tracking-widest text-sm border-b-2 border-foreground pb-4"
          >
            Access Portal
          </Heading>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              login(formData.get("email") as string);
            }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2 relative">
              <label
                htmlFor="email"
                className="font-sans text-xs font-bold uppercase tracking-wider text-foreground"
              >
                Operator Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="system@mamahub.local"
                required
                className="h-12 w-full border-2 border-foreground bg-background px-4 font-mono text-sm shadow-hard-sm focus-visible:outline-none focus:translate-y-[2px] focus:translate-x-[2px] focus:shadow-none transition-all rounded-none"
                defaultValue="demo@mamahub.com"
              />
            </div>

            <div className="flex flex-col gap-2 relative">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="font-sans text-xs font-bold uppercase tracking-wider text-foreground"
                >
                  Passphrase
                </label>
                <a
                  href="#"
                  className="text-xs font-serif italic text-muted-foreground hover:text-foreground"
                >
                  Lost Access?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="h-12 w-full border-2 border-foreground bg-background px-4 font-mono text-sm shadow-hard-sm focus-visible:outline-none focus:translate-y-[2px] focus:translate-x-[2px] focus:shadow-none transition-all rounded-none"
                defaultValue="password"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 mt-4 uppercase tracking-widest text-sm border-2 border-foreground"
            >
              Initialize
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
