import ConsultBtn from "./ConsultBtn";

const ConsultantList = (props) => {
  const id = props.consultantData.id;
  const { username, profilePicture, speciality, experience, pricing } = props.consultantData.consultantData;

  const otherUserData = {
    otherUserId: id,
    otherUsername: username,
    otherUserProfilePicture: profilePicture,
    pricing: pricing,
  };

  return (
    <div className="w-[80%] h-[65vh] lg:h-[80vh] mt-4 p-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow">
      <div className="h-[65%]">
        <img className="p-8 mx-auto w-[100%] h-[100%] rounded-t-lg object-cover" src={profilePicture} alt={username} />
      </div>
      <div className="px-5 pb-5">
        <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{username}</h5>
        <div className="mt-2.5 mb-5">
          <div>
            <p>Keahlian : {speciality}</p>
            <p>Pengalaman : {experience}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="bg-blue-100 text-blue-800 text-md font-semibold p-2 rounded ">Rp {Intl.NumberFormat("id-ID").format(pricing)}</span>
          {/* <ConsultBtn consultantData={{ consultantId: id, consultantUsername: username, pricing: pricing, consultantProfilePicture: profilePicture }} /> */}
          <ConsultBtn otherUserData={otherUserData} />
        </div>
      </div>
    </div>
  );
};

export default ConsultantList;
