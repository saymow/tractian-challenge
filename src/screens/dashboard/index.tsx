import { useEffect } from "react";
import useData from "../../data/use-data";
import Card from "../../components/card";
import "./styles.scss";
import Tree from "../../components/tree";

const Dashboard: React.FC = () => {
  const {
    companies,
    fetchCompanies,
    fetchCompanyDetails: fetchCompaniesLocations,
  } = useData();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleCompanyClick = (companyId: string) => {
    fetchCompaniesLocations(companyId);
  };

  return (
    <main className="dashboard-container">
      <Card>
        <Tree companies={companies} onCompanyClick={handleCompanyClick} />
      </Card>
      <Card>
        <p>todo</p>
      </Card>
    </main>
  );
};

export default Dashboard;
