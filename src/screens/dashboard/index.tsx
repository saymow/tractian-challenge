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
import Button from "../../components/button";
import EnergyIcon from "../../components/icons/Energy";
import AlertIcon from "../../components/icons/Alert";
import { FilterOptions } from "../../data/data-type";
import { areFiltersApplied } from "../../data/data-helpers";

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
  const [filters, setFilters] = useState<FilterOptions>({
    searchText: "",
    energySensors: false,
    criticalSensors: false,
  });
  const debouncedFilterNodes = useMemo(
    () => debounce((filters: FilterOptions) => filterNodes(filters), 1000),
    [filterNodes]
  );

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    debouncedFilterNodes(filters);
  }, [debouncedFilterNodes, filters]);

  const handleNodeClick = useCallback(
    (node: Node) => {
      if (node instanceof Component) {
        updateSelectedComponent(node);
      } else if (node instanceof Company && !node.locations) {
        fetchCompanyDetails(node.id, true);
      } else {
        if (areFiltersApplied(filters)) return;

        if (node.isOpen) closeNode(node);
        else openNode(node);
      }
    },
    [closeNode, fetchCompanyDetails, filters, openNode, updateSelectedComponent]
  );

  const handleSearchText = (searchText: string) => {
    setFilters((prev) => ({ ...prev, searchText }));
  };

  const handleToggleEnergySensorsFilter = () => {
    setFilters((prev) => ({ ...prev, energySensors: !prev.energySensors }));
  };

  const handleToggleCriticalSensorsFilter = () => {
    setFilters((prev) => ({ ...prev, criticalSensors: !prev.criticalSensors }));
  };

  return (
    <Panel
      className="dashboard-container"
      header={{
        title: "Ativos",
        subTitle: "Apex Unit",
        commandElement: (
          <>
            <Button
              Icon={EnergyIcon}
              text="Sensor de Energia"
              active={filters.energySensors}
              onClick={handleToggleEnergySensorsFilter}
            />
            <Button
              Icon={AlertIcon}
              text="Crítico"
              active={filters.criticalSensors}
              onClick={handleToggleCriticalSensorsFilter}
            />
          </>
        ),
      }}
    >
      <section>
        <Card className="visualization-container">
          <SearchBar
            value={filters.searchText}
            onChange={handleSearchText}
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
      </section>
    </Panel>
  );
};

export default Dashboard;
