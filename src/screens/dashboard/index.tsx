import { useEffect, useState } from "react";
import Card from "../../components/card";
import Tree from "../../components/tree";
import useData from "../../data/use-data";
import "./styles.scss";
import ComponentView from "../../components/component-view";
import Panel from "../../components/panel";
import SearchBar from "../../components/search-bar";

const Dashboard: React.FC = () => {
  const {
    companies,
    selectedComponent,
    fetchCompanies,
    fetchCompanyDetails,
    updateSelectedComponent,
  } = useData();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <Panel className="dashboard-container">
      <Card className="tree-container">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Buscar Ativo ou Local"
        />
        <Tree
          companies={companies}
          onComponentClick={updateSelectedComponent}
          onCompanyClick={fetchCompanyDetails}
          className="tree"
        />
      </Card>
      <Card>
        {selectedComponent && <ComponentView component={selectedComponent} />}
      </Card>
    </Panel>
  );
};

export default Dashboard;
