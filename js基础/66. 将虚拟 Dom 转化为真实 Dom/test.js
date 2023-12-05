
let vdom = {
    tag: 'DIV',
    attrs: {
        id: 'app'
    },
    children: [
        {
            tag: 'SPAN',
            children: [
                { tag: 'A', children: [] }
            ]
        },
        {
            tag: 'SPAN',
            children: [
                { tag: 'A', children: [] },
                { tag: 'A', children: [] }
            ]
        }
    ]
}

function renderDom(vNode) {
    if (typeof vNode === 'number') {
        return document.createTextNode(String(vnode));
    }

    if (typeof vNode === 'string') {
        return document.createTextNode(vNode)
    }

    let dom = document.createElement(vNode.tag)
    if (vNode.attrs) {
        Object.keys(vNode.attrs).forEach(key => {
            let value = vNode.attrs[key]
            dom.setAttribute(key, value)
        })
    }

    if (vNode.children?.length) {
        vNode.children?.forEach(child => {
            dom.appendChild(renderDom(child))
        })
    }

    return dom
}

console.log(renderDom(vdom))