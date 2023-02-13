// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import voting_artifacts from '../../build/contracts/Votethereum.json'

var myContractAddress = ""; 

var Votethereum = contract(voting_artifacts);


// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

window.addElection = function() {
  var theVoter = document.getElementById("actors").value;
  let electionNameAdd = $("#ElectionNameAdd").val();
  try {
    
    $("#modalMessage").html("Election " + electionNameAdd + " is being added. Waiting for confirmation...");
    $("body").css("cursor", "progress");
    $("#ElectionNameAdd").val("");
    modal.style.display = "block";

    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.addElection(electionNameAdd, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function() {	      
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.validateElectionName = function() {
  var theVoter = document.getElementById("actors").value;
  let electionNameValidate = $("#ElectionNameValidate").val();
  try {
    
    $("#theMessage").html("validating election name " + electionNameValidate);
    $("#ElectionNameValidate").val("");

    Votethereum.deployed().then(function(contractInstance) {
      return contractInstance.validateElectionName.call(electionNameValidate, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function(v) {
          $("#theMessage").html(electionNameValidate + " evaluates to " + v.toString());
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.removeElection = function() {
  var theVoter = document.getElementById("actors").value;
  let electionNameRemove = $("#ElectionNameRemove").val();
  try {
    
    $("#modalMessage").html("Election " + electionNameRemove + " is being removed. Waiting for confirmation...");    
    $("body").css("cursor", "progress");
    $("#ElectionNameRemove").val("");
    modal.style.display = "block";

    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.removeElection(electionNameRemove, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function() {	      
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.addVotingItem = function() {
  var theVoter = document.getElementById("actors").value;
  let electionNameAddVotingItem = $("#ElectionNameAddVotingItem").val();
  let optionNameAddVotingItem = $("#OptionNameAddVotingItem").val();

  try {
    
    $("#modalMessage").html("Option " + optionNameAddVotingItem + " is being added to election " + electionNameAddVotingItem + ". Waiting for confirmation...");
    $("body").css("cursor", "progress");
    $("#ElectionNameAddVotingItem").val("");
    $("#OptionNameAddVotingItem").val("");
    modal.style.display = "block";

    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.addVotingItem(electionNameAddVotingItem, optionNameAddVotingItem, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function() {	      
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.validateElectionOptionName = function() {
  var theVoter = document.getElementById("actors").value;
  let electionNameValidateOption = $("#ElectionNameValidateOption").val();
  let optionNameValidateOption = $("#OptionNameValidateOption").val();
  try {
    
    $("#ElectionNameValidateOption").val("");
    $("#OptionNameValidateOption").val("");

    Votethereum.deployed().then(function(contractInstance) {
      return contractInstance.validateElectionOptionName.call(electionNameValidateOption, optionNameValidateOption, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function(v) {
          $("#theMessage").html("option " + optionNameValidateOption + " in election " + electionNameValidateOption +" is " + v.toString());
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.removeElectionOption = function() {
  var theVoter = document.getElementById("actors").value;
  let electionNameRemoveOption = $("#ElectionNameRemoveOption").val();
  let optionNameRemoveOption = $("#OptionNameRemoveOption").val();

  try {
    
    $("#modalMessage").html("Option " + optionNameRemoveOption + " removed from election " + electionNameRemoveOption + ". Waiting for confirmation...");
    $("body").css("cursor", "progress");
    modal.style.display = "block";

    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.removeElectionOption(electionNameRemoveOption, optionNameRemoveOption, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function() {
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.castVote = function() {
  var theVoter = document.getElementById("actors").value;
  let electionNameCastVote = $("#ElectionNameCastVote").val();
  let optionNameCastVote = $("#OptionNameCastVote").val();
  let voteBalanceCastVote = $("#VoteBalanceCastVote").val();

  try {
    
    $("body").css("cursor", "progress");
    $("#modalMessage").html("Casting vote balance " + voteBalanceCastVote + " for option " + optionNameCastVote + " in election " + electionNameCastVote + ". Waiting for confirmation...")
    $("#ElectionNameCastVote").val("");
    $("#OptionNameCastVote").val("");
    $("#VoteBalanceCastVote").val("");
    modal.style.display = "block";

    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.castVote(electionNameCastVote, optionNameCastVote, voteBalanceCastVote, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function() {
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.uncastVote = function() {
  var theVoter = document.getElementById("actors").value;
  let electionNameUncastVote = $("#ElectionNameUncastVote").val();
  let optionNameUncastVote = $("#OptionNameUncastVote").val();
  
  try {
    
    $("body").css("cursor", "progress");
    $("#modalMessage").html("Uncasting vote for option " + optionNameUncastVote + " in election " + electionNameUncastVote + ". Waiting for confirmation...");
    $("#ElectionNameUncastVote").val("");
    $("#OptionNameUncastVote").val("");
    modal.style.display = "block";

    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.uncastVote(electionNameUncastVote, optionNameUncastVote, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function() {
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.getVoterBalanceSpentForElection = function() {
  var theVoter = document.getElementById("actors").value;
  let electionNameGetVoterBalance = $("#ElectionNameGetVoterBalance").val();

  try {
    
    $("#theMessage").html("Getting spent vote balance for election " + electionNameGetVoterBalance + ". The response is on its way. Please wait...");
    $("#ElectionNameGetVoterBalance").val("");

    Votethereum.deployed().then(function(contractInstance) {
      return contractInstance.getVoterBalanceSpentForElection.call(electionNameGetVoterBalance, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function(v) {
        $("#theMessage").html("spent vote balance for election " + electionNameGetVoterBalance + " is " + v.toString());
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.getVoteTally = function() {
  var theVoter = document.getElementById("actors").value;
  let electionNameGetVoteTally = $("#ElectionNameGetVoteTally").val();
  let optionNameGetVoteTally = $("#OptionNameGetVoteTally").val();

  try {
    
    $("#theMessage").html("Getting vote tally for option " + optionNameGetVoteTally + " in election " + electionNameGetVoteTally + ". The response is on its way. Please wait...");
    $("#ElectionNameGetVoteTally").val("");
    $("#OptionNameGetVoteTally").val("");

    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.getVoteTally(electionNameGetVoteTally, optionNameGetVoteTally, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function(v) {
        $("#theMessage").html("vote tally is " + v.toString() + " for option " + optionNameGetVoteTally + " in election " + electionNameGetVoteTally);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.getElectionResults = function() {
  var theVoter = document.getElementById("actors").value;
  let electionNameGetResults = $("#ElectionNameGetResults").val();

  try {
    
    $("body").css("cursor", "progress");
    $("#modalMessage").html("Getting results for election " + electionNameGetResults + ". Please wait...");
    $("#ElectionNameGetResults").val("");
    modal.style.display = "block";

    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.getElectionResults(electionNameGetResults, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function() {
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.setStartTime = function() {
  var theVoter = document.getElementById("actors").value;
  let startTime = $("#StartTime").val();

  try {
    
    $("body").css("cursor", "progress");
    $("#modalMessage").html("Setting election start time to " + startTime + ". Waiting for confirmation...");
    $("#StartTime").val("");
    modal.style.display = "block";

    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.setStartTime(startTime, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function() {
	      //$("#theMessage").html("start time of " + startTime + " set");
	      getStartTime();
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.setEndTime = function() {
  var theVoter = document.getElementById("actors").value;
  let endTime = $("#EndTime").val();

  try {
        
    $("body").css("cursor", "progress");
    $("#modalMessage").html("Setting election end time to " + endTime + ". Waiting for confirmation...");
    $("#EndTime").val("");
    modal.style.display = "block";

    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.setEndTime(endTime, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function() {
	      //$("#theMessage").html("end time of " + endTime + " set");
	      getEndTime();
      });
    });
  } catch (err) {
    console.log(err);
  }
}

// Sets the Maximum Number of Votes each Voter can cast in an election.
window.setMaxVotesPerElection = function() {
  // Get the value in the UI textbox, store in a variable.
  var theVoter = document.getElementById("actors").value;
  let maxVotesPerElection = $("#MaxVotesPerElection").val();
  
  try {   
     
    $("body").css("cursor", "progress");
    $("#modalMessage").html("Setting maximum votes per election to " + maxVotesPerElection + ". Waiting for confirmation...");
    $("#MaxVotesPerElection").val("");
    modal.style.display = "block";

    // Call the SetMaxVotesPerElection function from the deployed Smart Contract.
    //    Provide this function call with 550,000 units of gas.
    // Call the GetMaxVotesPerElection Function when complete to update the UI (Dashboard page).
    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.setMaxVotesPerElection(maxVotesPerElection, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function() {        
        getMaxVotesPerElection();
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.setRealTimeResults = function() {
  var theVoter = document.getElementById("actors").value;
  let realTimeResults = $("#RealTimeResults").val();

  try {
    
    $("body").css("cursor", "progress");
    $("#modalMessage").html("Setting election real time results to " + realTimeResults + ". Waiting for confirmation...");
    $("#RealTimeResults").val("");
    modal.style.display = "block";

    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.setRealTimeResults(realTimeResults, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function() {
	      //$("#theMessage").html("election real time results value of " + startTime + " set");
	      getRealTimeResults();
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.getVotingSessionName = function() {
  try { 
    Votethereum.deployed().then(function(contractInstance) {
    contractInstance.getVotingSessionName.call().then
    (
      function(v) 
      {
        $("#VotingSessionNameDisplay").html(v.toString());
      }
    );
    });
  } catch (err) {
    console.log(err);
  }
}

window.getStartTime = function() {
  try {
 
    Votethereum.deployed().then(function(contractInstance) {
    contractInstance.getStartTime.call().then
    (
      function(v) 
      {
        $("#StartTimeDisplay").html(v.toString());
      }
    );
    });
  } catch (err) {
    console.log(err);
  }
}

window.getEndTime = function() {
  try {
 
    Votethereum.deployed().then(function(contractInstance) {
    contractInstance.getEndTime.call().then
    (
      function(v) 
      {
        $("#EndTimeDisplay").html(v.toString());
      }
    );
    });
  } catch (err) {
    console.log(err);
  }
}

window.getRealTimeResults = function() {
  try {
 
    Votethereum.deployed().then(function(contractInstance) {
    contractInstance.getRealTimeResults.call().then
    (
      function(v) 
      {
        $("#RealTimeResultsDisplay").html(v.toString());
      }
    );
    });
  } catch (err) {
    console.log(err);
  }
}

window.getElectionChairperson = function() {
  try {
 
    Votethereum.deployed().then(function(contractInstance) {
    contractInstance.getElectionChairperson.call().then
    (
      function(v) 
      {
        $("#ElectionChairpersonDisplay").html("<a href='https://ropsten.etherscan.io/address/" + v.toString() + "' target='_blank'>" + v.toString() + "</a>");
      }
    );
    });
  } catch (err) {
    console.log(err);
  }
}

// Gets the Maximum Number of Votes each Voter can cast in an election.
window.getMaxVotesPerElection = function() {
  try {
 
    // Call the GetMaxVotesPerElection function from the deployed Smart Contact.
    Votethereum.deployed().then(function(contractInstance) {
    contractInstance.getMaxVotesPerElection.call().then
    (
      function(v) 
      {
        $("#MaxVotesPerElectionDisplay").html(v.toString());
      }
    );
    });
  } catch (err) {
    console.log(err);
  }
}

window.getNow = function() {
  try {
 
    Votethereum.deployed().then(function(contractInstance) {
    contractInstance.getNow.call().then
    (
      function(v) 
      {
        $("#NowDisplay").html(v.toString());
      }
    );
    });
  } catch (err) {
    console.log(err);
  }
}

window.getWhoAmI = function() {
  var theVoter = document.getElementById("actors").value;
  try {
    Votethereum.deployed().then(function(contractInstance) {
      return contractInstance.getWhoAmI.call({gas: 550000, from: web3.eth.accounts[theVoter]}).then(function(v) {
          //$("#theMessage").html("it turns you out are: " + v.toString());
          $("#whoAmI").html("<a href='https://ropsten.etherscan.io/address/" + v.toString() + "' target='_blank'>" + v.toString() + "</a>");
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.getAllElectionNames = function() {
  var theVoter = document.getElementById("actors").value;

  try {
    
    $("body").css("cursor", "progress");
    $("#modalMessage").html("Getting all election names. The response is on its way. Please wait...");
    $("#selectElectionName").html("<select id='myElectionNames'></select>");
    modal.style.display = "block";

    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.getAllElectionNames({gas: 550000, from: web3.eth.accounts[theVoter]}).then(function() {
      });
    });
  } catch (err) {
    console.log(err);
  }
}

window.getElectionOptionNames = function() {
  var theVoter = document.getElementById("actors").value;
  let thisElectionName = document.getElementById("myElectionNames").value;

  try {
     
    $("body").css("cursor", "progress");
    $("#modalMessage").html("Getting all election option names for election " + hexToAscii(thisElectionName) + ". The response is on its way. Please wait...");
    $("#selectElectionName").html("<select id='myElectionNames'></select>");
    modal.style.display = "block";

    Votethereum.deployed().then(function(contractInstance) {
      contractInstance.getAllElectionOptionNames(thisElectionName, {gas: 550000, from: web3.eth.accounts[theVoter]}).then(function() {
      });
    });
  } catch (err) {
    console.log(err);
  }
}



function hexToAscii(str1)
{
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}


window.openTab = function (evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }
  
  Votethereum.setProvider(window.web3.currentProvider);  
  
  //setContractAddress();
  Votethereum.deployed().then(function(contractInstance) {
    myContractAddress = Votethereum.address.toString();  
    $("#ContractAddress").html("<a href='https://ropsten.etherscan.io/address/" + myContractAddress + "' target='_blank'>" + myContractAddress + "</a>");
 
    //var errEvent = Votethereum.at(Votethereum.contractAddress).ErrorEvent();
    var errEvent = Votethereum.at(myContractAddress).ErrorEvent();
    var confEvent = Votethereum.at(myContractAddress).ConfirmationEvent();
    var electionResultsEvent = Votethereum.at(myContractAddress).ElectionResultsEvent();
    var getElectionsEvent = Votethereum.at(myContractAddress).GetElectionsEvent();
    var getElectionOptionsEvent = Votethereum.at(myContractAddress).GetElectionOptionsEvent();
    errEvent.watch(function(error, result) {
      if (!error)
          {
              $("body").css("cursor", "default");            
              $("#theError").html("<h3>" + result.args.errorMessage + "</h3>");
              $("#theMessage").html("");
              modal.style.display = "none";            

          } else {
              console.log(error);
          }
    });
    confEvent.watch(function(error, result) {
      if (!error)
          {
              $("body").css("cursor", "default");
              $("#theMessage").html("<h3>" + result.args.confirmationMessage + "</h3>");
              $("#theError").html("");
              modal.style.display = "none";
          } else {
              console.log(error);
          }
    });
    electionResultsEvent.watch(function(error, result) {
      if (!error)
          {
              $("body").css("cursor", "default");
              $("#theError").html("");
              modal.style.display = "none";

              
              var myResults = result.args.resultsArray.toString().split(',');
              var displayHTML = [];
              for (var i = 0; i < myResults.length; i++) {
                if (
                  (myResults[i].toString() != "0x0000000000000000000000000000000000000000000000000000000000000000") && 
                  (myResults[i].toString() != "0x0000000000000000000000000000000000000000000000000000000000000064") &&
                  (myResults[i].toString() != "0x0000000000000000000000000000000000000000000000000000000000000001") &&
                  (myResults[i].toString() != "0x0000000000000000000000000000000000000000000000000000000000000002")) 
                  {
                    var returnedName = hexToAscii(myResults[i]); 
                    //var returnedName = myResults[i]; 
                    i++;
                    var returnedVoteCount = parseInt(myResults[i], 16);
                    displayHTML += returnedName + " -- " + returnedVoteCount + "<br />";            
                }			
              }
      
              $("#theMessage").html(displayHTML);
              

          } else {
              console.log(error);
          }
    });
    getElectionsEvent.watch(function(error, result) {
      if (!error)
          {
              $("body").css("cursor", "default");
              $("#theError").html("");
              modal.style.display = "none";

              var myElectionNames = result.args.electionsArray.toString().split(',');
              var displayHTML = [];
              for (var i = 0; i < myElectionNames.length; i++) {
                if (myElectionNames[i].toString() != "0x0000000000000000000000000000000000000000000000000000000000000000") 
                {
                  var returnedName = hexToAscii(myElectionNames[i].toString()); 
                  displayHTML += returnedName + "<br />";
                  var x = document.getElementById("myElectionNames");
                  var option = document.createElement("option");
                  option.text = returnedName;
                  option.value = myElectionNames[i].toString();
                  x.add(option);
                }			
              }
              $("#ElectionNames").html(displayHTML);
              $("#theMessage").html("Election names retrieved.")
          } else {
              console.log(error);
          }
    });  
    getElectionOptionsEvent.watch(function(error, result) {
      if (!error)
          {
              $("body").css("cursor", "default");
              $("#theError").html("");
              modal.style.display = "none";
              
              var myElectionNames = result.args.electionOptionsArray.toString().split(',');
              var displayHTML = [];
              for (var i = 0; i < myElectionNames.length; i++) {
                if (myElectionNames[i].toString() != "0x0000000000000000000000000000000000000000000000000000000000000000") 
                {
                  displayHTML += hexToAscii(myElectionNames[i].toString()) + "<br />";                
                }			
              }
              $("#OptionNames").html(displayHTML);
              $("#theMessage").html("Election option names retrieved.");
          } else {
              console.log(error);
          }
    });

  });
    

  getVotingSessionName();
  getStartTime();
  getEndTime();
  getRealTimeResults();
  getElectionChairperson();
  getMaxVotesPerElection();
  getNow();
  
});
