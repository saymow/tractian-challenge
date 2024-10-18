import React from "react";
import "./styles.scss";
import Header from "../header";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = (props) => {
  return (
    <main className="layout">
      <Header />
      <div className="layout-content">{props.children}</div>
    </main>
  );
};

export default Layout;
