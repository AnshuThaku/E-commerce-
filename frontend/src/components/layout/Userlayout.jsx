import Header from "../common/Header";
import Footer from "../common/Footer";
import { Outlet } from "react-router-dom";
export default function Userlayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
