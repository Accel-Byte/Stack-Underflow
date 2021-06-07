import React from 'react';

const Loader = () => {
  let circleCommonClasses = 'h-4 w-4 bg-white rounded-full';

  return (
    <div className="flex self-center justify-center pt-40">
      <div className={`${circleCommonClasses} mr-1 animate-bounce1`}></div>
      <div className={`${circleCommonClasses} mr-1 animate-bounce2`}></div>
      <div className={`${circleCommonClasses} animate-bounce3`}></div>
    </div>
  );
};

export default Loader;
