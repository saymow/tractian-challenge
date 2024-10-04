import { ReactNode, useCallback, useState } from "react";
import api from "../api";
import DataCtx from "./data-context";
import { mapCompanies, mapLocationAssets, mapLocations } from "./data-mappers";
import { Company } from "./data-models";
import { ExternalData } from "./data-type";

const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<ExternalData<Company[]>>({});

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

  return (
    <DataCtx.Provider
      value={{
        companies,
        fetchCompanies,
        fetchCompanyDetails,
      }}
    >
      {children}
    </DataCtx.Provider>
  );
};

export default DataProvider;
