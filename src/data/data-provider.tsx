import { ReactNode, useCallback, useState } from "react";
import api from "../api";
import DataCtx from "./data-context";
import { mapCompanies, mapLocationAssets, mapLocations } from "./data-mappers";
import { Company, Component } from "./data-models";
import { ExternalData } from "./data-type";

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

  return (
    <DataCtx.Provider
      value={{
        companies,
        selectedComponent,
        fetchCompanies,
        fetchCompanyDetails,
        updateSelectedComponent,
      }}
    >
      {children}
    </DataCtx.Provider>
  );
};

export default DataProvider;
