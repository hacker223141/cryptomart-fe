import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useEthereum } from "../contexts/MetamaskProvider";
import { api, vendorCryptoAddress } from "../constants";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link, Textarea } from "@nextui-org/react";





function ProductCard({ id, url, name, price, }) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [transactionAddress, setTransactionAddress] = useState('');
  const [deliveryAdderss, setDeliveryAdderss] = useState('');
  const [phone, setPhone] = useState('');

  const { eth } = useEthereum();
  const snackbar = useSnackbar();

  const buyProduct = async () => {
    if (!eth) {
      enqueueSnackbar("Install A wallet.", { variant: "error" });
      return;
    }
    try {


      if (!eth.isConnected()) {
        await requestWalletConnection();
        if (!eth.isConnected()) {
          enqueueSnackbar("Denied wallet access.", { variant: "error" });
          return;
        }
      }
      const from = (await eth.request({ method: "eth_requestAccounts" }))[0];
      console.log('0x' + (price * 10 ** 18).toString('16'));
      const params = [
        {
          from,
          to: vendorCryptoAddress,
          // 30400
          // gas: "0x76c0",
          // // 10000000000000
          // gasPrice: "0x9184e72a000",
          // // 2441406250
          value: '0x' + (price * 10 ** 18).toString('16'),
          // data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
        },
      ];

      console.log(params);

      const TxID = await eth.request({
        method: "eth_sendTransaction",
        params
      })

      setTransactionAddress(TxID);
      // openPopup();
      onOpen();
    } catch (err) {
      enqueueSnackbar("Transaction Canceled.", { variant: "warning" });
    }
  }

  const requestWalletConnection = async () => {
    try {
      snackbar.enqueueSnackbar("requesting wallet.");
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      if (accounts.length == 0) {
        snackbar.enqueueSnackbar("no accounts selected.", { variant: "warning" });
        return;
      }

      snackbar.enqueueSnackbar(`will use ${accounts[0]}`, { variant: "success" });
      const wei_hex = await eth.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      });
      const eth_bal = (parseInt(wei_hex, 16) / 10 ** 18).toFixed(4);

      setBalance(eth_bal + " ETH");
    } catch (err) {
      snackbar.enqueueSnackbar(`wallet denied`, { variant: "error" });
    }
  }



  const makeOrder = async () => {
    try {
      const res = await api.makeOrder(id, deliveryAdderss, transactionAddress, phone);
      console.log('res', res);
      if (res.error) {
        snackbar.enqueueSnackbar("Something went wrong ,email us your transaction id ", { variant: 'error' });
        setTimeout(() => snackbar.enqueueSnackbar(`TxID : ${transactionAddress}`, { variant: 'info' }), 300);
      } else {
        snackbar.enqueueSnackbar("Payment Successfull", { variant: 'success' });
        setTimeout(() => snackbar.enqueueSnackbar("We will reach to you soon"), 200)
        setTimeout(() => snackbar.enqueueSnackbar(`TxID : ${transactionAddress}`, { variant: 'info' }), 300)
      }
    } catch (err) {
      console.log(err);
      snackbar.enqueueSnackbar("Something went wrong ,email us your transaction id ", { variant: 'error' });
      setTimeout(() => snackbar.enqueueSnackbar(`TxID : ${transactionAddress}`, { variant: 'info' }), 300)
    }
  }

  return (
    <div>

      {/* MODAL */}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <p className="text-green-700 mb-4 text-[0.65rem] select-all">REF : {transactionAddress}</p>

                <label>
                  <p className="text-white mb-4 text-lg">Phone Number</p>
                  <Input placeholder="Your Phone Number" type="tel" onChange={(e) => { setPhone(e.target.value); }} />
                </label>

                <label>
                  <p className="text-white mb-4 text-lg">Shipping Address</p>
                  <Textarea placeholder="Your Shipping Address Here" onChange={(e) => { setDeliveryAdderss(e.target.value); }} />
                </label>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={() => { makeOrder(); onClose(); }}>
                  Done
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>


      {/* Content */}
      <div className="w-[300px] flex flex-col h-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800/70 blur-bg dark:border-gray-700 mx-auto">
        <img
          className="p-8 rounded-t-lg my-auto object-contain"
          src={url}
          alt="product image"
        />
        <div className="px-5 pb-5">
          <a href="#">
            <h5 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
              {name}
            </h5>
          </a>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {price} ETH
            </span>
            <button onClick={buyProduct} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
