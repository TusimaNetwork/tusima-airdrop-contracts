async function print_accounts(taskArgs, hre) {
    const accounts = await hre.ethers.getSigners();
  
    for (const account of accounts) {
        console.log(account.address);
    }

    console.log(taskArgs.message);
}

task("accounts", "print accounts")
    .setAction(print_accounts);