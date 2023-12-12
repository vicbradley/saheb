"use client";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import runningDog from "@/public/animation/runningDog.json";
import sun from "@/public/animation/sun.json";
import moment from "moment";
moment().format();

const HomePage = () => {
  const { push } = useRouter();

  return (
    <div>
      <div className="flex flex-col lg:h-[80vh] lg:flex-row w-full bg-[#001a9d] justify-center items-center lg:rounded-xl p-5">
        <p className="text-[#fbdcd9] font-extrabold text-center text-2xl lg:text-5xl">Semua Kebutuhan Hewan Peliharaan Anda</p>
        <div className="w-[100%] flex flex-col ">
          <div className="w-[50%] h-[15vh] lg:h-[25vh] ">
            <Lottie animationData={sun} loop={true} />
          </div>
          <Lottie animationData={runningDog} loop={true} />
        </div>
      </div>


      <p className="text-[#001a9d] mt-6 font-extrabold text-2xl">Apa Kebutuhan Anda ?</p>

      {/* <div className="bg-[#fbdcd9] flex p-4 mt-3 rounded-2xl h-[25vh]" onClick={() => push("/products")}>
        <div className="w-[60%] text-[#001a9d]">
          <p className="font-extrabold text-xl">Produk</p>
          <p>Semua kebutuhan produk hewan peliharaan anda</p>
        </div>

        <div className="w-[40%] flex items-center">
          <img className="w-[150%]" src="https://firebasestorage.googleapis.com/v0/b/saheb-2d8c9.appspot.com/o/design%2FOpen%20Doodles%20-%20Nature.png?alt=media&token=7056ba22-d50f-4f14-b118-a619e2169915" alt="" />
        </div>
      </div>

      <div className="bg-[#fbdcd9] flex mt-6 p-4 rounded-t-2xl h-[25vh]" onClick={() => push("/consult")}>
        <div className="w-[60%] text-[#001a9d]">
          <p className="font-extrabold text-xl">Konsultasi</p>
          <p>Konsultasikan hewan peliharaan anda!</p>
        </div>

        <div className="w-[40%] flex items-center">
          <img src="https://firebasestorage.googleapis.com/v0/b/saheb-2d8c9.appspot.com/o/design%2Fdoctor.png?alt=media&token=16b235ef-0803-4a47-82b7-9e69883cdc85" alt="" />
        </div>
      </div> */}

      {/* <footer className="footer footer-center p-4 text-[#fbdcd9] bg-[#001a9d]">
        <aside>
          <p>Copyright © 2023 - All right reserved by IOD Team</p>
        </aside>
      </footer> */}
    </div>
  );
};

export default HomePage;
