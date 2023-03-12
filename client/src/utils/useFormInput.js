import { useState } from 'react';

/**
 * @param {*} initialValues as initial values object i.e {name: '', image: null}
 * @returns an object containing updated input values as 'values', resetValues function for resetting to initialValues and handleChange function for handling onChange event
 * @invoke destructure values, resetValues and handleChange from useInput(initialValues) i.e const {values, resetValues, handleChange} = useInput(initialValues)
 */
const useInput = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const resetValues = () => setValues(initialValues);

  const handleChange = (e) => {
    if (e.target.files) {
      setValues({ ...values, [e.target.name]: e.target.files[0] });
    } else setValues({ ...values, [e.target.name]: e.target.value });
  };

  return { values, resetValues, handleChange };
};

export default useInput;
