import React from "react";
import "./styles.scss";

export interface Props {
  title: string;
  subTitle: string;
  commandElement: React.ReactNode;
}

const DashboardHeader: React.FC<Props> = (props) => {
  const { title, subTitle, commandElement } = props;

  return (
    <header className="dashboard-header">
      <section>
        <h1>{title}</h1>
        <h5>{"/ "}{subTitle}</h5>
      </section>
      <section>{commandElement}</section>
    </header>
  );
};

export default DashboardHeader;
