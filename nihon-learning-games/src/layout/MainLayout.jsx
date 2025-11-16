import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export default function MainLayout() {
  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        {/* This is where each page will render/populate */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

/* <Outlet /> is a special component from React Router.
It acts like a placeholder where nested routes will render.

Think of it like this:

Your layout (header + footer) stays the same on all pages.

Your page content changes depending on the route.

<Outlet /> marks where that page content should appear. */
