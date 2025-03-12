export const fetchFloorPlans = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/floorplan/search',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(floorPlan),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching floor plans:', error);
      throw error;
    }
  };
  
  export const saveFloorPlan = async (floorPlan) => {
    try {
      const response = await fetch('http://localhost:8000/api/floorplan/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(floorPlan),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving floor plan:', error);
      throw error;
    }
  };
  
  export const deleteFloorPlan = async (id) => {
    try {
      const response = await fetch('http://localhost:8000/api/floorplan/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting floor plan:', error);
      throw error;
    }
  };
  