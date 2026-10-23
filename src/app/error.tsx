'use client';
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="workspace"><section className="panel form-stack"><h1>We could not load this page.</h1><p>Please try again in a moment. Your saved information has not been changed.</p><button className="primary-button" onClick={reset}>Try again</button></section></div>;
}