import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';
import React, { useRef, useMemo, useState, useEffect } from 'react';
import 'react-complex-tree/lib/style-modern.css';
import './myfoldertree.css'; 
import axios from "axios";

const MyFolderTree = ({myItems, onSelectApi, clientNr }) => {

    <style>{`
        :root {
          --rct-color-tree-bg: #F6F8FA;
          --rct-color-tree-focus-outline: #d60303;
          --rct-color-focustree-item-selected-bg: #e2d3d3;
          --rct-color-focustree-item-focused-border: #d60303;
          --rct-color-focustree-item-draggingover-bg: #ecdede;
          --rct-color-focustree-item-draggingover-color: inherit;
          --rct-color-search-highlight-bg: #7821e2;
          --rct-color-drag-between-line-bg: #cf03d6;
          --rct-color-arrow: #b48689;
          --rct-item-height: 60px;
        }
      `}</style>

    const tree = useRef();  

    const [focusedItem, setFocusedItem] = useState("root");

    const items = useMemo(() => ({ ...myItems }), []);

    const dataProvider = useMemo(
      () =>
        new StaticTreeDataProvider(items, myRename ),
      [items]
    );   

    function myRename(item,newName)
    {
        if (item.index == "Unassigned" || item.index === "MyFolders")
        {   alert("Systems folders can't be renamed")
            return { ...item, data: item.data };
        }
        else
        {
            if (item.isFolder)
            {
                alert("renaming Folder");
                const parentIndex = findParent(item.index,items)
                alert(parentIndex);

                items[parentIndex].children = items[parentIndex].children.filter(child => child !== item.index);
                // add renamed child to parent
                items[parentIndex].children.push(newName);

                
                
                // add new child with new name
                items[newName] = { data: newName, index: newName, isFolder: true ,children: item.children};
                // delete old child
                delete items[item.index] ;
                // save structure

                const saveFolderPayload = {
                    clientNr: clientNr,
                    items: items
                }
               
                axios.post(process.env.REACT_APP_CENTRAL_BACK + '/folder/update', saveFolderPayload);

                dataProvider.onDidChangeTreeDataEmitter.emit([parentIndex]);    
            return { ...item, data: newName };
            }
            else
            {
                // item is an API
                // remove old child from parent
                const parentIndex = findParent(item.index,items)

                items[parentIndex].children = items[parentIndex].children.filter(child => child !== item.index);
                // add renamed child to parent
                items[parentIndex].children.push(newName);

                // delete old child
                delete items[item.index] ;
                // add new child with new name
                items[newName] = { data: newName, index: newName};
                // save structure

                const saveFolderPayload = {
                    clientNr: clientNr,
                    items: items
                }
               
                axios.post(process.env.REACT_APP_CENTRAL_BACK + '/folder/update', saveFolderPayload);

                const saveApiPayload = {
                    clientNr: clientNr,
                    oldName: item.index,
                    newName: newName
                }

                axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/changename', saveApiPayload);
                dataProvider.onDidChangeTreeDataEmitter.emit([parentIndex]);
                tree.current.moveFocusUp()
                return { ...item, data: newName };
            }
        }
    }
        




  const injectItem = () => {
    if (!focusedItem) 
    {
        alert("please select a location to create folder");
        return;
    }

    if (focusedItem === "Unassigned") 
    {
        alert("It is not allowed to create a folder in the Unassigned Apis folder");
        return;
    }


    const parentFocusedIndex = findParent(focusedItem,items)
    // if focusedItem is a folder then the parent is itself
    let parent = focusedItem
    if (items[focusedItem].isFolder)
    {
        parent = focusedItem
    }
    else 
    {
        parent = parentFocusedIndex ;
    }

    console.log (`FOCUSED ITEM IS ${focusedItem}`)
    console.log (`PARENT ITEM IS ${parent}`)

    const rand = `${Math.random()}`;
    items[rand] = { data:'New Folder', index: rand, isFolder: true, children: []};
    items[parent].children.push(rand);
    dataProvider.onDidChangeTreeDataEmitter.emit([parent]);
  };

  const injectApi = () => {

    let parent = "Unassigned"

    const rand ="New Api " + `${Math.random()}`;
    const myNewAPiPayload = {
        clientNr: clientNr,
        name: rand,
        description: "none",
        urlRoute: "https://",
        resourcePath: "https://",
        headers:[],
        method: "POST",
        requestBodyType: "JSON",
        responseBodyType: "JSON"

    }

    axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/register', myNewAPiPayload); //
                   


    items[rand] = { data: rand, index: rand};
    items[parent].children.push(rand);
    dataProvider.onDidChangeTreeDataEmitter.emit([parent]);

    const saveFolderPayload = {
        clientNr: clientNr,
        items: items
    }
   
    axios.post(process.env.REACT_APP_CENTRAL_BACK + '/folder/update', saveFolderPayload); //
    
    alert("Api created in Unassigned Folder!");

  };

  const copyApi = () => {
    if (items[focusedItem].isFolder)
    {
        alert("Please select an api to copy");
        return;
    }
    

    let parent = "Unassigned"

    const newApiName ="Copy of " + focusedItem + " " + `${Math.random()}`;
    const copyAPiPayload = {
        clientNr: clientNr,
        apiToCopy: focusedItem,
        newApiName: newApiName
    }

    axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/copy', copyAPiPayload); //
                   


    items[newApiName] = { data: newApiName, index: newApiName};
    items[parent].children.push(newApiName);
    dataProvider.onDidChangeTreeDataEmitter.emit([parent]);

    const saveFolderPayload = {
        clientNr: clientNr,
        items: items
    }
   
    axios.post(process.env.REACT_APP_CENTRAL_BACK + '/folder/update', saveFolderPayload); //
    
    alert("Api copied to Unassigned Folder!");

  };


  const removeItem = () => {

    if (!focusedItem || focusedItem ==="root") 
    {
        alert("please select an item to remove");
        return;
    }
    const parentFocusedIndex = findParent(focusedItem,items)
    console.log (`FOCUSED ITEM IS ${focusedItem}`)
    console.log (`PARENT ITEM IS ${parentFocusedIndex}`)

    if (focusedItem ==="MyFolders" ) 
    {
        alert("MyFolders is a systems folder and can't be removed.");
        return;
    }

    if (focusedItem ==="Unassigned") 
    {
        alert("Unassigned is a systems folder and can't be removed.");
        return;
    }

    if (items[focusedItem].isFolder) 
    
    {
        if (items[focusedItem].children.length !== 0)
         {
            alert("Folder has sub-items please delete all sub-items first")
         }
         else
         {
            if (parentFocusedIndex) {
                const parentItem = items[parentFocusedIndex];
                parentItem.children = parentItem.children.filter(child => child !== focusedItem);
            }
        
            // Remove the child from the items object
            delete items[focusedItem]; 
            dataProvider.onDidChangeTreeDataEmitter.emit([parentFocusedIndex]);
         }
        return;
    }
    else
        {    
        if (parentFocusedIndex) 
            {
            if (parentFocusedIndex !== "Unassigned")
                {
                //remove item from current parent    
                const parentItem = items[parentFocusedIndex];
                parentItem.children = parentItem.children.filter(child => child !== focusedItem);
                // delete items[focusedItem]; 
                dataProvider.onDidChangeTreeDataEmitter.emit([parentFocusedIndex]);
                // move item to unassigned
                items["Unassigned"].children.push(focusedItem);
               
                dataProvider.onDidChangeTreeDataEmitter.emit(["Unassigned"]);
                alert('API was moved to unasigned directory')
                }
            else
                {   const parentItem = items[parentFocusedIndex];
                    parentItem.children = parentItem.children.filter(child => child !== focusedItem);
                    // delete items[focusedItem];
                    delete items[focusedItem]; 
                    dataProvider.onDidChangeTreeDataEmitter.emit([parentFocusedIndex]);

                    const deletePayload = {
                        clientNr: clientNr,
                        name: focusedItem
                    }

                    axios.post(process.env.REACT_APP_CENTRAL_BACK + '/api/delete', deletePayload); //
                    
                    const saveFolderPayload = {
                        clientNr: clientNr,
                        items: items
                    }
                   
                    axios.post(process.env.REACT_APP_CENTRAL_BACK + '/folder/update', saveFolderPayload); //
                    

                    alert('API was permanently deleted form system')
                    tree.current.moveFocusUp()
                }   
            }
        // Remove the child from the items object
            
    }    
    // items.root.children.pop();
    // dataProvider.onDidChangeTreeDataEmitter.emit(['root']);
  };


  function handleFocusedItem(item)

  {

    setFocusedItem(item.index);
    // check if item is an api
    if (!item.isFolder)
    {
        onSelectApi(item.index);
    }
    else
    {
        onSelectApi(null)
    }
    console.log(`focus set on ${item.index}`);
  }

  function findParent(childIndex, items) {
    if (childIndex === "root")
    { return "root"}
    for (const [parentIndex, parentItem] of Object.entries(items)) {
        if (parentItem.children && parentItem.children.includes(childIndex)) {
            return parentIndex;
        }
    }
    return null; // Return null if the parent is not found
}

function handleDrag(items)
{
    if (items.some(item => item.index === "Unassigned" || item.index === "MyFolders"))
    {
    return false;
    }
    else
    {
        return true;
    }
}

function handleDrop(items, target)
{
   
    if (target.targetItem === "Unassigned")
    {
    return false;
    }
    else
    {
        return true;
    }
}
  

  return (
    <div className= "my-folder-tree">
    <UncontrolledTreeEnvironment
      dataProvider={dataProvider}
      getItemTitle={item => item.data}
      viewState={{
        ['tree-1']: {
          focusedItem: 'root'
        },
      }}
      canDragAndDrop={true}
      canReorderItems={true}
      canDropOnFolder={true}
      canDropOnNonFolder={false}
      onFocusItem = { handleFocusedItem}
      canDrag= {handleDrag }
      canDropAt = {handleDrop}
    >
      <button type="button" onClick={injectItem}>
        New Folder
      </button>
      <button type="button" onClick={injectApi}>
        New Api
      </button>
      <button type="button" onClick={copyApi}>
        Copy Api
      </button>
      <button type="button" onClick={removeItem}>
        Remove item
      </button>  
      <Tree 
      treeId="tree-1" 
      rootItem="root" 
      treeLabel="API Folders" 
      ref={tree}
      />
    </UncontrolledTreeEnvironment>
    </div>
  );
};

export default MyFolderTree;