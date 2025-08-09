//SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

contract Voting{

    struct Candidate{
        string name;
        uint256 voteCount;
    }

    mapping(uint256=>Candidate) public candidates;

    uint256 public candidatesCount;
    event Voted(uint256 indexed candidateId);

    //Add a new Candidate

    function addCandidate(string memory _name) public{
        candidates[candidatesCount]=Candidate(_name,0);
        
        candidatesCount++;
    } 

    //Vote for a particular candidate by id
    function vote(uint256 _candidateId) public{
        require(_candidateId<candidatesCount,"Invalid Candidate");
        candidates[_candidateId].voteCount++;
        emit Voted(_candidateId);
    }

    //get vote count of candidate
    function getVote(uint256 _candidateId) public view returns (uint256){
        return candidates[_candidateId].voteCount;
    }

}