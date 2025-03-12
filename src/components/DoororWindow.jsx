import React from "react";
import { Group, Rect, Circle, Text } from "react-konva";

const DoorOrWindow = ({
  item,
  roomData,
  isSelected,
  onSelect,
  onChange,
  type,
  onDelete,
}) => {
  const getPosition = () => {
    const { position, offset, width } = item;
    const { x, y, width: roomWidth, length: roomLength } = roomData;
    
    switch (position) {
      case "top":
        return {
          x: x + offset - width / 2,
          y: y,
          rotation: 0,
        };
      case "right":
        return {
          x: x + roomWidth,
          y: y + offset - width / 2,
          rotation: 90,
        };
      case "bottom":
        return {
          x: x + offset - width / 2,
          y: y + roomLength,
          rotation: 0,
        };
      case "left":
        return {
          x: x,
          y: y + offset - width / 2,
          rotation: 90,
        };
      default:
        return {
          x: x,
          y: y,
          rotation: 0,
        };
    }
  };

  const pos = getPosition();
  const isDoor = type === "door";
  const itemColor = isDoor ? "#8B4513" : "#ADD8E6";

  const handleDrag = (e) => {
    const { x, y } = e.target.position();
    
    let newPosition = item.position;
    let newOffset = item.offset;
    
    if (item.position === "top" || item.position === "bottom") {
      newOffset = item.offset + (x - pos.x);
    } else {
      newOffset = item.offset + (y - pos.y);
    }
    
    if (item.position === "top" || item.position === "bottom") {
      newOffset = Math.max(item.width / 2, Math.min(roomData.width - item.width / 2, newOffset));
    } else {
      newOffset = Math.max(item.width / 2, Math.min(roomData.length - item.width / 2, newOffset));
    }
    
    onChange({
      ...item,
      position: newPosition,
      offset: newOffset,
    });
  };

  const DeleteButton = ({ onClick }) => (
    <Group x={10} y={-20} onClick={onClick} onTap={onClick}>
      <Circle radius={10} fill="white" stroke="#f44336" strokeWidth={1} />
      <Text
        text="✕"
        fontSize={12}
        fill="#f44336"
        align="center"
        verticalAlign="middle"
        x={-5}
        y={-6}
      />
    </Group>
  );

  return (
    <Group
      x={pos.x}
      y={pos.y}
      rotation={pos.rotation}
      onClick={onSelect}
      onTap={onSelect}
      draggable
      onDragMove={handleDrag}
      onDragEnd={handleDrag}
    >
      <Rect
        width={item.width}
        height={isDoor ? 10 : 8}
        fill={itemColor}
        stroke="#333"
        strokeWidth={1}
      />
      
      {isDoor && (
        <Rect
          x={0}
          y={10}
          width={item.width}
          height={1}
          fill="#8B4513"
          stroke="#333"
          strokeWidth={1}
          dash={[2, 2]}
        />
      )}
      
      {isSelected && (
        <DeleteButton onClick={() => onDelete(item.id, type)} />
      )}
    </Group>
  );
};

export default DoorOrWindow;