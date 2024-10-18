import { Company, Location, Component } from "../../data/data-models";
import { ExternalData } from "../../data/data-type";
import TreeItem from "./tree-item";
import "./styles.scss";

interface Props {
  companies: ExternalData<Company[]>;
  onCompanyClick: (companyId: string) => void;
  onComponentClick: (component: Component) => void;
}

const Tree: React.FC<Props> = (props) => {
  const { companies, onCompanyClick, onComponentClick } = props;

  const handleNodeClick = (node: Company | Location) => {
    if (node instanceof Company) {
      onCompanyClick(node.id);
    } else if (node instanceof Component) {
      onComponentClick(node);
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
