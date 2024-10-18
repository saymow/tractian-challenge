import React, { useMemo } from "react";
import { Asset, Company, Component, Location } from "../../../data/data-models";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import cn from "classnames";
import "./styles.scss";

export type RootNode = Company;
export type NonRootNode = Location | Asset | Component;
export type TreeNode = RootNode | NonRootNode;

interface Props<T> {
  item: T;
  onClick: (node: TreeNode) => void;
}

const TreeCompany: React.FC<Props<Company>> = (props) => {
  const { item, onClick } = props;

  const handleClick = () => {
    onClick(item);
  };

  const expandIcon = useMemo(() => {
    if (item.isOpen) return <ExpandLessIcon />;
    else return <ExpandMoreIcon />;
  }, [item.isOpen]);

  const children = useMemo(() => {
    if (!item.isOpen || !item.locations) return null;

    return (
      <ul className="subtree-container">
        {item.locations.map((subItem) => (
          <TreeItem key={subItem.id} item={subItem} onClick={onClick} />
        ))}
      </ul>
    );
  }, [item.isOpen, item.locations, onClick]);

  return (
    <li className={cn("tree-item", { expandless: !expandIcon })}>
      <span onClick={handleClick}>
        {expandIcon}
        <img src={"./location.png"}></img>
        {item.name}
      </span>
      {children}
    </li>
  );
};

const TreeLocation: React.FC<Props<Location>> = (props) => {
  const { item, onClick } = props;

  const handleClick = () => {
    onClick(item);
  };

  const expandIcon = useMemo(() => {
    if (!item.assets && !item.children) return null;
    if (item.isOpen) return <ExpandLessIcon />;
    else return <ExpandMoreIcon />;
  }, [item.isOpen, item.assets, item.children]);

  const children = useMemo(() => {
    if (!item.isOpen || (!item.assets && !item.children)) return null;

    return (
      <ul className="subtree-container">
        {(item.children ?? []).map((subItem) => (
          <TreeItem key={subItem.id} item={subItem} onClick={onClick} />
        ))}
        {(item.assets ?? []).map((subItem) => (
          <TreeItem key={subItem.id} item={subItem} onClick={onClick} />
        ))}
      </ul>
    );
  }, [item.isOpen, item.assets, item.children, onClick]);

  return (
    <li className={cn("tree-item", { expandless: !expandIcon })}>
      <span onClick={handleClick}>
        {expandIcon}
        <img src={"./location.png"}></img>
        {item.name}
      </span>
      {children}
    </li>
  );
};

const TreeAsset: React.FC<Props<Asset>> = (props) => {
  const { item, onClick } = props;

  const handleClick = () => {
    onClick(item);
  };

  const expandIcon = useMemo(() => {
    if (!item.children && !item.components) return null;
    if (item.isOpen) return <ExpandLessIcon />;
    else return <ExpandMoreIcon />;
  }, [item.children, item.components, item.isOpen]);

  const children = useMemo(() => {
    if (!item.isOpen || (!item.components && !item.children)) return null;

    return (
      <ul className="subtree-container">
        {(item.children ?? []).map((subItem) => (
          <TreeItem key={subItem.id} item={subItem} onClick={onClick} />
        ))}
        {(item.components ?? []).map((subItem) => (
          <TreeItem key={subItem.id} item={subItem} onClick={onClick} />
        ))}
      </ul>
    );
  }, [item.isOpen, item.components, item.children, onClick]);

  return (
    <li className={cn("tree-item", { expandless: !expandIcon })}>
      <span onClick={handleClick}>
        {expandIcon}
        <img src={"./asset.png"}></img>
        {item.name}
      </span>
      {children}
    </li>
  );
};

const TreeComponent: React.FC<Props<Component>> = (props) => {
  const { item, onClick } = props;

  const handleClick = () => {
    onClick(item);
  };

  return (
    <li
      className={cn("tree-item", "expandless", "component", {
        active: item.selected,
      })}
    >
      <span onClick={handleClick}>
        <img src="./component.png"></img>
        {item.name}
      </span>
    </li>
  );
};

const TreeItem: React.FC<Props<TreeNode>> = (props) => {
  const { item, onClick } = props;

  if (item instanceof Company) {
    return <TreeCompany item={item} onClick={onClick} />;
  } else if (item instanceof Location) {
    return <TreeLocation item={item} onClick={onClick} />;
  } else if (item instanceof Asset) {
    return <TreeAsset item={item} onClick={onClick} />;
  } else {
    return <TreeComponent item={item} onClick={onClick} />;
  }
};

export default TreeItem;
