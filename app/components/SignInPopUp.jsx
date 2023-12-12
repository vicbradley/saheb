"use client";
import { AlertDialog, Flex } from "@radix-ui/themes";
import { Button } from "@chakra-ui/react";
import { useAuthContext } from "../context/Auth";
import { signInWithGoogle } from "../auth/signInWithGoogle";

const SignInPopUp = (props) => {
  const { setIsAuth } = useAuthContext();

  const handleSignIn = async () => {
    (await signInWithGoogle()) ? setIsAuth(true) : setIsAuth(false);
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
          <Button color="#001a9d">{props.text}</Button>
      </AlertDialog.Trigger>

      <AlertDialog.Content style={{ maxWidth: 350 }}>
        <AlertDialog.Title>Please Sign In First</AlertDialog.Title>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="#001a9d" onClick={handleSignIn}>
              Sign In Now
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default SignInPopUp;
