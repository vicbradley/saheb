// Form.jsx
"use client";
import { Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useToast, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Button } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useCreateProduct } from "@/app/features/store/useCreateProduct";
import { useEditProduct } from "@/app/features/store/useEditProduct";
import useCallToast from "@/app/features/helper/useCallToast";
import FileUpload from "@/app/components/FileUpload";
import { getUserInfo } from "@/app/logic/getUserInfo";

const Form = ({ formTitle, productData, storeData }) => {
  const toast = useToast();
  const {uid} = getUserInfo();
  const { mutate: createProduct } = useCreateProduct();
  const { mutate: editProduct } = useEditProduct(productData?.id);

  const formik = useFormik({
    initialValues: {
      name: productData ? productData.name : "",
      desc: productData ? productData.desc : "",
      price: productData ? productData.price : 1,
      stock: productData ? productData.stock : 1,
      image: productData ? productData.image : "",
      fileUpload: "",
      progressValue: 0,
    },
    onSubmit: async (values, { resetForm }) => {
      const { name, desc, price, stock, image } = values;

      if (productData) {
        editProduct({
          name,
          desc,
          price: parseInt(price),
          stock: parseInt(stock),
          image,
          storeId: storeData.id,
          storeName: storeData.name,
          uid,
        });
        useCallToast(toast, "Produk berhasil diperbarui", `${name} berhasil diperbarui`, "success");
      } else {
        createProduct({
          name,
          desc,
          price: parseInt(price),
          stock: parseInt(stock),
          image,
          storeId: storeData.id,
          storeName: storeData.name,
          uid
        });
        useCallToast(toast, "Produk berhasil ditambahkan", `${name} ditambahkan ke daftar produk`, "success");
        resetForm();
      }
    },
  });

  const checkIsFormError = () => {
    const { name, desc, price, stock, image, fileUpload } = formik.values;
    return !name || !desc || price < 1 || stock < 1 || !image || !fileUpload;
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {formTitle === "Tambah" ? (
          <button className="btn ml-auto text-[#001a9d] text-xs" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
            </svg>
            Tambah Produk
          </button>
        ) : (
           <p className="font-bold text-blue-600  hover:underline cursor-pointer">{formTitle}</p> 
        )}
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>{formTitle} Produk</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Isi Form Berikut.
        </Dialog.Description>
        <form onSubmit={formik.handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Nama Produk
              </Text>
              <TextField.Input name="name" placeholder="Masukkan Nama Produk" value={formik.values.name} onChange={formik.handleChange} />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Harga Produk
              </Text>
              <NumberInput min={1} name="price" value={formik.values.price} onChange={(value) => formik.setFieldValue("price", value)}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Stok Produk
              </Text>
              <NumberInput min={1} name="stock" value={formik.values.stock} onChange={(value) => formik.setFieldValue("stock", value)}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Deskripsi Produk
              </Text>
              <TextField.Input placeholder="Masukkan Deskripsi Produk" name="desc" value={formik.values.desc} onChange={formik.handleChange} />
            </label>
            <FileUpload formik={formik} folderName="products/" labelText="Gambar Produk" />
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button type="button" variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <button type="submit" className={`bg-[#edf2f7] font-semibold px-3 rounded ${checkIsFormError() && !productData ? "cursor-not-allowed opacity-50" : ""}`} disabled={checkIsFormError() && !productData ? true : false}>
                Save
              </button>
            </Dialog.Close>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default Form;
