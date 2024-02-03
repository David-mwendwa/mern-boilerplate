import React from 'react';

/**
 * Show loader as a btn text while making an api call
 * @returns loader
 * @example {loading ? <ButtonLoader /> : 'Submit'}
 */
const ButtonLoader = () => {
  return <div className='lds-dual-ring'></div>;
};

export default ButtonLoader;
