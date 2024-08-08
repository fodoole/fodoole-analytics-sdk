module.exports = function ({ types: t }) {
  return {
    visitor: {
      MemberExpression(path) {
        if (t.isIdentifier(path.node.object, { name: "window" })) {
          if (t.isAssignmentExpression(path.parent)) {
            return;
          }
          if (t.isIdentifier(path.node.property, { name: "qeen" })) {
            if (t.isMemberExpression(path.parent)) {
              path.replaceWith(path.node.property);
            }
          } else {
            path.replaceWith(path.node.property);
          }
        }
      },
    },
  };
};