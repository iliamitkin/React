import React, { useState } from 'react';

function UserForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.age && (formData.age < 0 || formData.age > 150)) {
      newErrors.age = 'Age must be between 0 and 150';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
      setFormData({ name: '', email: '', age: '' });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="user-form">
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          data-testid="name-input"
        />
        {errors.name && (
          <span data-testid="name-error" style={{ color: 'red' }}>
            {errors.name}
          </span>
        )}
      </div>
      
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          data-testid="email-input"
        />
        {errors.email && (
          <span data-testid="email-error" style={{ color: 'red' }}>
            {errors.email}
          </span>
        )}
      </div>
      
      <div>
        <label htmlFor="age">Age (optional):</label>
        <input
          id="age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          data-testid="age-input"
        />
        {errors.age && (
          <span data-testid="age-error" style={{ color: 'red' }}>
            {errors.age}
          </span>
        )}
      </div>
      
      <button type="submit" data-testid="submit-btn">
        Submit
      </button>
    </form>
  );
}

export default UserForm;
