import { ReactNode, useCallback, useState } from "react";
import api from "../api";
import DataCtx from "./data-context";
import { mapCompanies, mapLocationAssets, mapLocations } from "./data-mappers";
import { Asset, Company, Location, Component } from "./data-models";
import { ExternalData, FilterOptions } from "./data-type";
import { filter } from "./data-helpers";

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

  const toggleNode = useCallback(
    (node: Company | Location | Asset, isOpen: boolean) => {
      node.isOpen = isOpen;
      setCompanies((prev) => ({ ...prev }));
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
