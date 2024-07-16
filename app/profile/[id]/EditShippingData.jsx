import { useEffect } from "react";
import { Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useToast, Button, InputGroup, Input, InputLeftAddon } from "@chakra-ui/react";
import { getUserInfo } from "@/app/logic/getUserInfo";
import useCallToast from "@/app/features/helper/useCallToast";
import { useFormik } from "formik";
import { useEditUser } from "@/app/features/user/useEditUser";
import { useFetchUser } from "@/app/features/user/useFetchUser";
import Loading from "@/app/components/Loading";

const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-digit characters
  let cleaned = ("" + phoneNumber).replace(/\D/g, "");

  // Check if the phone number starts with "0"
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }

  // Remove "62" prefix if present
  if (cleaned.startsWith("62")) {
    cleaned = cleaned.substring(2);
  }

  return cleaned;
};

const formatPhoneNumberForDatabase = (phoneNumber) => {
  // Ensure the phone number starts with "+62-"
  let cleaned = ("" + phoneNumber).replace(/\D/g, "");

  // Check if the phone number starts with "0"
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }

  // Remove "62" prefix if present
  if (cleaned.startsWith("62")) {
    cleaned = cleaned.substring(2);
  }

  return `+62-${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
};

export default function EditShippingData() {
  const { uid } = getUserInfo();
  const { data: userData, isLoading } = useFetchUser(uid);

  const toast = useToast();
  const { mutate: editUser } = useEditUser(uid);

  const formik = useFormik({
    initialValues: {
      newAddress: "",
      newPhoneNumber: "",
    },
    onSubmit: async (values) => {
      const { newAddress, newPhoneNumber } = values;

      // Manual validation
      if (!newAddress || !newPhoneNumber) {
        useCallToast(toast, "Error", "All fields are required", "error");
        return;
      }

      // Format phone number for database
      const formattedPhoneNumberForDB = formatPhoneNumberForDatabase(newPhoneNumber);

      editUser({
        newAddress,
        newPhoneNumber: formattedPhoneNumberForDB,
      });

      useCallToast(toast, "Success", "Profile berhasil diupdate", "success");
    },
  });

  useEffect(() => {
    if (userData) {
      // Remove "+62-" prefix if present
      const formattedPhoneNumber = formatPhoneNumber(userData.phoneNumber);
      formik.setValues({
        newAddress: userData.address || "",
        newPhoneNumber: formattedPhoneNumber,
      });
    }
  }, [userData]);

  if (isLoading) return <Loading />;

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button className="text-white bg-[#001a9d] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Update Data Pengiriman</button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Update Profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Isi Form Berikut.
        </Dialog.Description>
        <form onSubmit={formik.handleSubmit}>
          <Flex direction="column" gap="3">
            {/* Input Address */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Alamat Pengiriman
              </Text>
              <TextField.Input name="newAddress" placeholder="Alamat" value={formik.values.newAddress} onChange={formik.handleChange} />
            </label>

            {/* Input Phone Number */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Nomor Telepon
              </Text>
              <InputGroup>
                <InputLeftAddon>+62</InputLeftAddon>
                <Input name="newPhoneNumber" value={formik.values.newPhoneNumber} onChange={formik.handleChange} type="tel" placeholder="Nomor Telepon" pattern="[0-9]*" inputMode="numeric" />
              </InputGroup>
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>

            <Button type="submit">Update</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
