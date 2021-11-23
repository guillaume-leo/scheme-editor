export const Tree = {
    createRoot : (name, editors = []) => createRoot(name, editors),
    getNode : (node, name) => getNodeFromTree(node, name),
    insert: (node, name, data) => insertNodeIntoTree(node, name, data),
    remove: (node, name) => removeNode(node, name),
    getAllNodesName: node => getAllNodesName(node)
}

export const createRoot = (name, editors)=>{
    return {
        'name': name,
        'editors': editors,
        'children' : []
    }
}

export const  getNodeFromTree = (node, name) => {
    if (node.name === name) {
        return node;
    } else if (node.children != null) {
        let result = null;
        for (let i = 0; result == null && i < node.children.length; i++) {
            result = getNodeFromTree(node.children[i], name);
        }
        return result;
    }
    return null;
}

export const insertNodeIntoTree = (node, name, newNode) => {
    if (node.name === name) {
        // get new id
        /** Your logic to generate new Id **/
        if (newNode) {
            newNode.children = [];
            node.children.push(newNode);
        }

    } else if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
            insertNodeIntoTree(node.children[i], name, newNode);
        }

    }

}




export const deleteNodeFromTree = (node, name) => {
    if (node.children != null) {
        for (let i = 0; i < node.children.length; i++) {
            const filtered = node.children.filter(f => f.name == name);
            if (filtered && filtered.length > 0) {
                node.children = node.children.filter(f => f.name != name);
                return;
            }
            deleteNodeFromTree(node.children[i], name,);
        }
    }
}

export const getParentOf = (node, name) => {
    if (node.children[0].name === name) {

        return node.name;
    } else if (node.children != null) {
        let result = null;
        for (let i = 0; result == null && i < node.children.length; i++) {
            result = getNodeFromTree(node.children[i], name);
        }
        return node.children[0].name;
    }
    return null;
}


export const removeNode = (node, name) => { //remove node and send childs to parent
    const childsToKeep = getNodeFromTree(node, name)?.children
    const parent = getParentOf(node, name)
    deleteNodeFromTree(node, name)
    childsToKeep.forEach(e => {
        insertNodeIntoTree(node, parent, e)
    });
}

export const getAllNodesName = node => 
(node.children.length?[]:[[node.name]]).concat(...node.children.map(child => 
    getAllNodesName(child).map(arr => 
       [node.name].concat(arr)
    )
));