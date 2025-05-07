import React from "react";

import classic from "../../../assets/icons/classic-FIT.png"
import pocket from '../../../assets/icons/pocket.png'
import water from "../../../assets/icons/water.png"
import iron from "../../../assets/icons/iron.png"

const ProductFeatures = () => {
  const features = [
    {
      icon: [classic],
      title: "CLASSIC FIT"
    },
    {
      icon:[pocket],
      title: "12 POCKETS"
    },
    {
      icon: [water],
      title: "WATER RESISTANT"
    },
    {
      icon:[iron],
      title: "ANTI-WRINKLE"
    }
  ];

  return (
    <section className="w-full bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap md:flex-nowrap md:justify-between items-center">
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center justify-center w-full md:w-auto px-4 py-6">
                <div className="mb-4">
                  <img 
                    src={feature.icon || "/placeholder.svg"} 
                    alt={feature.title} 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h3 className="text-gray-700 text-sm font-medium tracking-wider">
                  {feature.title}
                </h3>
              </div>
              {index < features.length - 1 && (
                <div className="hidden md:block h-16 w-px bg-gray-300 mx-2" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductFeatures;