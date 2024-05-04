import Lottie from "lottie-react";
import empty from "@/public/animation/empty.json";

const EmptyPage = ({text}) => {
  return (
    <div className="w-full h-[80vh]  flex flex-col justify-center items-center text-xl font-bold text-center">
      <p className="w-[50%] md:mt-20 lg:-mt-5  text-[#001a9d]">{text}</p>
      <div className="lg:w-[50%] lg:h-[100%] lg:-mt-36 md:w-[60%] md:h-[100%] md:mt-5">
        <Lottie className="-mt-14 lg:-mt-0" animationData={empty} loop={true} />
      </div>
    </div>
  );
};

export default EmptyPage;
