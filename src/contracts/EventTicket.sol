// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EventTicket is ERC721 {
    uint256 private _tokenIds;
    mapping(uint256 => string) private _eventIds;
    mapping(address => mapping(string => uint256)) private _userTickets;
    mapping(address => mapping(string => bool)) private _hasPoap;
    mapping(address => mapping(string => bool)) private _eventEnded;
    uint256 public constant TICKET_PRICE = 0.01 ether;
    
    event TicketMinted(address indexed recipient, uint256 tokenId, string eventId);
    event TicketBurned(address indexed holder, uint256 tokenId, string eventId);
    event PoapIssued(address indexed recipient, string eventId);
    event EventEnded(address indexed user, string eventId);
    
    constructor() ERC721("EventTicket", "EVTK") {}
    
    function mintTicket(string memory eventId) public payable returns (uint256) {
        require(msg.value >= TICKET_PRICE, "Insufficient payment");
        require(!_eventEnded[msg.sender][eventId], "Event has ended for you");
        require(_userTickets[msg.sender][eventId] == 0, "You already have a ticket for this event");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _mint(msg.sender, newTokenId);
        _eventIds[newTokenId] = eventId;
        _userTickets[msg.sender][eventId] = newTokenId;
        
        emit TicketMinted(msg.sender, newTokenId, eventId);
        return newTokenId;
    }
    
    function enterEvent(string memory eventId) public {
        uint256 tokenId = _userTickets[msg.sender][eventId];
        require(tokenId != 0, "No ticket found for this event");
        require(!_eventEnded[msg.sender][eventId], "Event has ended for you");
        require(!_hasPoap[msg.sender][eventId], "Already entered this event");
        
        _burn(tokenId);
        _userTickets[msg.sender][eventId] = 0;
        _hasPoap[msg.sender][eventId] = true;
        
        emit TicketBurned(msg.sender, tokenId, eventId);
        emit PoapIssued(msg.sender, eventId);
    }
    
    function endEvent(string memory eventId) public {
        require(!_eventEnded[msg.sender][eventId], "Event already ended for you");
        _eventEnded[msg.sender][eventId] = true;
        emit EventEnded(msg.sender, eventId);
    }
    
    function hasPoap(address user, string memory eventId) public view returns (bool) {
        return _hasPoap[user][eventId];
    }
    
    function getUserTicket(address user, string memory eventId) public view returns (uint256) {
        return _userTickets[user][eventId];
    }
    
    function getEventId(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _eventIds[tokenId];
    }
}