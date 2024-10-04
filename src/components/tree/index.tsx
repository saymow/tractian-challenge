import { Company } from "../../data/data-models";
import { ExternalData } from "../../data/data-type";
import TreeItem from "./tree-item";
import "./styles.scss";

interface Props {
  companies: ExternalData<Company[]>;
  onCompanyClick: (companyId: string) => void;
}

const Tree: React.FC<Props> = (props) => {
  const { companies, onCompanyClick } = props;

  const handleNodeClick = (node: Company | Location) => {
    if (node instanceof Company) {
      onCompanyClick(node.id);
    }
  };

  return (
    <ul className="tree-container">
      {companies.data?.map((company) => (
        <TreeItem
          key={company.id}
          item={company}
          onClick={handleNodeClick}
        ></TreeItem>
      ))}
    </ul>
  );
};

export default Tree;
