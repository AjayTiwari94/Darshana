export default function ConfirmationTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  // Simple template without page transition animation to prevent double animation
  return <div>{children}</div>
}