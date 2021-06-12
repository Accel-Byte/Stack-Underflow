import React from 'react';

const Loader = ({ mainLoader }) => {
  let circleCommonClasses = 'h-4 w-4 bg-white rounded-full';
  console.log(mainLoader);
  return mainLoader === true ? (
    <div className="bg-card-dark">
      <div className="flex justify-center items-center h-screen w-screen">
        <div className={`${circleCommonClasses} mr-1 animate-bounce1`}></div>
        <div className={`${circleCommonClasses} mr-1 animate-bounce2`}></div>
        <div className={`${circleCommonClasses} animate-bounce3`}></div>
      </div>
    </div>
  ) : (
    <div className="flex self-center justify-center pt-40">
      <div className={`${circleCommonClasses} mr-1 animate-bounce1`}></div>
      <div className={`${circleCommonClasses} mr-1 animate-bounce2`}></div>
      <div className={`${circleCommonClasses} animate-bounce3`}></div>
    </div>
  );
};

export default Loader;
