import { ReactNode, useCallback, useState } from "react";
import api from "../api";
import DataCtx from "./data-context";
import { mapCompanies, mapLocationAssets, mapLocations } from "./data-mappers";
import { Asset, Company, Location, Component, Node } from "./data-models";
import { ExternalData, FilterOptions } from "./data-type";
import { dfs, filter } from "./data-helpers";

const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<ExternalData<Company[]>>({});
  const [selectedComponent, setSelectedComponent] = useState<Component>();

  const fetchCompanyDetails = useCallback(
    async (companyId: string, shouldOpenNode: boolean) => {
      const [locationsResponse, assetsResponse] = await Promise.all([
        api.get(`/companies/${companyId}/locations`),
        api.get(`/companies/${companyId}/assets`),
      ]);
      const locationsWithAssets = mapLocationAssets(
        mapLocations(locationsResponse.data),
        assetsResponse.data
      );

      setCompanies((prev) => {
        const company = prev.data!.find((item) => item.id === companyId)!;
        const newCompany: Company = new Company(
          company.id,
          company.name,
          shouldOpenNode,
          true,
          locationsWithAssets
        );

        return {
          ...prev,
          data: prev.data!.map((item) =>
            item.id === companyId ? newCompany : item
          ),
        };
      });
    },
    []
  );

  const fetchCompanies = useCallback(async () => {
    try {
      setCompanies({ isLoading: true });

      const response = await api.get("/companies");
      const newCompanies = mapCompanies(response.data);

      setCompanies({ success: true, data: newCompanies });

      await Promise.all(
        newCompanies.map((company) => fetchCompanyDetails(company.id, false))
      );
    } catch (err: any) {
      setCompanies({ error: { message: err.message } });
    }
  }, [fetchCompanyDetails]);

  const updateSelectedComponent = useCallback(
    (component: Component) => {
      if (selectedComponent?.id === component.id) {
        component.selected = false;
        setCompanies((prev) => ({ ...prev }));
        setSelectedComponent(undefined);
        return;
      }

      if (selectedComponent) selectedComponent.selected = false;
      component.selected = true;
      setCompanies((prev) => ({ ...prev }));
      setSelectedComponent(component);
    },
    [selectedComponent, setSelectedComponent]
  );

  /**
   * Efficiently open or close a node.
   *
   * Node's children are rendered only if their array is updated. This improves
   * perfomance, by no re-rendering the entire tree unnecessarily. This helper ensure
   * that only the ancestors of "node" have their children updated - and therefore updated.
   */
  const toggleNode = useCallback(
    (node: Company | Location | Asset, isOpen: boolean) => {
      setCompanies((prev) => {
        const path: Node[] = [];

        for (const company of prev.data!) {
          path.push(company);
          if (!dfs(path, company, node)) path.pop();
        }

        // The last node is the node we are toggling, no need to update its children.
        path.pop();

        while (path.length) {
          const item = path.pop();

          if (item instanceof Company) {
            item.locations = item.locations!.slice();
          } else if (item instanceof Location) {
            if (item.assets) item.assets = item.assets!.slice();
            if (item.children) item.children = item.children!.slice();
          } else if (item instanceof Asset) {
            item.children = item.children!.slice();
          }
        }

        node.isOpen = isOpen;

        return { ...prev, data: prev.data!.slice() };
      });
    },
    []
  );

  const openNode = useCallback(
    (node: Company | Location | Asset) => {
      toggleNode(node, true);
    },
    [toggleNode]
  );

  const closeNode = useCallback(
    (node: Company | Location | Asset) => {
      toggleNode(node, false);
    },
    [toggleNode]
  );

  const filterNodes = useCallback((filters: FilterOptions) => {
    setCompanies((prev) => {
      filter(prev.data ?? [], filters);
      return { ...prev, data: prev.data };
    });
  }, []);

  return (
    <DataCtx.Provider
      value={{
        companies,
        selectedComponent,
        fetchCompanies,
        fetchCompanyDetails,
        filterNodes,
        openNode,
        closeNode,
        updateSelectedComponent,
      }}
    >
      {children}
    </DataCtx.Provider>
  );
};

export default DataProvider;
