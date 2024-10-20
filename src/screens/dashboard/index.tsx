import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "../../components/card";
import ComponentView from "../../components/component-view";
import Panel from "../../components/panel";
import SearchBar from "../../components/search-bar";
import Tree from "../../components/tree";
import { Company, Component, Node } from "../../data/data-models";
import useData from "../../data/use-data";
import "./styles.scss";

const Dashboard: React.FC = () => {
  const {
    companies,
    selectedComponent,
    fetchCompanies,
    fetchCompanyDetails,
    openNode,
    closeNode,
    filterNodes,
    updateSelectedComponent,
  } = useData();
  const [searchText, setSearchText] = useState("");
  const debouncedFilterNodes = useMemo(
    () => debounce((searchText: string) => filterNodes({ searchText }), 1000),
    [filterNodes]
  );

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    debouncedFilterNodes(searchText);
  }, [debouncedFilterNodes, searchText]);

  const handleNodeClick = useCallback(
    (node: Node) => {
      if (node instanceof Component) {
        updateSelectedComponent(node);
      } else if (node instanceof Company && !node.locations) {
        fetchCompanyDetails(node.id, true);
      } else {
        if (node.isOpen) {
          closeNode(node);
        } else {
          openNode(node);
        }
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
