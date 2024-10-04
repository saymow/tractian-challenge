import { useContext } from "react";
import DataCtx, { DataContextType } from "./data-context";

export default function useData(): DataContextType {
  return useContext(DataCtx);
}
