export const metadata = {
  title: "Workbook Generator | Youth Ministry Edition",
  description: "AI-powered workbook generator for youth ministry",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
