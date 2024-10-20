import { createContext } from "react";
import { Company, Location, Asset, Component } from "./data-models";
import { ExternalData, FilterOptions } from "./data-type";

export interface DataContextType {
  companies: ExternalData<Company[]>;
  selectedComponent?: Component;
  fetchCompanies: () => Promise<void>;
  fetchCompanyDetails: (companyId: string, shouldOpenNode: boolean) => Promise<void>;
  filterNodes: (filters: FilterOptions) => void
  openNode: (node: Company | Location | Asset) => void;
  closeNode: (node: Company | Location | Asset) => void;
  updateSelectedComponent: (component: Component) => void;
}

const DataCtx = createContext<DataContextType>(
  null as unknown as DataContextType
);

export default DataCtx;
