import React from "react";
import '../scss/Loader.scss'

const Loader = ({active}) => {
  return (
   <div className={active ? "Preloader__overlay active" : "Preloader__overlay none-active"}>
      <div className="preloader-wrapper big active">
      <div className="spinner-layer spinner-blue-only">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div><div className="gap-patch">
          <div className="circle"></div>
        </div><div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>
    </div>
   </div>
  );
};

export default Loader;
