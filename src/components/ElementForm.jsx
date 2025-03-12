import React, { useState } from 'react';
import './ElementForm.css';

const ElementForm = ({ element, elementType, room, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    width: element?.width || 20,
    wall: element?.wall || 'top',
    position: element?.position || 'center'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'width' ? Number(value) : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="element-form">
      <h2>{element ? `Edit ${elementType}` : `Add New ${elementType}`}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="width">Width (px):</label>
          <input
            type="number"
            id="width"
            name="width"
            value={formData.width}
            onChange={handleChange}
            min="10"
            max={formData.wall === 'top' || formData.wall === 'bottom' ? room.width - 20 : room.length - 20}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="wall">Wall:</label>
          <select
            id="wall"
            name="wall"
            value={formData.wall}
            onChange={handleChange}
            required
          >
            <option value="top">Top</option>
            <option value="right">Right</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="position">Position:</label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ElementForm;