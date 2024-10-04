import { createContext } from "react";
import { Company } from "./data-models";
import { ExternalData } from "./data-type";

export interface DataContextType {
  companies: ExternalData<Company[]>;
  fetchCompanies: () => Promise<void>;
  fetchCompanyDetails: (companyId: string) => Promise<void>;
}

const DataCtx = createContext<DataContextType>(
  null as unknown as DataContextType
);

export default DataCtx;
