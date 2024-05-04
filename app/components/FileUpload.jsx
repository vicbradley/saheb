import { storage } from "@/src/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Text } from "@radix-ui/themes";
import { Progress } from "@chakra-ui/react";

const FileUpload = ({ formik, folderName, labelText }) => {
  const handleFileInputChange = (e) => {
    formik.setFieldValue("fileUpload", e.target.files[0]);
  };

  const uploadImageToDb = (e) => {
    const { fileUpload } = formik.values;
    e.preventDefault();

    if (!fileUpload) return;

    const metadata = {
      contentType: "image/jpeg",
    };

    const storageRef = ref(storage, folderName + fileUpload.name);
    const uploadTask = uploadBytesResumable(storageRef, fileUpload, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setProgressValue(progress);
        formik.setFieldValue("progressValue", progress);
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          if (folderName == "products/") {
            formik.setFieldValue("image", downloadURL);
          } else if (folderName == "storeProfilePicture/") {
            formik.setFieldValue("storeProfilePicture", downloadURL);
          } else if (folderName == "usersProfilePicture/") {
            formik.setFieldValue("newProfilePicture", downloadURL);
          } else if (folderName == "messageImage/") {
            formik.setFieldValue("messageImage", downloadURL);
          }
        });
      }
    );
  };

  return (
    <>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          {labelText}
        </Text>
        <div className="flex justify-between items-center">
          <input name="fileUpload" type="file" className="file-input file-input-bordered file-input-sm" onChange={handleFileInputChange} />

          <button type="button" className={`ml-2 btn btn-sm bg-slate-800 text-base-300  hover:text-slate-800 ${formik.values.fileUpload ? "" : "cursor-not-allowed opacity-50"}`} onClick={(e) => uploadImageToDb(e)}>
            upload
          </button>
        </div>
      </label>

      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          {formik.values.progressValue == 100 ? "Gambar sukses diupload" : "Upload File dulu"}
        </Text>
        <Progress value={formik.values.progressValue} />
      </label>
    </>
  );
};

export default FileUpload;
