// src/components/FloorPlanner/ItemInfo.jsx
import React from "react";

const ItemInfo = ({ selectedItem, selectedItemType }) => {
  if (!selectedItem) {
    return (
      <div className="mt-4">
        <h2 className="text-xl font-bold">Selected Item Information</h2>
        <p className="mt-2">Select a room, door, or window to view details</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Selected Item Information</h2>
      <div className="mt-2 p-4 border rounded">
        <p><strong>Type:</strong> {selectedItemType.charAt(0).toUpperCase() + selectedItemType.slice(1)}</p>
        <p><strong>ID:</strong> {selectedItem.id}</p>
        
        {selectedItemType === 'room' && (
          <>
            <p><strong>Name:</strong> {selectedItem.name}</p>
            <p><strong>Dimensions:</strong> {selectedItem.width}x{selectedItem.length}</p>
            <p><strong>Position:</strong> ({Math.round(selectedItem.x)}, {Math.round(selectedItem.y)})</p>
          </>
        )}
        
        {(selectedItemType === 'door' || selectedItemType === 'window') && (
          <>
            <p><strong>Position:</strong> {selectedItem.position}</p>
            <p><strong>Offset:</strong> {Math.round(selectedItem.offset)}</p>
            <p><strong>Width:</strong> {Math.round(selectedItem.width)}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ItemInfo;