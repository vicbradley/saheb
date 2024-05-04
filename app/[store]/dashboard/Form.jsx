"use client";
import { Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useToast, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Progress, Button } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useCreateProduct } from "@/app/features/store/useCreateProduct";
import { useEditProduct } from "@/app/features/store/useEditProduct";
import useCallToast from "@/app/features/helper/useCallToast";
import FileUpload from "@/app/components/FileUpload";

const Form = ({ formTitle, productData, storeData }) => {
  const toast = useToast();
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

    onSubmit: async () => {
      const { name, desc, price, stock, image } = formik.values;

      if (productData) {
        editProduct({
          name,
          desc,
          price: parseInt(price),
          stock: parseInt(stock),
          image,
          storeId: storeData.id,
          storeName: storeData.name,
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
        });

        useCallToast(toast, "Produk berhasil ditambahkan", `${name} ditambahkan ke daftar produk`, "success");
      }

      formik.resetForm();
    },
  });


  const checkIsFormError = () => {
    const { name, desc, price, stock, image, fileUpload } = formik.values;

    if (!name || !desc || price < 1 || stock < 1 || !image || !fileUpload) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button type="button" colorScheme="green">
          {formTitle}
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>{formTitle} Produk</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Isi Form Berikut.
        </Dialog.Description>
        <form onSubmit={formik.handleSubmit}>
          <Flex direction="column" gap="3">
            {/* Input Nama Produk */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Nama Produk
              </Text>
              <TextField.Input name="name" placeholder="Masukkan Nama Produk" value={formik.values.name} onChange={formik.handleChange} />
            </label>

            {/* Input Harga Produk */}
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

            {/* Input Stok Produk*/}
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

            {/* Input Deskripsi Produk */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Deskripsi Produk
              </Text>
              <TextField.Input placeholder="Masukkan Deskripsi Produk" name="desc" value={formik.values.desc} onChange={formik.handleChange} />
            </label>

            {/* Input File */}
            <FileUpload formik={formik} folderName="products/" labelText="Gambar Produk"/>
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
