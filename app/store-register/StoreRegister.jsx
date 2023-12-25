"use client";
import { db, storage } from "@/src/firebase/config";
import { collection, query, where, getDocs, getDoc, setDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "../logic/getUserInfo";
import isAlphanumeric from "validator/lib/isAlphanumeric";
import isEmpty from "validator/lib/isEmpty";
import isLowercase from "validator/lib/isLowercase";
import { useAuthContext } from "../context/Auth";
import { Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useToast, Progress, Button } from "@chakra-ui/react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const StoreRegister = () => {
  const [storeId, setStoreId] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [storeProfilePicture, setStoreProfilePicture] = useState("");
  const [fileUpload, setFileUpload] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const { isAuth, setIsLocalStorageUpdated } = useAuthContext();

  const router = useRouter();
  const { push } = router;

  const toast = useToast();

  const callToast = (title, description, status) => {
    return toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  const checkIfUserAlreadyHasAStore = () => {
    return getUserInfo().store ? true : false;
  };

  const uploadFile = async () => {
    if (!fileUpload) return;

    const metadata = {
      contentType: "image/jpeg",
    };

    const storageRef = ref(storage, "storeProfilePicture/" + fileUpload.name);
    const uploadTask = uploadBytesResumable(storageRef, fileUpload, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressValue(progress);
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
          setStoreProfilePicture(downloadURL);
        });
      }
    );
  };

  const checkIsFormError = () => {
    if (isEmpty(storeId) || isEmpty(storeName) || !isAlphanumeric(storeId) || !isLowercase(storeId) || isEmpty(storeLocation) || isEmpty(storeProfilePicture)) {
      return true;
    } else {
      return false;
    }
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      // if input == empty string, return
      // if (isEmpty(storeId) || isEmpty(storeName)) {
      //   callToast("Error", "Isi Form Dengan Lengkap !", "error");
      //   return;
      // }

      // // if input is not alpahnumeric, return
      // if (!isAlphanumeric(storeId)) {
      //   callToast("Error", "Id hanya terdiri dari huruf,angka,dan tanpa spasi", "error");
      //   return;
      // }

      // // if id input is not a lowercase, return
      // if (!isLowercase(storeId)) {
      //   callToast("Error", "id harus huruf kecil", "error");
      //   return;
      // }

      const docRef = doc(db, "stores", storeId);
      const docSnap = await getDoc(docRef);
      // if doc exists then there is the same id, return
      if (docSnap.exists()) {
        callToast("Error", "Id yang sama sudah digunakan", "error");
        return;
      }

      const q = query(collection(db, "stores"), where("name", "==", storeName));
      const querySnapshot = await getDocs(q);
      // if query success then there is the same store name, return
      if (querySnapshot.docs[0]) {
        callToast("Error", "Nama toko sudah digunakan, buat nama lain", "error");
        return;
      }

      // set doc
      const { uid, username, email, profilePicture } = getUserInfo();
      await setDoc(docRef, {
        name: storeName,
        owner: uid,
        location: storeLocation,
        profilePicture: storeProfilePicture,
      });

      // update user doc
      await updateDoc(doc(db, "users", uid), {
        store: storeId,
      });

      // update store to local storage
      const updatedLocalStorage = { uid, username, email, profilePicture, store: storeId };
      localStorage.setItem("auth", JSON.stringify(updatedLocalStorage));
      setIsLocalStorageUpdated(true);

      callToast("Berhasil", "Toko berhasil dibuat", "success");

      push(`${storeId}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isAuth) {
      // alert("Login Terlebih dahulu")
      push("/");
    }

    if (checkIfUserAlreadyHasAStore()) {
      push("/");
      return (
        // alert("User ini sudah memiliki toko dengan id terkait")
        null
      );
    }
  }, []);

  return (
    <div className="w-[90%] max-w-sm m-auto mt-8 bg-white border border-gray-200 rounded-lg shadow p-4">
      <div className="flex justify-end px-4 pt-4"></div>
      <div className="flex flex-col items-center pb-10">
        <h5 className="mb-1 text-xl font-medium text-gray-900 ">Daftarkan Toko Anda</h5>
        <div className="flex mt-4 md:mt-6">
          <Dialog.Root>
            <Dialog.Trigger>
              <Button colorScheme="green" padding=".5rem">
                Daftar
              </Button>
            </Dialog.Trigger>

            <Dialog.Content style={{ maxWidth: 450 }}>
              <Dialog.Title>Daftarkan Toko Anda</Dialog.Title>
              <Dialog.Description size="2" mb="4">
                Isi Form Berikut.
              </Dialog.Description>
              <Flex direction="column" gap="3">
                {/* Input Id toko */}
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Id Toko
                  </Text>
                  <TextField.Input placeholder="Buat Id untuk toko anda" onChange={(e) => setStoreId(e.target.value)} />
                  <span className="label-text-alt">Id hanya berupa huruf kecil,angka ,dan tanpa spasi</span>
                </label>

                {/* Input nama toko*/}
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Nama Toko
                  </Text>
                  <TextField.Input placeholder="Masukkan nama toko anda" onChange={(e) => setStoreName(e.target.value)} />
                </label>

                {/* Input nama toko*/}
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Lokasi Toko
                  </Text>
                  <TextField.Input placeholder="Masukkan lokasi toko anda" onChange={(e) => setStoreLocation(e.target.value)} />
                </label>

                {/* Input File */}
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Gambar Produk
                  </Text>
                  <div className="flex justify-between items-center">
                    <input type="file" className="file-input file-input-bordered file-input-sm" onChange={(e) => setFileUpload(e.target.files[0])} />
                    <button className={`ml-2 btn btn-sm bg-slate-800 text-base-300  hover:text-slate-800 ${fileUpload ? "" : "cursor-not-allowed opacity-50"}`} onClick={uploadFile}>
                      upload
                    </button>
                  </div>
                </label>

                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    {progressValue == 100 ? "Gambar sukses diupload" : "Upload File dulu"}
                  </Text>
                  <Progress value={progressValue} />
                </label>
              </Flex>

              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Close
                  </Button>
                </Dialog.Close>

                <Dialog.Close>
                  <button className={`bg-[#edf2f7] font-semibold px-3 rounded ${checkIsFormError() ? "cursor-not-allowed opacity-50" : ""}`} disabled={checkIsFormError() ? true : false} onClick={onSubmit}>
                    Save
                  </button>

                  {/* <button className={`bg-[#edf2f7] font-semibold px-3 rounded ${checkIsFormError() && !productData ?  "cursor-not-allowed opacity-50" : ""}`} disabled={checkIsFormError() && !productData ? true : false} onClick={productData ? updateProduct : addToDB}> */}
                  {/* Save
            </button> */}
                </Dialog.Close>
                {/* <button onClick={() => console.log(checkIsFormError())}>test</button> */}
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
};

export default StoreRegister;
