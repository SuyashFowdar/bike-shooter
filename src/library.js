const el = (parent, el, cb) => {
  if (!parent) {
    parent = document.body;
  }
  const node = document.createElement(el.t);
  if (el.a) {
    for (let i = 0; i < el.a.length; i += 1) node.setAttribute(el.a[i][0], el.a[i][1]);
  }
  if (el.e) {
    for (let i = 0; i < el.e.length; i += 1) {
      node.addEventListener(el.e[i].type, (e) => { el.e[i].func(e, el.e[i].args); });
    }
  }
  if (el.c) node.appendChild(document.createTextNode(el.c));
  parent.appendChild(node);
  if (cb) {
    cb(node);
  }
};

export default el;
