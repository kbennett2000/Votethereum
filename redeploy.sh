# Clean out the build folder to remove the last build
rm -r build/

# Clear the terminal window
clear

# Compile and migrate the Votethereum contract
truffle migrate --reset
