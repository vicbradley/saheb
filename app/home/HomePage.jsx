"use client";
import Lottie from "lottie-react";
import runningDog from "@/public/animation/runningDog.json";
import sun from "@/public/animation/sun.json";
import consult from "@/public/animation/consult.json";
import cart from "@/public/animation/cart.json";

const HomePage = () => {
  return (
    <div>
      <div className="flex flex-col lg:h-[80vh] lg:flex-row w-full bg-[#001a9d] justify-center items-center lg:rounded-xl p-5">
        <p className="text-white font-extrabold text-center text-2xl lg:text-5xl">Semua Kebutuhan Hewan Peliharaan Anda</p>
        <div className="w-[100%] flex flex-col ">
          <div className="w-[50%] h-[15vh] lg:h-[25vh] ">
            <Lottie animationData={sun} loop={true} />
          </div>
          <Lottie animationData={runningDog} loop={true} />
        </div>
      </div>

      <p className="w-[95vw] mx-auto text-[#001a9d] mt-6 mb-2 font-extrabold text-3xl">Apa Kebutuhan Anda ?</p>

      <div className="bg-[#001a9d] w-[95vw] flex h-[25vh] lg:h-[40vh] items-center mx-auto rounded-xl mb-2">
        <div className="w-[100%] lg:w-[25%] h-[25vh] lg:h-[40vh] flex items-center">
          <Lottie animationData={consult} loop={true} />
        </div>
        <p className="w-full text-white font-extrabold text-center p-2 text-md lg:text-3xl">Konsultasi Dengan Dokter Hewan Kami Via Chat Selama 24 Jam</p>
      </div>

      <div className="bg-[#001a9d] w-[95vw] flex h-[25vh] lg:h-[40vh] items-center mx-auto rounded-xl mb-2">
        <div className="w-[100%] lg:w-[25%] h-[25vh] lg:h-[40vh] flex items-center">
          <Lottie animationData={cart} loop={true} />
        </div>
        <p className="w-full text-white font-extrabold text-center p-2 text-md lg:text-3xl">Dapatkan Produk Terbaik untuk Hewan Peliharaan Anda</p>
      </div>
    </div>
  );
};

export default HomePage;
