import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import OffCanvas from "../Components/OffCanvas";
import Frame from "../Components/Frame";
import { AuthContext } from "../contexts/AuthContext";

const Layout = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      {isAuthenticated ? (
        <>
          <Navbar />
          <OffCanvas />

          <Frame>
            <Outlet />
          </Frame>
        </>
      ) : (
        <Outlet />
      )}
      ``
    </>
  );
};

export default Layout;
