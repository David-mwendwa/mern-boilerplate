import { useState } from 'react';

/**
 * A hook to access react forms (text & file inputs)
 * @param {*} initialValues initial form state
 * @param {*} values updated form input state object
 * @param {*} resetValues resetValues function for resetting to initialValues
 * @param {*} handleChange function for handling form onChange event
 * @returns an object 
 * @example const { values, handleChange, resetValues } = useInput({
              value1: '',
              value2: false,
              value3: {},
              value4: [],
              image: ''
            });
 */
const useInput = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const resetValues = () => setValues(initialValues);

  const handleChange = (e) => {
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setValues({ ...values, [e.target.name]: reader.result });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else setValues({ ...values, [e.target.name]: e.target.value });
  };

  return { values, resetValues, handleChange };
};

export default useInput;
