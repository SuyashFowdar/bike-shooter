const el = (parent, el, cb) => {
  const node = document.createElement(el.t);
  if (el.a) {
    for (let i = 0; i < el.a.length; i += 1) node.setAttribute(el.a[i][0], el.a[i][1]);
  }
  if (el.e) {
    for (let i = 0; i < el.e.length; i += 1) {
      node.addEventListener(el.e[i].type, (e) => { el.e[i].func(e, el.e[i].args); });
    }
  }
  if (el.c || el.c === 0) node.appendChild(document.createTextNode(el.c));
  parent.appendChild(node);
  if (cb) {
    cb(node);
  }
};

const getRequest = (type, body) => {
  const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/rx8Uv4eaK8jKB03z267T/scores/';

  const config = {
    method: type,
  };

  if (type === 'POST') {
    config.headers = {
      'Content-Type': 'application/json',
    };
    config.mode = 'cors';
    config.body = JSON.stringify(body);
  }

  return new Request(url, config);
};

export { el, getRequest };
