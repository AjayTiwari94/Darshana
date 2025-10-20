export default function ConfirmationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Simple layout without page transition animation to prevent double animation
  return <div className="min-h-screen">{children}</div>
}