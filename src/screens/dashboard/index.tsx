import { useEffect } from "react";
import Card from "../../components/card";
import Tree from "../../components/tree";
import useData from "../../data/use-data";
import "./styles.scss";
import ComponentView from "../../components/component-view";
import Panel from "../../components/panel";

const Dashboard: React.FC = () => {
  const {
    companies,
    selectedComponent,
    fetchCompanies,
    fetchCompanyDetails,
    updateSelectedComponent,
  } = useData();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <Panel className="dashboard-container">
      <Card className="tree-container">
        <Tree
          companies={companies}
          onComponentClick={updateSelectedComponent}
          onCompanyClick={fetchCompanyDetails}
        />
      </Card>
      <Card>
        {selectedComponent && <ComponentView component={selectedComponent} />}
      </Card>
    </Panel>
  );
};

export default Dashboard;
