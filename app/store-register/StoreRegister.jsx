"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "../logic/getUserInfo";
import isAlphanumeric from "validator/lib/isAlphanumeric";
import isEmpty from "validator/lib/isEmpty";
import isLowercase from "validator/lib/isLowercase";
import { useAuthContext } from "../context/Auth";
import { Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useToast, Button } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useCreateStore } from "../features/store/useCreateStore";
import FileUpload from "../components/FileUpload";

const StoreRegister = () => {
  const { isAuth, setIsLocalStorageUpdated } = useAuthContext();

  const router = useRouter();
  const { push } = router;

  const toast = useToast();

  const { mutate: createStore } = useCreateStore({
    onSuccess: () => {
      formik.resetForm();

      const { uid, username, email, profilePicture } = getUserInfo();

      const accessToken = JSON.parse(localStorage.getItem("auth")).accessToken;

      localStorage.removeItem("auth");

      const updatedLocalStorage = { uid, username, email, profilePicture, store: formik.values.storeId, accessToken };
      localStorage.setItem("auth", JSON.stringify(updatedLocalStorage));
      setIsLocalStorageUpdated(true);

      toast({
        status: "success",
        title: "Success",
        description: "Toko berhasil dibuat",
      });

      push(`${formik.values.storeId}/dashboard`);
    },
    onError: (error) => {
      toast({
        status: "error",
        title: "Error",
        description: error.response.data,
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      storeId: "",
      storeName: "",
      storeLocation: "",
      fileUpload: null,
      storeProfilePicture: "",
      progressValue: 0,
    },

    onSubmit: async () => {
      const { storeId, storeName, storeLocation, storeProfilePicture } = formik.values;

      createStore({
        storeId,
        storeName,
        ownerId: getUserInfo().uid,
        storeLocation,
        storeProfilePicture,
      });
    },
  });

  const checkIsFormError = () => {
    const { storeId, storeName, storeLocation, storeProfilePicture } = formik.values;

    if (isEmpty(storeId) || isEmpty(storeName) || !isAlphanumeric(storeId) || !isLowercase(storeId) || isEmpty(storeLocation) || isEmpty(storeProfilePicture)) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (!isAuth) return push("/");

    if (getUserInfo().store) return push("/");
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
              <form onSubmit={formik.handleSubmit}>
                <Flex direction="column" gap="3">
                  {/* Input Id toko */}
                  <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Id Toko
                    </Text>
                    <TextField.Input name="storeId" placeholder="Buat Id untuk toko anda" value={formik.values.storeId} onChange={formik.handleChange} />
                    <span className="label-text-alt">Id hanya berupa huruf kecil,angka ,dan tanpa spasi</span>
                  </label>

                  {/* Input nama toko*/}
                  <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Nama Toko
                    </Text>
                    <TextField.Input name="storeName" placeholder="Masukkan nama toko anda" value={formik.values.storeName} onChange={formik.handleChange} />
                  </label>

                  {/* Input lokasi toko*/}
                  <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Lokasi Toko
                    </Text>
                    <TextField.Input name="storeLocation" placeholder="Masukkan lokasi toko anda" value={formik.values.storeLocation} onChange={formik.handleChange} />
                  </label>

                  {/* Foto profile toko */}
                  <FileUpload formik={formik} folderName="storeProfilePicture/" labelText="Profile Picture Toko" />
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button type="button" variant="soft" color="gray">
                      Close
                    </Button>
                  </Dialog.Close>

                  <Dialog.Close>
                    <button type="submit" className={`bg-[#edf2f7] font-semibold px-3 rounded ${checkIsFormError() ? "cursor-not-allowed opacity-50" : ""}`} disabled={checkIsFormError() ? true : false}>
                      Save
                    </button>
                  </Dialog.Close>
                </Flex>
              </form>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
};

export default StoreRegister;
