pragma solidity ^0.5.8;

/// @title Voting with delegation.
contract Votethereum {
    
    // Variable for Start Time of election.
    uint internal lStartTime;
    // Variable for End Time of election.
    uint internal lEndTime;
    // Variable to indicate whether real-time results can be shared or not
    bool internal lRealTimeResults;
    // The entity which instantitated this contract
    address internal lElectionChairperson;
    // Variable for voting session name
    bytes32 internal lVotingSessionName;
    
    // Variable for the maximum number of total vote credits that can be cast for a single election
    uint internal lMaxVotesPerElection;

    bytes32 constant SUCCESSMESSAGE = "SUCCESS";
    bytes32 constant FAILMESSAGE = "FAIL";
    
    // structs to track vote by election, option
    struct VotingOption {
        bytes32 optionNameHash;
        bytes32 optionName;
        uint voteBalance;
    } // VotingOption
    struct Election {
        bytes32 electionNameHash;
        bytes32 electionName;        
        mapping(bytes32 => VotingOption) votingOptions;
    } // Election
    // structs to track ballot options (no votes)
    struct AllowedVotingOption {
        bytes32 optionNameHash;
        bytes32 optionName;
    } // AllowedVotingOption
    struct AllowedElectionOption {
        bytes32 electionNameHash;
        bytes32 electionName;
        mapping(bytes32 => AllowedVotingOption) allowedVotingOptions;
    } // AllowedElectionOption
    // structs to track voters and their votes
    struct OptionVote {
        bytes32 optionNameHash;
        bytes32 optionName;
        uint voteBalance;
    } // OptionVote
    struct ElectionVote {
        bytes32 electionNameHash;
        bytes32  electionName;
        uint electionVoteBalance;
        mapping(bytes32 => OptionVote) myOptionVotes;
    } // ElectionVote
    struct Voter {
        address voterID;
        mapping(bytes32 => ElectionVote) myElectionVotes;
    } // Voter
    // struct for returning arrays of elections and options
    struct ElectionInfo {
        bytes32 electionName;
        bytes32[] optionNames;
    } // ElectionInfo


    // Mappings for allowed elections, election votes, and voter info
    mapping(bytes32 => Election) internal elections;
    mapping(bytes32 => AllowedElectionOption) internal allowedElections;
    mapping(address => Voter) internal voters;
    ElectionInfo[] myElectionInfo; 


    // Function Modifiers
    // Only allow function execution if the Voting Session has not started yet.
    modifier onlyIfBeforeStartTime() { 
        // TODO: uncomment!
        /*
        if (now > lStartTime) {
            ErrorEvent("This function can only be performed before the voting session!");
        } else {
            _;
        }
        */
        // TODO: delete
        _;
    } // onlyIfBeforeStartTime
    // Only allow function execution if the Voting Session is currently open.
    modifier onlyIfDuringVotingSession() { 
        // TODO: uncomment!
        /*
        if ((now < lStartTime) || (now >= lEndTime)) {
            ErrorEvent("This function can only be performed during the voting session!");
        } else {
            _;
        }
    
        */
        // TODO: delete
        _;
    } // onlyIfDuringVotingSession
    // Only allow function execution if the Voting Session has ended.
    modifier onlyIfAfterEndTime() { 
        // TODO: uncomment!
        /*
        if (now < lEndTime) {
            ErrorEvent("This function can only be performed after the election!");
        } else {
            _;
        }
        */
        // TODO: delete
        _;
    } // onlyIfAfterEndTime
    modifier onlyIfChairperson() {
        if (msg.sender != lElectionChairperson) {
            emit ErrorEvent("Only the election chairperson can access this fuction!");
        } else {
            _;
        }
    } // onlyIfChairperson
    modifier onlyIfNotChairperson() {
        if (msg.sender == lElectionChairperson) {
            emit ErrorEvent("Only a voter can access this function!");
        } else {
            _;
        }
    } // onlyIfNotChairperson
    modifier onlyIfRealTimeResults() {
        if (!lRealTimeResults) {
            emit ErrorEvent("Real Time Results are not allowed!");
        } else {
            _;
        }
    } // onlyIfRealTimeResults


    // Events
    event ErrorEvent(string errorMessage);
    event ConfirmationEvent(string confirmationMessage);
    event ElectionResultsEvent(bytes32[100] resultsArray);
    event GetElectionsEvent(bytes32[50] electionsArray);
    event GetElectionOptionsEvent(bytes32[50] electionOptionsArray);


    // constructor
    /// Create a new ballot to choose one of the supplied `optionNames`.
    constructor(bytes32 votingSessionName) public {
        lElectionChairperson = msg.sender;
        lVotingSessionName = votingSessionName;
        lRealTimeResults = true;
    } // Votethereum

    // Add an election to the ballot.
    function addElection(bytes32 electionName) public onlyIfChairperson() {        
        bytes32 electionNameHash = getHash(electionName);

        allowedElections[electionNameHash].electionNameHash = electionNameHash;
        allowedElections[electionNameHash].electionName = electionName;
        
        ElectionInfo memory thisInfo;
        thisInfo.electionName = electionName;
        myElectionInfo.push(thisInfo);
        
        elections[electionNameHash].electionNameHash = electionNameHash;
        elections[electionNameHash].electionName = electionName;

        emit ConfirmationEvent("The election has been added.");
    } // addVotingItem
    function validateElectionName(bytes32 electionName) view public returns (bool) {
        bool returnValue = false;
        bytes32 electionNameHash = getHash(electionName);
        if (allowedElections[electionNameHash].electionNameHash == electionNameHash) {
            returnValue = true;
        } // if
        return (returnValue);
    } // validateElectionName
    // Remove the Voting Item with with the supplied Election Name from the Voting Items collection.
    function removeElection(bytes32 electionName) public onlyIfBeforeStartTime() onlyIfChairperson() {
        if (validateElectionName(electionName)) {
            delete allowedElections[getHash(electionName)];            
            delete elections[getHash(electionName)];
            for (uint i; i < myElectionInfo.length; i++) {
                if (myElectionInfo[i].electionName == electionName) {
                    delete myElectionInfo[i];
                } // if
            } // for
            emit ConfirmationEvent("Election removed.");
        } else {
            emit ErrorEvent("Invalid election name!");
        } // if
    } // removeElection


    // Add an option for an election (ie - candidate) on the ballot.
    function addVotingItem(bytes32 electionName, bytes32 optionName) public onlyIfBeforeStartTime() onlyIfChairperson() {
        bytes32 electionNameHash = getHash(electionName);
        bytes32 optionNameHash = getHash(optionName);
        
        // check to see if election exists, if not create before adding voting options to it
        if (allowedElections[electionNameHash].electionNameHash != electionNameHash) {
            addElection(electionName);
        } // if
                
        allowedElections[electionNameHash].allowedVotingOptions[optionNameHash].optionNameHash = optionNameHash;
        allowedElections[electionNameHash].allowedVotingOptions[optionNameHash].optionName = optionName;
        
        for (uint i; i < myElectionInfo.length; i++) {
            if (myElectionInfo[i].electionName == electionName) {
                myElectionInfo[i].optionNames.push(optionName);
            } // if
        } // for
        
        elections[electionNameHash].votingOptions[optionNameHash].optionNameHash = optionNameHash;
        elections[electionNameHash].votingOptions[optionNameHash].optionName = optionName;
        elections[electionNameHash].votingOptions[optionNameHash].voteBalance = 0;

        emit ConfirmationEvent("Option added to election.");
    } // addVotingItem
    function validateElectionOptionName(bytes32 electionName, bytes32 optionName) view public returns (bool) {
        bool returnValue = false;
        bytes32 electionNameHash = getHash(electionName);
        bytes32 electionOptionNameHash = getHash(optionName);
        
        if (allowedElections[electionNameHash].electionNameHash == electionNameHash) {
            if (allowedElections[electionNameHash].allowedVotingOptions[electionOptionNameHash].optionNameHash == electionOptionNameHash) {
                returnValue = true;    
            } // if
        } // if
        return returnValue;
    } // validateElectionOptionName
    // Remove the Voting Item with with the supplied Election Name from the Voting Items collection.
    function removeElectionOption(bytes32 electionName, bytes32 optionName) public onlyIfBeforeStartTime() onlyIfChairperson() {
         if (validateElectionName(electionName)) {
            if (validateElectionOptionName(electionName, optionName)) {
                delete allowedElections[getHash(electionName)].allowedVotingOptions[getHash(optionName)];
                elections[getHash(electionName)].votingOptions[getHash(optionName)].voteBalance = 0;
                delete elections[getHash(electionName)].votingOptions[getHash(optionName)];  
                
                for (uint i; i < myElectionInfo.length; i++) {
                    if (myElectionInfo[i].electionName == electionName) {
                        for (uint u; u < myElectionInfo[i].optionNames.length; u++) {
                            if (myElectionInfo[i].optionNames[u] == optionName) {
                               delete myElectionInfo[i].optionNames[u]; 
                            } // if
                        } // for
                    } // if
                } // for
                emit ConfirmationEvent("Option removed from election.");
            } else {
                emit ErrorEvent("Invalid Election / Option name.");
            }// if
        } // if
    } // removeElectionOption


    // Voting functions
    function castVote(bytes32 electionName, bytes32 optionName, uint voteBalance) public onlyIfDuringVotingSession() onlyIfNotChairperson() {
        // is the user casting more votes in the this election than they are allowed to?
        if (voteBalance <= lMaxVotesPerElection) {
            // if the election name is valid
            if (validateElectionName(electionName)) {
                // if the option name is valid
                if (validateElectionOptionName(electionName, optionName)) {
                    // if voter has enough balance remaining
                    if ((lMaxVotesPerElection - getVoterBalanceSpentForElection(electionName)) >= voteBalance) {
                        voters[msg.sender].myElectionVotes[getHash(electionName)].myOptionVotes[getHash(optionName)].voteBalance += voteBalance; 
                        voters[msg.sender].myElectionVotes[getHash(electionName)].electionVoteBalance += voteBalance;
                        elections[getHash(electionName)].votingOptions[getHash(optionName)].voteBalance += voteBalance;
                        emit ConfirmationEvent("Your vote has been cast.");
                    } else {
                        emit ErrorEvent("You are casting more votes than you have remaining!");
                    } // if
                } else {
                    emit ErrorEvent("Invalid option name.");
                } // if
            } else {
                emit ErrorEvent("Invalid election name.");
            } // if
        } else {
            emit ErrorEvent("Casting more votes than allowed in this election!");
        } // if
    } // castVote
    function uncastVote(bytes32 electionName, bytes32 optionName) public onlyIfDuringVotingSession() onlyIfNotChairperson() {
        // if the election name is valid
        if (validateElectionName(electionName)) {
            // if the option name is valid
            if (validateElectionOptionName(electionName, optionName)) {
                uint votedBalance = voters[msg.sender].myElectionVotes[getHash(electionName)].myOptionVotes[getHash(optionName)].voteBalance;
                voters[msg.sender].myElectionVotes[getHash(electionName)].myOptionVotes[getHash(optionName)].voteBalance = 0;
                voters[msg.sender].myElectionVotes[getHash(electionName)].electionVoteBalance -= votedBalance;
                elections[getHash(electionName)].votingOptions[getHash(optionName)].voteBalance -= votedBalance;
                emit ConfirmationEvent("Your vote has been uncast.");
            } else {
                emit ErrorEvent("Invalid option name!");
            } // if
        } else { 
            emit ErrorEvent("Invalid election name!");
        } // if
    } // uncastVote
    function getVoterBalanceSpentForElection(bytes32 electionName) public returns (uint) {
        // if the election name is valid
        if (validateElectionName(electionName)) {
            return voters[msg.sender].myElectionVotes[getHash(electionName)].electionVoteBalance;
        } else {
            emit ErrorEvent("Invalid election name!");
        } // if
    } // getVoterBalanceSpentForElection


    // Election Results
    function getVoteTally(bytes32 electionName, bytes32 optionName) public onlyIfChairperson() onlyIfRealTimeResults() returns (uint) {        
        // if the election name is valid
        if (validateElectionName(electionName)) {
            // if the option name is valid
            if (validateElectionOptionName(electionName, optionName)) {
                return (elections[getHash(electionName)].votingOptions[getHash(optionName)].voteBalance);
            } else { 
                emit ErrorEvent("Invalid Election Name!");
            } // if
        } else { 
            emit ErrorEvent("Invalid Option Name!");
        } // if
    } // getVoteTally   
    function getElectionResults(bytes32 electionName) public onlyIfChairperson() onlyIfRealTimeResults() {        
        bytes32[100] memory returnValue;  
        uint returnIndex = 0;     

        for (uint e = 0; e < myElectionInfo.length; e++) {
            if (myElectionInfo[e].electionName == electionName) {
                for (uint o = 0; o < myElectionInfo[e].optionNames.length; o++) {
                    uint uVoteTally = getVoteTally(myElectionInfo[e].electionName, myElectionInfo[e].optionNames[o]);
                    returnValue[returnIndex] = myElectionInfo[e].optionNames[o];
                    returnIndex++;
                    returnValue[returnIndex] = bytes32(uVoteTally);
                    returnIndex++;
                } // for
            } // if
        } // for
        emit ElectionResultsEvent(returnValue);        
    } // getElectionResults
    

    // GETTERS *************************************************************************
    function getStartTime() view public returns (uint) {
        return (lStartTime);
    } // getStartTime
    function getEndTime() view public returns (uint) {
        return (lEndTime);
    } // getEndTime
    function getRealTimeResults() view public returns (bool) {
        return (lRealTimeResults);
    } // getRealTimeResults
    function getElectionChairperson() view public returns (address) {
        return (lElectionChairperson);
    } // getElectionChairperson


    // Returns the Maximum Number of Votes each Voter can cast in an election.
    function getMaxVotesPerElection() view public returns (uint) {        
        return (lMaxVotesPerElection);
    } // getMaxVotesPerElection
    
    
    function getNow() view public returns (uint) {
        return (now);
    } // getNow
    function getVotingSessionName() view public returns (string memory) {
        return (bytes32ToString(lVotingSessionName));
    } // getVotingSessionName
    function getWhoAmI() view public returns (address) {
        return (msg.sender);
    } // whoAmI   
    function getAllElectionNames() public {
        bytes32[50] memory returnArray;
        for (uint i = 0; i < myElectionInfo.length; i++) {
            returnArray[i] = myElectionInfo[i].electionName;
        } // for
        emit GetElectionsEvent(returnArray);        
    } // getAllElectionNames
    function getAllElectionOptionNames(bytes32 electionName) public {
        bytes32[50] memory returnArray;
        for (uint i; i < myElectionInfo.length; i++) {
            if (myElectionInfo[i].electionName == electionName) {
                for (uint u; u < myElectionInfo[i].optionNames.length; u++) {
                    returnArray[u] = myElectionInfo[i].optionNames[u];
                } // for
            } // if
        } // for
        emit GetElectionOptionsEvent(returnArray);
    } // getAllElectionOptionNames
   

    // SETTERS ************************************************************************* 
    function setRealTimeResults(bool realTimeResults) public onlyIfChairperson() {
        lRealTimeResults = realTimeResults;
        emit ConfirmationEvent("Real Time Results set.");
    } // SetRealTimeResults


    // Sets the Maximum Number of Votes each Voter can cast in an election.
    function setMaxVotesPerElection(uint maxVotesPerElection) public onlyIfChairperson() {
        lMaxVotesPerElection = maxVotesPerElection;
        emit ConfirmationEvent("Max Votes Per Election set.");
    } // SetMaxVotesPerElection



    function setStartTime(uint startTime) public onlyIfChairperson() {
        lStartTime = startTime;
        emit ConfirmationEvent("Election Start Time set.");
    } // SetStartTime
    function setEndTime(uint endTime) public onlyIfChairperson() {
        lEndTime = endTime;
        emit ConfirmationEvent("Election End Time set.");
    } // SetEndTime


    // UTILITY ************************************************************************* 
    // Returns the hash of the provided string.
    function getHash(bytes32 hashThisPlease) pure internal returns (bytes32) {
        bytes32 myResult = keccak256(abi.encode(hashThisPlease)); 
        return (myResult);
    } // getHash
    function bytes32ToString(bytes32 x) pure private returns (string memory) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        uint j = 0;
        uint k = 0;
        for (j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (k = 0; k < charCount; k++) {
            bytesStringTrimmed[k] = bytesString[k];
        }
        return string(bytesStringTrimmed);
    } // bytes32ToString


    // ************************************************************************
    // ************************************************************************* 
    
    
} // Votethereum
