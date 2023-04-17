import { useState } from 'react';

/**
 * A hook to access react forms (text & file inputs)
 * @param {*} initialValues initial form state i.e object/string/boolean
 * @param {*} values updated form input state object
 * @param {*} resetValues function for resetting to initialValues
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

  /**
   * handle form onChange event
   * @param {*} e form event object
   * @param {*} readAs optional parameter for file inputs. Options => ArrayBuffer, BinaryString, DataURL, Text
   */
  const handleChange = (e, readAs) => {
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setValues({
            ...values,
            [e.target.name]:
              readAs && /(buffer|binary|data|text)/i.test(readAs)
                ? reader.result
                : e.target.files[0],
          });
        }
      };
      if (/buffer/i.test(readAs)) {
        reader.readAsArrayBuffer(e.target.files[0]);
      } else if (/binary/i.test(readAs)) {
        reader.readAsBinaryString(e.target.files[0]);
      } else if (/data/i.test(readAs)) {
        reader.readAsDataURL(e.target.files[0]);
      } else if (/text/i.test(readAs)) {
        reader.readAsText(e.target.files[0]);
      } else reader.readAsDataURL(e.target.files[0]);
    } else setValues({ ...values, [e.target.name]: e.target.value });
  };

  return { values, resetValues, handleChange };
};

export default useInput;
