export interface ExternalData<T> {
  data?: T;
  isLoading?: boolean;
  success?: boolean;
  error?: {
    message: string;
  };
}
