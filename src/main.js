import Web3 from 'web3'
import { newKitFromWeb3 } from '@celo/contractkit'
import documentRegistryAbi from '../contract/documentRegistry.abi.json'

//deployed CA
const documentRegistryContractAddress = "0xbfe77c0d3488f5FFAbce1508227c2537674A7DbD"

const connectCeloWallet = async function () {
    if (window.celo) {
        showInfo("⚠️ Please approve this DApp to use it.")
      try {
        await window.celo.enable()

        const web3 = new Web3(window.celo)
        kit = newKitFromWeb3(web3)
  
        const accounts = await kit.web3.eth.getAccounts()
        kit.defaultAccount = accounts[0]
        
        contract = new kit.web3.eth.Contract(documentRegistryAbi, documentRegistryContractAddress)
  
      } catch (error) {
        showError(`⚠️ ${error}.`)
      }
    } else {
      showInfo("⚠️ Please install the CeloExtensionWallet.")
    }
}

$('#linkHome').click(function() { showView("viewHome") });
$('#linkSubmitDocument').click(function() { showView("viewSubmitDocument") });
$('#linkVerifyDocument').click(function() { showView("viewVerifyDocument") });
$('#documentUploadButton').click(uploadDocument);
$('#documentVerifyButton').click(verifyDocument);

$('#contractLink').text(documentRegistryContractAddress);
$('#contractLink').attr('href', `https://alfajores-blockscout.celo-testnet.org/address/${documentRegistryContractAddress}/transactions`);
    
// Attach AJAX "loading" event listener
$(document).on({
    ajaxStart: function() { $("#loadingBox").show() },
    ajaxStop: function() { $("#loadingBox").hide() }    
});

function showView(viewName) {
    // Hide all views and show the selected view only
    $('main > section').hide();
    $('#' + viewName).show();
}

function showInfo(message) {
    $('#infoBox>p').html(message);
    $('#infoBox').show();
    $('#infoBox>header').click(function(){ $('#infoBox').hide(); });
}

function showError(errorMsg) {
    $('#errorBox>p').html("Error: " + errorMsg);
    $('#errorBox').show();
    $('#errorBox>header').click(function(){ $('#errorBox').hide(); });
}

async function uploadDocument() {

}

async function verifyDocument() {

    
}

window.addEventListener('load', async () => {
    showInfo("⌛ Loading...")
    await connectCeloWallet()
});
  

