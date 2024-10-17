import { createContext } from "react";
import { Company, Component } from "./data-models";
import { ExternalData } from "./data-type";

export interface DataContextType {
  companies: ExternalData<Company[]>;
  selectedComponent?: Component;
  fetchCompanies: () => Promise<void>;
  fetchCompanyDetails: (companyId: string) => Promise<void>;
  updateSelectedComponent: (component: Component) => void;
}

const DataCtx = createContext<DataContextType>(
  null as unknown as DataContextType
);

export default DataCtx;
