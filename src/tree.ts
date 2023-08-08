export interface Tree {
  children: Tree[];
}

export const iterateTree: any = (
  tree: Tree[],
  decorator: (node: any) => Tree
) => {
  return (
    tree &&
    tree.map((treeItem) => {
      if (treeItem.children)
        return {
          ...decorator(treeItem),
          children: iterateTree(
            treeItem.children.map((item) => ({
              ...item,
              originalParent: treeItem,
            })),
            decorator
          ),
        };
      return decorator(treeItem);
    })
  );
};

export const flatTree = (data: Tree[], decorator = (item: any) => item) => {
  let tree: any[] = [];
  data.forEach(function ({ children, ...item }) {
    tree.push(decorator({ ...item }));
    if (children) {
      tree = tree.concat(flatTree(children));
    }
  });
  return tree;
};
