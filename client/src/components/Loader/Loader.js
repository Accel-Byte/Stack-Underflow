import React from 'react';

const Loader = () => {
  let circleCommonClasses = 'h-4 w-4 bg-white rounded-full';

  return (
    <div className="flex self-center justify-center h-80">
      <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
      <div className={`${circleCommonClasses} mr-1 animate-bounce200`}></div>
      <div className={`${circleCommonClasses} animate-bounce400`}></div>
    </div>
  );
};

export default Loader;
