import { CallToAction } from "../Post/CallToAction";

export const Projects = () => {
  return (
    <div className="flex-1 max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
      <h1 className="text-3xl font-semibold">Проекты</h1>
      <p className="text-md text-gray-500">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni possimus
        ipsum voluptas natus quibusdam corporis, officia, temporibus dolorum
        soluta dicta rem cupiditate voluptates, iure nemo fugiat aut quae?
        Dolore, dolorem.
      </p>
      <CallToAction />
    </div>
  );
};
