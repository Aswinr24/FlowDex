async function main() {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying contracts with the account:', deployer.address)

  // const StakeHolders = await ethers.getContractFactory('StakeHolders')
  // const stakeholders = await StakeHolders.deploy()

  // console.log(
  //   'StakeHolders contract deployed to:',
  //   await stakeholders.getAddress()
  // )

  const PurchaseOrder = await ethers.getContractFactory('PurchaseOrder')
  const purchaseOrder = await PurchaseOrder.deploy(
    '0x11eAC6Bb9C4A319B6c7F40d203444d227f030c1D'
  )

  console.log(
    'Purchase Order contract deployed to:',
    await purchaseOrder.getAddress()
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
