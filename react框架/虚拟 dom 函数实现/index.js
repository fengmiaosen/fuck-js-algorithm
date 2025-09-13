

function h(tag, attrs, children) {
    /* Your Code HERE */
    let node = document.createElement(tag)

    if (attrs) {
        for (let key in attrs) {
            if (key === 'on') {
                let events = attrs['on']
                for (let k in events) {
                    node[`on${k}`] = events[k]
                }
            } else {
                node.setAttribute(key, attrs[key])
            }
        }
    }

    if (Array.isArray(children) && children.length > 0) {
        children.map(item => {
            if (typeof item === 'string') {
                node.appendChild(document.createTextNode(item))
            } else {
                node.appendChild(item)
            }
        })
    } else {
        if (typeof children === 'string') {
            node.appendChild(document.createTextNode(children))
        }
    }

    return node

}

function patch(dom, vnode) {
    if (!dom) {
        return null
    }
    /* Your Code HERE */
    if (typeof dom === 'string') {
        document.querySelector(dom)?.appendChild(vnode)
    } else {
        dom.appendChild(vnode)
    }
}


function handleClick() {
    console.log("clicked");
}

const vnode = h("div",
    { id: "element", class: "two classes", on: { click: handleClick } },
    [
        h("span", { class: "text-class1" }, "This is black"),
        " and this is just normal text",
        h("a", { href: "/foo" }, "I'll take you places!"),
    ]
);

// Patch into empty DOM element
patch(container, vnode);

const container = document.createElement('div');
container.id = 'container'
container.style = `
    height: 200px;
    background: #000;
`

document.body.appendChild(container)

# 参考

https://github.com/giftedunicorn/frontendcoding?tab=readme-ov-file#21-%E5%AE%9E%E7%8E%B0-json-to-dom
