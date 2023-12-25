"use client";
import { useState } from "react";
import { Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useToast, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Progress, Button } from "@chakra-ui/react";
import { getUserInfo } from "../../logic/getUserInfo";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db, storage } from "@/src/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import isEmpty from "validator/lib/isEmpty";

const Form = ({formTitle, productData}) => {
  const toast = useToast();
  const { store } = getUserInfo();
  const [productName, setProductName] = useState(productData ? productData.name : "");
  const [productDesc, setProductDesc] = useState(productData ? productData.desc : "");
  const [productPrice, setProductPrice] = useState(productData ? productData.price : 0);
  const [productStock, setProductStock] = useState(productData ? productData.stock : 0);
  const [productImage, setProductImage] = useState(productData ? productData.image : "");
  const [fileUpload, setFileUpload] = useState("");
  const [progressValue, setProgressValue] = useState(0);

  const callToast = (title, description, status) => {
    return toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  };

  const checkIsFormError = () => {
    if (
      isEmpty(productName) ||
      isEmpty(productDesc) ||
      productPrice < 1 || 
      productStock < 1 || 
      isEmpty(productImage) ||
      (!fileUpload && !productData) 
    ) {
      // return callToast("Error", "Isi Form Dengan Lengkap !", "error");
      return true;
    } else {
      return false;
    }

    // if (productPrice == 0 || productStock == 0) {
    //   return callToast("Error", "Harga dan Stock tidak bisa 0", "error");
    // }
  };

  const getStoreName = async () => {
    try {
      const docRef = doc(db, "stores", store);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().name;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addToDB = async (e) => {
    e.preventDefault();

    if (checkIsFormError()) {
      return;
    }

    const productsCollectionRef = collection(db, "products");

    await addDoc(productsCollectionRef, {
      name: productName,
      desc: productDesc,
      price: productPrice,
      stock: productStock,
      image: productImage,
      storeId: store,
      storeName: await getStoreName(),
    });

    setProductName("");
    setProductDesc("");
    setProductPrice(0);
    setProductStock(0);
    setProductImage();
    setFileUpload(null);
    setProgressValue(0);

    callToast("Produk berhasil ditambahkan", `${productName} ditambahkan ke daftar produk`, "success");
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    if (checkIsFormError()) {
      return;
    }

    const productDoc = doc(db, "products", productData.id);
    await updateDoc(productDoc, {
      name: productName,
      desc: productDesc,
      price: productPrice,
      stock: productStock,
      image: productImage,
      store: store,
    });

    callToast("Produk berhasil diupdate", `${productName} berhasil diupdate`, "success");
  };

  const uploadFile = async () => {
    if (!fileUpload) return;

    const metadata = {
      contentType: "image/jpeg",
    };

    const storageRef = ref(storage, "products/" + fileUpload.name);
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
          setProductImage(downloadURL);
        });
      }
    );
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button colorScheme="green">{formTitle}</Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>{formTitle} Produk</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Isi Form Berikut.
        </Dialog.Description>
        <Flex direction="column" gap="3">
          {/* Input Nama Produk */}
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Nama Produk
            </Text>
            <TextField.Input placeholder="Masukkan Nama Produk" onChange={(e) => setProductName(e.target.value)} value={productName} />
          </label>

          {/* Input Harga Produk */}
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Harga Produk
            </Text>
            <NumberInput onChange={(valueString) => setProductPrice(valueString)} value={productPrice}>
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
            <NumberInput
              onChange={(valueString) => setProductStock(valueString)}
              // value={format(productPrice)}
              value={productStock}
            >
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
            <TextField.Input placeholder="Masukkan Deskripsi Produk" onChange={(e) => setProductDesc(e.target.value)} value={productDesc} />
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
            {/* <Button onClick={productData ? updateProduct : addToDB}>Save</Button> */}
            <button className={`bg-[#edf2f7] font-semibold px-3 rounded ${checkIsFormError() && !productData ?  "cursor-not-allowed opacity-50" : ""}`} disabled={checkIsFormError() && !productData ? true : false} onClick={productData ? updateProduct : addToDB}>
              Save
            </button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default Form;
