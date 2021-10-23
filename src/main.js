import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import documentRegistryAbi from "../contract/documentRegistry.abi.json";
import erc20Abi from "../contract/erc20.abi.json";
import { sha3_256 } from "js-sha3";

//deployed CA
const documentRegistryContractAddress =
  "0xdDb0BE6f1992B355De9F4FD64870Df9d30C9d182";

const cUSDContractAddress = 
  "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

let contract;
let kit;
let isOwner;
let isAdmin;
let docsInRegistry;

async function checkAdmin() {
  isOwner = await contract.methods.isOwner().call();
  isAdmin = await contract.methods.isAdmin().call();
  console.log(docsInRegistry)
  if(isOwner){
    $("#linkAddAdmin").removeClass("hide")
  }
}

async function getNoOfDocs() {
  docsInRegistry = await contract.methods.getNoOfDocs().call();   
  // show number of docs in front end
  $("#docsInRegistry").text(docsInRegistry);
}

const connectCeloWallet = async function () {
  //connect to celo blockchain
  if (window.celo) {
    notificationInfo("⚠️ Please approve this DApp to use it.");
    try {
      await window.celo.enable();

      const web3 = new Web3(window.celo);
      kit = newKitFromWeb3(web3);

      const accounts = await kit.web3.eth.getAccounts();
      kit.defaultAccount = accounts[0];

      contract = new kit.web3.eth.Contract(
        documentRegistryAbi,
        documentRegistryContractAddress
      );
      successInfo("Connected Successfully");
    } catch (error) {
      showError(`⚠️ ${error}.`);
    }
  } else {
    notificationInfo("⚠️ Please install the CeloExtensionWallet.");
  }
};

async function approve(_amount) {
  //approve function for payments
  const cUSDContract = new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)

  const result = await cUSDContract.methods
    .approve(documentRegistryContractAddress, _amount)
    .send({ from: kit.defaultAccount })
  return result
}

$("#linkHome").click(function () {
  showView("viewHome");
});
$("#linkSubmitDocument").click(function () {
  showView("viewSubmitDocument");
});
$("#linkVerifyDocument").click(function () {
  showView("viewVerifyDocument");
});
$("#linkAddAdmin").click(function () {
  showView("addNewAdmin");
});


// Show contract link in front end
$("#contractLink").text(documentRegistryContractAddress);
$("#contractLink").attr(
  "href",
  `https://alfajores-blockscout.celo-testnet.org/address/${documentRegistryContractAddress}/transactions`
);




// Attach AJAX "loading" event listener
$(document).on({
  ajaxStart: function () {
    $("#loadingBox").show();
  },
  // ajaxStop: function() { $("#loadingBox").hide() }
});

function showView(viewName) {
  // Hide all views and show the selected view only
  $("main > section").hide();
  $("#" + viewName).show();
}

function notificationInfo(message) {
  //handles notification message rendering
  $("#errorBox").hide();
  $("#infoBox").hide();
  $("#loadingBox>p").html(message);
  $("#loadingBox").show();
  $("#loadingBox>header").click(function () {
    $("#loadingBox").hide();
  });
}

function successInfo(message) {
  //handles success message rendering
  $("#loadingBox").hide();
  $("#errorBox").hide();
  $("#infoBox>p").html(message);
  $("#infoBox").show();
  $("#infoBox>header").click(function () {
    $("#infoBox").hide();
  });
}

function showError(errorMsg) {
  //handles error message rendering
  $("#loadingBox").hide();
  $("#infoBox").hide();
  $("#errorBox>p").html("Error: " + errorMsg);
  $("#errorBox").show();
  $("#errorBox>header").click(function () {
    $("#errorBox").hide();
  });
}

document
  .querySelector("#documentUploadButton")
  .addEventListener("click", async (e) => {
    //function checks if user is admin, as they are the only one who is allowed to add to registry
    if(!isOwner){
      return showError("Only Admins are allowed to upload to the Registry")
    }
    if ($("#documentForUpload")[0].files.length == 0) {
      return showError("Please select a file to upload.");
    }
    notificationInfo(`Generating Document Hash`);
    let fileReader = new FileReader();
    fileReader.onload = async function () {
      let documentHash = sha3_256(fileReader.result);
      $("#documentForUpload").val("");
      notificationInfo(
        `Adding ${documentHash.toString().slice(0, 20)}... to the registry.`
      );
      try {
        const result = await contract.methods
          .add(documentHash)
          .send({ from: kit.defaultAccount });
        successInfo(`Document <b>successfully added</b> to the registry. 
                Below is your document hash ${documentHash.toString()} 
              `);
        getNoOfDocs();
      } catch (error) {
        showError(`⚠️ Smart contract call failed ${error}.`);
      }
    };
    fileReader.readAsBinaryString($("#documentForUpload")[0].files[0]);
});

document
  .querySelector("#documentVerifyButton")
  .addEventListener("click", async (e) => {
    //verification button,
    if ($("#documentToVerify")[0].files.length == 0) {
      return showError("Please select a file to verify.");
    }

    let _fileReader = new FileReader();
    _fileReader.onload = async function () {
      const _documentHash = sha3_256(_fileReader.result);
      $("#documentToVerify").val("");

      if (!isAdmin) {
        // checks if user is admin, then charges them the verification fee if they are not an admin
        try {
          //approve function call for payment
          const verificationAmount = await contract.methods.getVerificationAmount().call();
          notificationInfo(`⌛ Waiting for transaction approval`);
          await approve(verificationAmount)
          successInfo('Approved')
        }catch{ 
          return showError("Please approve transaction to continue verification.");
        } 

        try {
          // making the payments function
          notificationInfo(`⌛ Awaiting payment confirmation`);
          const result = await contract.methods
            .payVerificationFee()
            .send({ from: kit.defaultAccount });
          successInfo('Payment Confirmed')
        }catch{
          return showError("Payment not completed")
        }
      }

      try {
        //contract call to get the date
        notificationInfo(`Generating Document Hash`);
        const contractPublishDate = await contract.methods
          .verify(_documentHash).call()
        console.log(contractPublishDate)
          
        if (contractPublishDate > 0) {
          let displayDate = new Date(
            contractPublishDate * 1000
          ).toLocaleString();
          successInfo(
            `Document ${_documentHash
              .toString()
              .slice(0, 20)}... is <b>valid<b>, date published: ${displayDate}`
          );
        } else {
          showError(
            `Document ${_documentHash
              .toString()
              .slice(0, 20)}... is <b>invalid</b>: not found in the registry.`
          );
        }
      } catch (error) {
        showError(`⚠️ Smart contract call failed ${error}.`);
      }
    };
    _fileReader.readAsBinaryString($("#documentToVerify")[0].files[0]);
});

document
  .querySelector("#addAdminButton")
  .addEventListener("click", async (e) => {
    // add admin button function
    const newAddress = document.querySelector("#newAdmin")

    if (newAddress.value == null || newAddress.value.length < 42) {
      // checks if input entered is null and the length is equal to the standard contract address value
      return showError("Please enter a valid address.");
    }
  
    notificationInfo(`Granting ${newAddress} access to contract`);
    $("#newAdmin").val = ""
    try {
      const result = await contract.methods
        .makeAdmin(newAddress)
        .send({ from: kit.defaultAccount });
      successInfo(`Access granted to ${newAddress}`);
      } catch (error) {
        showError(`⚠️ Smart contract call failed ${error}.`);
      }   

});


window.addEventListener("load", async () => {
  notificationInfo("⌛ Loading...");
  await connectCeloWallet();
  checkAdmin();
  getNoOfDocs();
});
