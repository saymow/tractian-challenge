import { useCallback, useEffect, useState } from "react";
import Card from "../../components/card";
import Tree from "../../components/tree";
import useData from "../../data/use-data";
import "./styles.scss";
import ComponentView from "../../components/component-view";
import Panel from "../../components/panel";
import SearchBar from "../../components/search-bar";
import { Company, Component, Node } from "../../data/data-models";

const Dashboard: React.FC = () => {
  const {
    companies,
    selectedComponent,
    fetchCompanies,
    fetchCompanyDetails,
    updateSelectedComponent,
    openNode,
    closeNode,
  } = useData();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleNodeClick = useCallback(
    (node: Node) => {
      if (node instanceof Component) {
        updateSelectedComponent(node);
      } else if (node instanceof Company && !node.locations) {
        fetchCompanyDetails(node.id);
      } else {
        if (node.isOpen) closeNode(node);
        else openNode(node);
      }
    },
    [closeNode, fetchCompanyDetails, openNode, updateSelectedComponent]
  );

  return (
    <Panel className="dashboard-container">
      <Card className="visualization-container">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Buscar Ativo ou Local"
        />
        <Tree
          companies={companies}
          onNodeClick={handleNodeClick}
          className="visualization"
        />
      </Card>
      <Card>
        {selectedComponent && <ComponentView component={selectedComponent} />}
      </Card>
    </Panel>
  );
};

export default Dashboard;
