import { AlertDialog, Flex } from "@radix-ui/themes";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { useToast, Button } from "@chakra-ui/react";

const DeleteProductBtn = (props) => {
  const {productId, productName} = props;
  const toast = useToast();

  const handleDelete = async () => {
    await deleteDoc(doc(db, "products", productId));
    toast({
      title: "Success",
      description: `${productName} berhasil dihapus dari daftar produk`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        {/* <Button color="red">Delete</Button> */}
        <Button colorScheme='red'>Delete</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Hapus {productName} ?</AlertDialog.Title>
        <AlertDialog.Description size="2">Apa kamu yakin? Data produk akan dihapus secara permanen</AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default DeleteProductBtn;
