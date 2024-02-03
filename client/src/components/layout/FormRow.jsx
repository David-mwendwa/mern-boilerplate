import React from 'react';

/**
 * Create form input row
 * @param {*} type input type
 * @param {*} name input name
 * @param {*} value input value
 * @param {*} handleChange onClick event handler,
 * @param {*} labelText input label text
 * @returns Designed form row component @example <div>
      <label htmlFor='email'>Email</label>
      <input
        type='email'
        value={'david@example.com'}
        name='email'
        onChange={'...'}
      />
    </div>
 */
const FormRow = ({
  type,
  name,
  value,
  handleChange,
  labelText,
  defaultValue = '',
}) => {
  return (
    <div className='form-row'>
      <label htmlFor={name} className='form-label'>
        {labelText || name}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className='form-input'
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default FormRow;
