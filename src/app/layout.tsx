import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/global.css"; // Impor Tailwind CSS

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}