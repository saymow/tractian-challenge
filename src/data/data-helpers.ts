import { Node, Company, Location, Component, Asset } from "./data-models";
import { FilterOptions } from "./data-type";

export const dfs = (path: Array<Node>, current: Node, target: Node) => {
  if (current instanceof Component) return false;
  if (current === target) return true;

  const children: Node[] = [];

  if (current instanceof Company) {
    children.push(...(current.locations ?? []));
  } else if (current instanceof Location) {
    children.push(...(current.children ?? []));
    children.push(...(current.assets ?? []));
  } else {
    children.push(...(current.children ?? []));
  }

  for (const child of children) {
    path.push(child);
    if (dfs(path, child, target)) return true;
    path.pop();
  }

  return false;
};

const filterNode = (node: Node, options: FilterOptions) => {
  const children: Node[] = [];

  if (node instanceof Company) {
    children.push(...(node.locations ?? []));
  } else if (node instanceof Location) {
    children.push(...(node.children ?? []));
    children.push(...(node.assets ?? []));
  } else if (node instanceof Asset) {
    children.push(...(node.children ?? []));
    children.push(...(node.components ?? []));
  }

  node.isVisible =
    !(node instanceof Company) && node.name.includes(options.searchText);

  for (const child of children) {
    node.isVisible = filterNode(child, options) || node.isVisible;
  }

  if ("isOpen" in node) {
    node.isOpen = node.isVisible && options.searchText.length > 0;
  }

  return node.isVisible;
};

export const filter = (
  companies: Company[],
  filterOptions: FilterOptions
): boolean => {
  let shouldBeVisible = false;

  for (const company of companies) {
    shouldBeVisible = filterNode(company, filterOptions) || shouldBeVisible;
  }

  return shouldBeVisible;
};
