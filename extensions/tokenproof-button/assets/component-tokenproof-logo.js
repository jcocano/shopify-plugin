import { h } from 'https://esm.sh/preact';

export function TokenproofLogo() {
  return h(
    'svg',
    {
      width: "24",
      height: "24",
      viewBox: "0 0 500 500",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className: "tokenproof-icon"
    },
    h(
      'g',
      { "clip-path": "url(#clip0_101_855)" },
      h('path', {
        d: "M68.5874 222.328C54.4175 222.438 40.3034 220.55 26.666 216.721L36.1396 186.968C36.6382 186.968 87.8414 202.226 130.454 172.702C168.578 146.268 189.52 92.6366 193.24 13.334L224.576 14.7835C220.357 104.5 194.621 166.332 147.867 198.526C124.471 214.405 96.7176 222.717 68.3957 222.328Z",
        fill: "#2563eb"
      }),
      h('path', {
        d: "M424.745 222.328C396.424 222.717 368.671 214.405 345.275 198.526C298.713 166.332 272.977 104.5 268.758 14.7835L300.093 13.334C303.929 92.6365 324.947 146.268 362.88 172.702C405.492 202.417 456.695 187.121 457.193 186.968L466.667 216.721C453.03 220.55 438.915 222.438 424.745 222.328Z",
        fill: "#2563eb"
      }),
      h('path', {
        d: "M300.093 478.124L268.758 476.674C272.977 387.149 298.713 325.126 345.275 292.932C400.736 254.52 464.174 273.86 466.667 274.737L457.193 304.49C456.695 304.49 405.492 289.232 362.88 318.756C324.947 345.19 303.852 398.859 300.093 478.124Z",
        fill: "#2563eb"
      }),
      h('path', {
        d: "M193.24 478.123C189.481 398.821 168.578 345.189 130.454 318.755C88.0332 289.041 36.6382 304.337 36.1396 304.489L26.666 274.736C29.3125 273.897 92.5973 254.52 148.058 292.931C194.621 325.125 220.357 387.148 224.576 476.674L193.24 478.123Z",
        fill: "#2563eb"
      })
    ),
    h(
      'defs',
      null,
      h(
        'clipPath',
        { id: "clip0_101_855" },
        h('rect', { width: "500", height: "500", fill: "white" })
      )
    )
  );
}
