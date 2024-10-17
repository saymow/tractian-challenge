import { useEffect } from "react";
import Card from "../../components/card";
import Tree from "../../components/tree";
import useData from "../../data/use-data";
import "./styles.scss";

const Dashboard: React.FC = () => {
  const {
    companies,
    fetchCompanies,
    fetchCompanyDetails,
    updateSelectedComponent,
  } = useData();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <main className="dashboard-container">
      <Card>
        <Tree
          companies={companies}
          onComponentClick={updateSelectedComponent}
          onCompanyClick={fetchCompanyDetails}
        />
      </Card>
      <Card>
        <p>todo</p>
      </Card>
    </main>
  );
};

export default Dashboard;
