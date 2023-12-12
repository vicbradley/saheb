import Lottie from "lottie-react";
import empty from "@/public/animation/empty.json";

const EmptyPage = (props) => {
  return (
    <div className="w-full h-[80vh]  flex flex-col justify-center items-center text-xl font-bold text-center">
      <p className="w-[50%] text-[#001a9d]">{props.text}</p>
      <div className="lg:w-[50%] lg:h-[100%] lg:-mt-36">
        <Lottie className="-mt-14 lg:-mt-0" animationData={empty} loop={true} />
      </div>
    </div>
  );
};

export default EmptyPage;
