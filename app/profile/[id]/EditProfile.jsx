"use client";
import { Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useToast, Button } from "@chakra-ui/react";
import { useAuthContext } from "@/app/context/Auth";
import { getUserInfo } from "@/app/logic/getUserInfo";
import useCallToast from "@/app/features/helper/useCallToast";
import { useFormik } from "formik";
import { useEditUser } from "@/app/features/user/useEditUser";
import FileUpload from "@/app/components/FileUpload";

export default function EditProfile() {
  const { isLocalStorageUpdated, setIsLocalStorageUpdated } = useAuthContext();
  const { uid, username, profilePicture, email, store } = getUserInfo();

  const toast = useToast();

  const { mutate: editUser } = useEditUser(uid);

  const formik = useFormik({
    initialValues: {
      newUsername: username,
      newProfilePicture: profilePicture,
      fileUpload: "",
      progressValue: 0,
    },

    onSubmit: async () => {
      const { newUsername, newProfilePicture } = formik.values;

      editUser({
        userOldData: {
          username,
          profilePicture,
          uid,
        },
        userNewData: {
          username: newUsername,
          profilePicture: newProfilePicture,
          uid,
        },
      });

      const accessToken = JSON.parse(localStorage.getItem("auth")).accessToken;

      localStorage.removeItem("auth");

      const updatedLocalStorage = {
        uid,
        username: formik.values.newUsername,
        profilePicture: !newProfilePicture ? profilePicture : newProfilePicture,
        email,
        store,
        accessToken,
      };

      formik.resetForm();

      localStorage.setItem("auth", JSON.stringify(updatedLocalStorage));

      useCallToast(toast, "Success", "Profile berhasil diupdate", "success");

      setIsLocalStorageUpdated(isLocalStorageUpdated + 1);
    },
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button className="text-white bg-[#001a9d] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Update Profile</button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Update Profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Isi Form Berikut.
        </Dialog.Description>
        <form onSubmit={formik.handleSubmit}>
          <Flex direction="column" gap="3">
            {/* Input Username */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Username
              </Text>
              <TextField.Input name="newUsername" placeholder="username" value={formik.values.newUsername} onChange={formik.handleChange} />
            </label>

            {/* Input File */}
            <FileUpload formik={formik} folderName="usersProfilePicture/" labelText="Foto Profil User" />
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>

            <Dialog.Close>
              <Button type="submit">Update</Button>
            </Dialog.Close>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
