import Web3 from 'web3'
import { newKitFromWeb3 } from '@celo/contractkit'
import documentRegistryAbi from '../contract/documentRegistry.abi.json'
import { sha3_256 } from 'js-sha3'

//deployed CA
const documentRegistryContractAddress = "0xd66dcd42A1A68B3db04A497e3E1Ac30fEa8ee84b"

let contract
let kit

const connectCeloWallet = async function () {
    if (window.celo) {
        notificationInfo("⚠️ Please approve this DApp to use it.")
      try {
        await window.celo.enable()

        const web3 = new Web3(window.celo)
        kit = newKitFromWeb3(web3)
  
        const accounts = await kit.web3.eth.getAccounts()
        kit.defaultAccount = accounts[0]
        
        contract = new kit.web3.eth.Contract(documentRegistryAbi, documentRegistryContractAddress)
        successInfo("Connected Successfully")
      } catch (error) {
        showError(`⚠️ ${error}.`)
      }
    } else {
      notificationInfo("⚠️ Please install the CeloExtensionWallet.")
    }
}

$('#linkHome').click(function() { showView("viewHome") });
$('#linkSubmitDocument').click(function() { showView("viewSubmitDocument") });
$('#linkVerifyDocument').click(function() { showView("viewVerifyDocument") });


$('#contractLink').text(documentRegistryContractAddress);
$('#contractLink').attr('href', `https://alfajores-blockscout.celo-testnet.org/address/${documentRegistryContractAddress}/transactions`);
    
// Attach AJAX "loading" event listener
$(document).on({
    ajaxStart: function() { $("#loadingBox").show() },
    // ajaxStop: function() { $("#loadingBox").hide() }    
});

function showView(viewName) {
    // Hide all views and show the selected view only
    $('main > section').hide();
    $('#' + viewName).show();
}

function notificationInfo(message) {
    $('#errorBox').hide();
    $('#infoBox').hide();
    $('#loadingBox>p').html(message);
    $('#loadingBox').show();
    $('#loadingBox>header').click(function(){ $('#loadingBox').hide(); });
}

function successInfo(message) {
    $('#loadingBox').hide();
    $('#errorBox').hide();
    $('#infoBox>p').html(message);
    $('#infoBox').show();
    $('#infoBox>header').click(function(){ $('#infoBox').hide(); });
}

function showError(errorMsg) {
    $('#loadingBox').hide();
    $('#infoBox').hide();
    $('#errorBox>p').html("Error: " + errorMsg);
    $('#errorBox').show();
    $('#errorBox>header').click(function(){ $('#errorBox').hide(); });
}

document.querySelector("#documentUploadButton").addEventListener("click", async (e) => {
    if ($('#documentForUpload')[0].files.length == 0){
        return showError("Please select a file to upload.");
    }
    notificationInfo(`Generating Document Hash`);
    let fileReader = new FileReader();
    fileReader.onload = async function() {
        let documentHash = sha3_256(fileReader.result);
        $('#documentForUpload').val('')
        notificationInfo(`Adding ${documentHash.toString().slice(0,20)}... to the registry.`);
        try {
            const result = await contract.methods
              .add(documentHash)
              .send({ from: kit.defaultAccount })
              successInfo(`Document ${documentHash.toString().slice(0,20)}... <b>successfully added</b> to the registry.`);
          } catch (error) {
            showError(`⚠️ Smart contract call failed ${error}.`)
          }
    }
    fileReader.readAsBinaryString($('#documentForUpload')[0].files[0]);
})

document.querySelector("#documentVerifyButton").addEventListener("click", async (e) => {
    if ($('#documentToVerify')[0].files.length == 0){
        return showError("Please select a file to verify.");
    }
    notificationInfo(`Generating Document Hash`);
    let _fileReader = new FileReader();
    _fileReader.onload = async function() {
        const _documentHash = sha3_256(_fileReader.result);
        $('#documentToVerify').val('')
        try {
            const contractPublishDate = await contract.methods.verify(_documentHash).call()
            if(contractPublishDate > 0) {
                let displayDate = new Date(contractPublishDate * 1000).toLocaleString();
                successInfo(`Document ${_documentHash.toString().slice(0,20)}... is <b>valid<b>, date published: ${displayDate}`);
            } else {
                showError(`Document ${_documentHash.toString().slice(0,20)}... is <b>invalid</b>: not found in the registry.`);
            }
        } catch (error) {
            showError(`⚠️ Smart contract call failed ${error}.`)
        }
    }
    _fileReader.readAsBinaryString($('#documentToVerify')[0].files[0]);
});

window.addEventListener('load', async () => {
    notificationInfo("⌛ Loading...")
    await connectCeloWallet()
});
  

