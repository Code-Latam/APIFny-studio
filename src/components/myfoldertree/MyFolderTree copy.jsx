import { UncontrolledTreeEnvironment, Tree, StaticTreeDataProvider } from 'react-complex-tree';
import React, { useMemo, useState, useEffect } from 'react';
import 'react-complex-tree/lib/style-modern.css';
import './myfoldertree.css'; 
import axios from "axios";

const MyFolderTree = ({myItems, onSelectApi }) => {

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

    const [focusedItem, setFocusedItem] = useState("root");

    const items = useMemo(() => ({ ...myItems }), []);

    const dataProvider = useMemo(
      () =>
        new StaticTreeDataProvider(items, (item, data) => ({
          ...item,
          data: "HELLO",
        })),
      [items]
    );   
        

  console.log("Items")
  console.log(items);

  const handleRenameStart = (item) => {
    // Handle the renaming logic here
    if (item.isFolder)
    {alert(`Item is Folder`)}
    else
    {
        // alert(`Item is API`);
        item.stopRenamingItem();
    }
  };

  function simulateEscapeKeyPress() {
    var event = new KeyboardEvent('keydown', {
      key: 'Escape',
      keyCode: 27, // Note: keyCode is deprecated
      which: 27, // Note: which is deprecated
      bubbles: true
    });
    document.dispatchEvent(event);
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
    items[rand] = { data: 'New Folder', index: rand, isFolder: true, children: []};
    items[parent].children.push(rand);
    dataProvider.onDidChangeTreeDataEmitter.emit([parent]);
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
                {
                    alert('API was permanently deleted form system')
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
      onStartRenamingItem={handleRenameStart}
      onRenameItem={(item, name) => alert(`${item.data} renamed to ${name}`)}
      onFocusItem = { handleFocusedItem}
      canDrag= {handleDrag }
      canDropAt = {handleDrop}
    >
      <button type="button" onClick={injectItem}>
        New Folder
      </button>
      <button type="button" onClick={removeItem}>
        Remove item
      </button>  
      <Tree 
      treeId="tree-1" 
      rootItem="root" 
      treeLabel="API Folders" 
      />
    </UncontrolledTreeEnvironment>
    </div>
  );
};

export default MyFolderTree;