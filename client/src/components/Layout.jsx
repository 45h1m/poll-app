import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import ModalProvider from "../contexts/ModalContext";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "./Footer";

const Layout = () => {
  const {pathname} = useLocation();
    return (
        <div>
            <ModalProvider>
                <Header />
                {pathname !== "/home" && <Breadcrumbs/>}
                <div className="min-h-[80vh] bg-gray-100">
                  <Outlet />
                </div>
                <Footer/>
            </ModalProvider>
        </div>
    );
};

export default Layout;
