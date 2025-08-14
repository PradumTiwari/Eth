//SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract AdvancedNFT is ERC721URIStorage,Ownable,ReentrancyGuard{

    uint256 public tokenCounter;

    //Public sale settings
    uint256 public mintPrice=0.01 ether;
    uint256 public maxPerWallet=2;

    uint256 public saleStart;

    //Whitelist root hash(Merkle tree root)
    bytes32 public merkleRoot;
    

    //Tracking how many a wallet has minted(Enforces maxPerWallet)

    mapping(address=>uint256) public mintedCount;

    event Minted(address indexed minter,uint256 indexed tokenId,string tokenURI);
    event BatchMint(address indexed to,uint256 amount);
    event Withdrawn(address indexed to,uint256 amount);

    constructor() ERC721("AdvancedNFT","ANFT") Ownable(msg.sender){
        tokenCounter=0;
    }

    //Modifier
    modifier saleActive(){
        require(block.timestamp>=saleStart,"Sale is Not active yet");
        _;
    }

    //Admin(owner -only)

    function setSaleStart(uint256 _startTime) external onlyOwner{
        saleStart=_startTime;
    }

    function setMintPrice(uint256 _wei) external onlyOwner{
        mintPrice=_wei;
    }

    function setMaxPerWallet(uint256 _max) external onlyOwner{
        maxPerWallet=_max;

    }

    function setMerkleRoot(bytes32 _root) public onlyOwner{
        merkleRoot=_root;
    }

    //Owner can airdrop/batchmint to any address

    function mintBatch(address to, string[] calldata uris) external onlyOwner{
        uint256 len=uris.length;

        for(uint256 i=0;i<len;i++){
            _mintWithURI(to,uris[i]);
        }
        emit BatchMint(to,len);
    }

    //Withdraw collected eth from public/whiselist mint
    function withdraw(address payable to) external onlyOwner nonReentrant{
        uint256 bal=address(this).balance;
        require(bal>0,"No balance");
        (bool ok, )=to.call{value:bal}("");
        require(ok,"Withdraw failed");
        emit Withdrawn(to,bal);
    } 

    //Public mint(anyone can mint)- pay mint Price,obey per wallet limit and should be in start time
    function publicMint(string calldata tokenURI_) external payable saleActive nonReentrant{
        require(msg.value>=mintPrice,"Require More Eth");
        require(mintedCount[msg.sender]<maxPerWallet,"Max Per wallet reached");

        mintedCount[msg.sender]+=1;
        _mintWithURI(msg.sender,tokenURI_);
    }

    //Whiselist mint-Required valid merkle proof ,also pays and obeys constraints
    function whitelistMint(string calldata tokenURI_,bytes32[] calldata proof) external payable saleActive nonReentrant{

        require(_verifyWhiteList(msg.sender,proof),"Not WhiteListed");
        require(msg.value>=mintPrice,"Insufficient ETH");
        require(mintedCount[msg.sender]<maxPerWallet,"Max Per wallet Reached");
        mintedCount[msg.sender]+=1;
        _mintWithURI(msg.sender,tokenURI_);
    }

    //--------Internal helper
    function _mintWithURI(address to,string memory tokenURI_) internal{
        uint256 tokenId=tokenCounter;
        tokenCounter=tokenId+1;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        emit Minted(to,tokenId,tokenURI_);
    }


    function _verifyWhiteList(address account,bytes32[] calldata proof) internal view returns(bool) {
        if(merkleRoot==bytes32(0)) return false;//No whitelist set
        //Leaf=keccak256(abi.encodePacked(account)) -standard address leaf format
        bytes32 leaf=keccak256(abi.encodePacked(account));

        return MerkleProof.verify(proof, merkleRoot, leaf);
    }

    //-------------------------Overrides----------------------------------

function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721URIStorage)
    returns (bool)
{
    return super.supportsInterface(interfaceId);
}

function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721URIStorage)
    returns (string memory)
{
    return super.tokenURI(tokenId);
}


}