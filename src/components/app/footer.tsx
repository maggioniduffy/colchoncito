export default function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-5 text-xs text-muted-foreground">
        <p>Colchoncito · hecho en Argentina 🇦🇷 · @maggioniduffy</p>
        <div className="flex gap-4">
          <a
            href="https://www.linkedin.com/in/maggioniduffy/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            LinkedIn
          </a>
          <span className="text-border">·</span>

          <a
            href="https://maggioniduffy.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            Portfolio
          </a>
        </div>
      </div>
    </footer>
  );
}
