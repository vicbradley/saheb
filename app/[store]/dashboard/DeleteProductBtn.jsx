import { AlertDialog, Flex } from "@radix-ui/themes";
import { useToast, Button } from "@chakra-ui/react";
import { useDeleteProduct } from "@/app/features/store/useDeleteProduct";
import useCallToast from "@/app/features/helper/useCallToast";
import { getUserInfo } from "@/app/logic/getUserInfo";

const DeleteProductBtn = ({ storeId, productId, productName }) => {
  const toast = useToast();
  const { mutate: deleteProduct } = useDeleteProduct(storeId, productId);
  const callToast = useCallToast();

  const handleDelete = async () => {
    deleteProduct({
      storeId,
      uid: getUserInfo().uid
    });

    callToast(toast, "Produk berhasil dihapus", `${productName} berhasil dihapus dari daftar produk`, "success");
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <p className="font-bold text-red-600  hover:underline cursor-pointer">Delete</p>
      </AlertDialog.Trigger>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Hapus {productName} ?</AlertDialog.Title>
        <AlertDialog.Description size="2">Apa kamu yakin? Data produk akan dihapus secara permanen</AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button color="gray">Cancel</Button>
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
