import { ReactNode, useCallback, useState } from "react";
import api from "../api";
import DataCtx from "./data-context";
import { mapCompanies, mapLocationAssets, mapLocations } from "./data-mappers";
import { Asset, Company, Location, Component, Node } from "./data-models";
import { ExternalData } from "./data-type";

const dfs = (path: Array<Node>, current: Node, target: Node) => {
  if (current instanceof Component) return false;
  if (current === target) return true;

  const children: Node[] = [];

  if (current instanceof Company) {
    children.push(...(current.locations ?? []));
  } else if (current instanceof Location) {
    children.push(...(current.children ?? []));
    children.push(...(current.assets ?? []));
  } else {
    children.push(...(current.children ?? []));
  }

  for (const child of children) {
    path.push(child);
    if (dfs(path, child, target)) return true;
    path.pop();
  }

  return false;
};

const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<ExternalData<Company[]>>({});
  const [selectedComponent, setSelectedComponent] = useState<Component>();

  const fetchCompanies = useCallback(async () => {
    try {
      setCompanies({ isLoading: true });
      const response = await api.get("/companies");
      setCompanies({ success: true, data: mapCompanies(response.data) });
    } catch (err: any) {
      setCompanies({ error: { message: err.message } });
    }
  }, []);

  const fetchCompanyDetails = useCallback(async (companyId: string) => {
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
  }, []);

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

  return (
    <DataCtx.Provider
      value={{
        companies,
        selectedComponent,
        fetchCompanies,
        fetchCompanyDetails,
        updateSelectedComponent,
        openNode,
        closeNode,
      }}
    >
      {children}
    </DataCtx.Provider>
  );
};

export default DataProvider;
