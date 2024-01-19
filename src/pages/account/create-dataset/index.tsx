import { useState } from "react";
import NewDataset from "./new-dataset";
import PublishAs from "./publish-as";
import Resource from "./resource";
import Success from "./success";

const data = [
  {
    title: "Publish as",
    description: "Choose who is publishing",
    component: PublishAs,
  },
  {
    title: "New dataset",
    description: "Describe your dataset",
    component: NewDataset,
  },
  {
    title: "Resources",
    description: "Add your first resources",
    component: Resource,
  },
  {
    title: "Success",
    description: "Your dataset has been created",
    component: Success,
  },
];

export default function CreateDataset() {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <>
      <main className="p-6 px-8 tablet:px-6 largeMobile:!px-4 pb-16 flex flex-col gap-6 w-full">
        <h1 className="text-2xl font-semibold mb-2 largeMobile:text-xl">New Dataset</h1>
        <div className="w-full grid grid-cols-4 [@media(max-width:560px)]:flex justify-between overflow-x-auto border p-2 rounded-md bg-white">
          {data.map((item, index) => {
            const newIndex = index + 1;
            const isActive = newIndex === activeIndex;

            return (
              <div
                key={newIndex}
                className={`flex flex-col items-center justify-center gap-2 p-6 tablet:px-2 tablet:py-4 rounded ${
                  isActive ? "bg-primary-600 [&>*]:text-white [&>*]:font-medium" : ""
                }`}
              >
                <h3 className="text-sm text-center">
                  <span
                    className={`${
                      !isActive && "[@media(max-width:560px)]:px-4 mediumMobile:!px-1"
                    }`}
                  >
                    {newIndex}.
                  </span>{" "}
                  <span className={`${!isActive && "[@media(max-width:560px)]:hidden"}`}>
                    {item.title}
                  </span>
                </h3>
                <p className="text-xs text-center tablet:hidden">{item.description}</p>
              </div>
            );
          })}
        </div>
        <div className="border rounded-md bg-white">
          {data.map((item, index) => {
            const newIndex = index + 1;

            if (newIndex === activeIndex) {
              return <item.component key={newIndex} setActiveIndex={setActiveIndex} />;
            }
          })}
        </div>
      </main>
    </>
  );
}
