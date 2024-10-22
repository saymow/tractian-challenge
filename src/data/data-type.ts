export interface ExternalData<T> {
  data?: T;
  isLoading?: boolean;
  success?: boolean;
  error?: {
    message: string;
  };
}

export interface FilterOptions {
  searchText: string;
  energySensors?: boolean; 
  criticalSensors?: boolean; 
}
