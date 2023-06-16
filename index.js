import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const getBalance = document.getElementById("getBalance")
const withdrawButton = document.getElementById("withdrawButton")
withdrawButton.onclick = withdraw
connectButton.onclick = connect
fundButton.onclick = fund
getBalance.onclick = checkBalance
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log("metamask detected!")
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "connected"
        console.log("wallet connected succesfully")
    } else {
        connectButton.innerHTML = "please install metamask"
    }
}

async function fund() {
    console.log(`funding the contract with ${ethAmount}`)
    ethAmount = document.getElementById("ethAmount").value
    if (typeof window.ethereum !== "undefined") {
        //we need  a provider or a connection to the blockchain
        //we need a signer to authorize transactions
        //we need the contract that we'll be interacting with
        //the abi and the address of the contract
        const provider = ethers.provider.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider)
            console.log("done")
        } catch (error) {
            console.log(error)
        }
    }
}
function listenForTransactionMine(transactionResponse, provider) {
    console.log(`mining ${transactionResponse.hash}`)
    console.log("--------------------------------------------------------")
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `completed mining with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}
async function checkBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(`the balance is ${ethers.utils.formatEther(balance)}`)
    }
}
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        const provider = ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}
