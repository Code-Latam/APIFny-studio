// APIForm.js
import React, { useState } from 'react';

const APIForm = ({ api, onSubmit, onDelete }) => {
  const [formData, setFormData] = useState({
    name: api ? api.name : '',
    description: api ? api.description : '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', description: '' });
  };

  return (
    <div>
      <h2>{api ? 'Edit API' : 'Create API'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </label>
        <button type="submit">{api ? 'Update' : 'Create'}</button>
        {api && <button type="button" onClick={onDelete}>Delete</button>}
      </form>
    </div>
  );
};

export default APIForm;
