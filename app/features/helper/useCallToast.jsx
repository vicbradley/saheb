const useCallToast = (toast, title, description, status) => {
  return toast({
    title,
    description,
    status,
    duration: 5000,
    isClosable: true,
  });
}

export default useCallToast;
