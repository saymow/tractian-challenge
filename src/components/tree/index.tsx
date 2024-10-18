import { Company, Location, Component } from "../../data/data-models";
import { ExternalData } from "../../data/data-type";
import TreeItem from "./tree-item";
import cn from "classnames";
import "./styles.scss";

interface Props {
  companies: ExternalData<Company[]>;
  onCompanyClick: (companyId: string) => void;
  onComponentClick: (component: Component) => void;
  className?: string;
}

const Tree: React.FC<Props> = (props) => {
  const { companies, onCompanyClick, onComponentClick, className } = props;

  const handleNodeClick = (node: Company | Location) => {
    if (node instanceof Company) {
      onCompanyClick(node.id);
    } else if (node instanceof Component) {
      onComponentClick(node);
    }
  };

  return (
    <ul className={cn("tree-container", className)}>
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
