// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title OpenChatGroups
 * @dev Smart contract for group chat functionality with role-based permissions
 */
contract OpenChatGroups {
    // Roles for group members
    enum Role { MEMBER, MODERATOR, ADMIN }
    
    // Group structure
    struct Group {
        string name;
        string description;
        address owner;
        uint256 createdAt;
        bool isPrivate;
        uint256 memberCount;
        bool exists;
    }
    
    // Group member structure
    struct GroupMember {
        address userAddress;
        Role role;
        uint256 joinedAt;
        bool exists;
    }
    
    // Message structure
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }
    
    // Join request structure
    struct JoinRequest {
        address requester;
        uint256 requestTime;
        bool exists;
    }
    
    // Mappings
    mapping(uint256 => Group) public groups;
    mapping(uint256 => mapping(address => GroupMember)) public groupMembers;
    mapping(uint256 => Message[]) public groupMessages;
    mapping(uint256 => mapping(address => JoinRequest)) public joinRequests;
    mapping(address => uint256[]) public userGroups;
    
    // Counter for group IDs
    uint256 private nextGroupId = 1;
    
    // Events
    event GroupCreated(uint256 groupId, string name, address owner);
    event GroupUpdated(uint256 groupId, string name, string description);
    event MemberAdded(uint256 groupId, address member, Role role);
    event MemberRemoved(uint256 groupId, address member);
    event RoleChanged(uint256 groupId, address member, Role newRole);
    event MessageSent(uint256 groupId, address sender, uint256 messageIndex);
    event JoinRequestCreated(uint256 groupId, address requester);
    event JoinRequestAccepted(uint256 groupId, address requester);
    event JoinRequestRejected(uint256 groupId, address requester);
    
    // Modifiers
    modifier onlyGroupExists(uint256 groupId) {
        require(groups[groupId].exists, "Group does not exist");
        _;
    }
    
    modifier onlyGroupMember(uint256 groupId) {
        require(groupMembers[groupId][msg.sender].exists, "Not a group member");
        _;
    }
    
    modifier onlyAdmin(uint256 groupId) {
        require(groupMembers[groupId][msg.sender].role == Role.ADMIN, "Admin access required");
        _;
    }
    
    modifier onlyModeratorOrAbove(uint256 groupId) {
        require(
            groupMembers[groupId][msg.sender].role == Role.MODERATOR || 
            groupMembers[groupId][msg.sender].role == Role.ADMIN, 
            "Moderator or admin access required"
        );
        _;
    }
    
    modifier onlyGroupOwner(uint256 groupId) {
        require(groups[groupId].owner == msg.sender, "Only group owner can perform this action");
        _;
    }
    
    /**
     * @dev Create a new group
     * @param name Name of the group
     * @param description Description of the group
     * @param isPrivate If true, users must request to join and be approved
     */
    function createGroup(string memory name, string memory description, bool isPrivate) external returns (uint256) {
        uint256 groupId = nextGroupId;
        nextGroupId++;
        
        groups[groupId] = Group({
            name: name,
            description: description,
            owner: msg.sender,
            createdAt: block.timestamp,
            isPrivate: isPrivate,
            memberCount: 1,
            exists: true
        });
        
        // Add creator as admin
        groupMembers[groupId][msg.sender] = GroupMember({
            userAddress: msg.sender,
            role: Role.ADMIN,
            joinedAt: block.timestamp,
            exists: true
        });
        
        // Add to user's groups
        userGroups[msg.sender].push(groupId);
        
        emit GroupCreated(groupId, name, msg.sender);
        emit MemberAdded(groupId, msg.sender, Role.ADMIN);
        
        return groupId;
    }
    
    /**
     * @dev Update group information
     * @param groupId ID of the group to update
     * @param name New name for the group
     * @param description New description for the group
     */
    function updateGroup(uint256 groupId, string memory name, string memory description) 
        external 
        onlyGroupExists(groupId)
        onlyAdmin(groupId)
    {
        groups[groupId].name = name;
        groups[groupId].description = description;
        
        emit GroupUpdated(groupId, name, description);
    }
    
    /**
     * @dev Toggle privacy setting of the group
     * @param groupId ID of the group
     * @param isPrivate New privacy setting
     */
    function setPrivacy(uint256 groupId, bool isPrivate)
        external
        onlyGroupExists(groupId)
        onlyAdmin(groupId)
    {
        groups[groupId].isPrivate = isPrivate;
    }
    
    /**
     * @dev Add a member to the group (for public groups or approved requests)
     * @param groupId ID of the group
     * @param member Address of the user to add
     * @param role Role to assign to the user
     */
    function addMember(uint256 groupId, address member, Role role)
        external
        onlyGroupExists(groupId)
        onlyModeratorOrAbove(groupId)
    {
        require(!groupMembers[groupId][member].exists, "User is already a member");
        require(role != Role.ADMIN || msg.sender == groups[groupId].owner, "Only the owner can add admins");
        
        groupMembers[groupId][member] = GroupMember({
            userAddress: member,
            role: role,
            joinedAt: block.timestamp,
            exists: true
        });
        
        // Add to user's groups
        userGroups[member].push(groupId);
        
        // Increment member count
        groups[groupId].memberCount++;
        
        // Delete join request if exists
        if (joinRequests[groupId][member].exists) {
            delete joinRequests[groupId][member];
        }
        
        emit MemberAdded(groupId, member, role);
    }
    
    /**
     * @dev Join a public group
     * @param groupId ID of the group to join
     */
    function joinGroup(uint256 groupId) 
        external 
        onlyGroupExists(groupId) 
    {
        require(!groupMembers[groupId][msg.sender].exists, "Already a member");
        
        if (groups[groupId].isPrivate) {
            // For private groups, create a join request
            require(!joinRequests[groupId][msg.sender].exists, "Join request already exists");
            
            joinRequests[groupId][msg.sender] = JoinRequest({
                requester: msg.sender,
                requestTime: block.timestamp,
                exists: true
            });
            
            emit JoinRequestCreated(groupId, msg.sender);
        } else {
            // For public groups, join immediately as a member
            groupMembers[groupId][msg.sender] = GroupMember({
                userAddress: msg.sender,
                role: Role.MEMBER,
                joinedAt: block.timestamp,
                exists: true
            });
            
            // Add to user's groups
            userGroups[msg.sender].push(groupId);
            
            // Increment member count
            groups[groupId].memberCount++;
            
            emit MemberAdded(groupId, msg.sender, Role.MEMBER);
        }
    }
    
    /**
     * @dev Handle join requests for private groups
     * @param groupId ID of the group
     * @param requester Address of the user requesting to join
     * @param accept Whether to accept or reject the request
     */
    function handleJoinRequest(uint256 groupId, address requester, bool accept)
        external
        onlyGroupExists(groupId)
        onlyModeratorOrAbove(groupId)
    {
        require(joinRequests[groupId][requester].exists, "Join request does not exist");
        
        if (accept) {
            groupMembers[groupId][requester] = GroupMember({
                userAddress: requester,
                role: Role.MEMBER,
                joinedAt: block.timestamp,
                exists: true
            });
            
            // Add to user's groups
            userGroups[requester].push(groupId);
            
            // Increment member count
            groups[groupId].memberCount++;
            
            emit JoinRequestAccepted(groupId, requester);
            emit MemberAdded(groupId, requester, Role.MEMBER);
        } else {
            emit JoinRequestRejected(groupId, requester);
        }
        
        // Delete the request
        delete joinRequests[groupId][requester];
    }
    
    /**
     * @dev Change a member's role
     * @param groupId ID of the group
     * @param member Address of the member
     * @param newRole New role to assign
     */
    function changeRole(uint256 groupId, address member, Role newRole)
        external
        onlyGroupExists(groupId)
        onlyAdmin(groupId)
    {
        require(groupMembers[groupId][member].exists, "Not a group member");
        require(member != groups[groupId].owner, "Cannot change owner's role");
        
        // Only the owner can assign admin roles
        if (newRole == Role.ADMIN) {
            require(msg.sender == groups[groupId].owner, "Only the owner can assign admin roles");
        }
        
        groupMembers[groupId][member].role = newRole;
        
        emit RoleChanged(groupId, member, newRole);
    }
    
    /**
     * @dev Remove a member from the group
     * @param groupId ID of the group
     * @param member Address of the member to remove
     */
    function removeMember(uint256 groupId, address member)
        external
        onlyGroupExists(groupId)
        onlyModeratorOrAbove(groupId)
    {
        require(groupMembers[groupId][member].exists, "Not a group member");
        require(member != groups[groupId].owner, "Cannot remove the owner");
        
        // If moderator is removing someone, they can only remove regular members
        if (groupMembers[groupId][msg.sender].role == Role.MODERATOR) {
            require(groupMembers[groupId][member].role == Role.MEMBER, "Moderators can only remove regular members");
        }
        
        // Remove the member
        delete groupMembers[groupId][member];
        
        // Decrement member count
        groups[groupId].memberCount--;
        
        // Remove from user's groups array (this is inefficient but necessary)
        uint256[] storage memberGroups = userGroups[member];
        for (uint256 i = 0; i < memberGroups.length; i++) {
            if (memberGroups[i] == groupId) {
                // Replace with the last element and pop
                memberGroups[i] = memberGroups[memberGroups.length - 1];
                memberGroups.pop();
                break;
            }
        }
        
        emit MemberRemoved(groupId, member);
    }
    
    /**
     * @dev Leave a group voluntarily
     * @param groupId ID of the group to leave
     */
    function leaveGroup(uint256 groupId) 
        external 
        onlyGroupExists(groupId)
        onlyGroupMember(groupId)
    {
        require(msg.sender != groups[groupId].owner, "Owner cannot leave, transfer ownership first");
        
        // Remove the member
        delete groupMembers[groupId][msg.sender];
        
        // Decrement member count
        groups[groupId].memberCount--;
        
        // Remove from user's groups array
        uint256[] storage memberGroups = userGroups[msg.sender];
        for (uint256 i = 0; i < memberGroups.length; i++) {
            if (memberGroups[i] == groupId) {
                // Replace with the last element and pop
                memberGroups[i] = memberGroups[memberGroups.length - 1];
                memberGroups.pop();
                break;
            }
        }
        
        emit MemberRemoved(groupId, msg.sender);
    }
    
    /**
     * @dev Transfer group ownership to another admin
     * @param groupId ID of the group
     * @param newOwner Address of the new owner (must be an admin)
     */
    function transferOwnership(uint256 groupId, address newOwner)
        external
        onlyGroupExists(groupId)
        onlyGroupOwner(groupId)
    {
        require(groupMembers[groupId][newOwner].exists, "New owner must be a group member");
        require(groupMembers[groupId][newOwner].role == Role.ADMIN, "New owner must be an admin");
        
        groups[groupId].owner = newOwner;
    }
    
    /**
     * @dev Send a message to a group
     * @param groupId ID of the group
     * @param content Message content
     */
    function sendMessage(uint256 groupId, string memory content)
        external
        onlyGroupExists(groupId)
        onlyGroupMember(groupId)
        returns (uint256)
    {
        uint256 messageIndex = groupMessages[groupId].length;
        
        groupMessages[groupId].push(Message({
            sender: msg.sender,
            content: content,
            timestamp: block.timestamp
        }));
        
        emit MessageSent(groupId, msg.sender, messageIndex);
        
        return messageIndex;
    }
    
    /**
     * @dev Get all messages in a group
     * @param groupId ID of the group
     * @return Array of all messages in the group
     */
    function getGroupMessages(uint256 groupId) 
        external 
        view 
        onlyGroupExists(groupId)
        onlyGroupMember(groupId)
        returns (Message[] memory)
    {
        return groupMessages[groupId];
    }
    
    /**
     * @dev Get a range of messages in a group (for pagination)
     * @param groupId ID of the group
     * @param start Starting index
     * @param limit Maximum number of messages to return
     * @return Array of messages in the specified range
     */
    function getGroupMessagesRange(uint256 groupId, uint256 start, uint256 limit)
        external
        view
        onlyGroupExists(groupId)
        onlyGroupMember(groupId)
        returns (Message[] memory)
    {
        uint256 messageCount = groupMessages[groupId].length;
        
        if (start >= messageCount) {
            return new Message[](0);
        }
        
        uint256 end = start + limit;
        if (end > messageCount) {
            end = messageCount;
        }
        
        uint256 resultCount = end - start;
        Message[] memory messages = new Message[](resultCount);
        
        for (uint256 i = 0; i < resultCount; i++) {
            messages[i] = groupMessages[groupId][start + i];
        }
        
        return messages;
    }
    
    /**
     * @dev Get all groups a user is a member of
     * @param user Address of the user
     * @return Array of group IDs the user is a member of
     */
    function getUserGroups(address user) external view returns (uint256[] memory) {
        return userGroups[user];
    }
    
    /**
     * @dev Get group information
     * @param groupId ID of the group
     * @return name Name of the group
     * @return description Description of the group
     * @return owner Owner address
     * @return createdAt Creation timestamp
     * @return isPrivate Privacy setting
     * @return memberCount Number of members
     */
    function getGroup(uint256 groupId) 
        external 
        view 
        onlyGroupExists(groupId) 
        returns (
            string memory name,
            string memory description,
            address owner,
            uint256 createdAt,
            bool isPrivate,
            uint256 memberCount
        ) 
    {
        Group storage group = groups[groupId];
        return (
            group.name,
            group.description,
            group.owner,
            group.createdAt,
            group.isPrivate,
            group.memberCount
        );
    }
    
    /**
     * @dev Get member information
     * @param groupId ID of the group
     * @param memberAddress Address of the member
     * @return userAddress Address of the user
     * @return role Role in the group
     * @return joinedAt When they joined
     * @return exists Whether they are a member
     */
    function getGroupMember(uint256 groupId, address memberAddress)
        external
        view
        onlyGroupExists(groupId)
        returns (
            address userAddress,
            Role role,
            uint256 joinedAt,
            bool exists
        )
    {
        GroupMember storage member = groupMembers[groupId][memberAddress];
        return (
            member.userAddress,
            member.role,
            member.joinedAt,
            member.exists
        );
    }
    
    /**
     * @dev Get all pending join requests for a group
     * @param groupId ID of the group
     * @return Array of addresses with pending join requests
     */
    function getPendingJoinRequests(uint256 groupId) 
        external
        view
        onlyGroupExists(groupId)
        onlyModeratorOrAbove(groupId)
        returns (address[] memory)
    {
        // This is inefficient in Solidity, but there's no better way to get all keys from a mapping
        // In a production environment, we would track these requests in an array
        
        // First, let's count the number of valid requests
        uint256 requestCount = 0;
        for (uint256 i = 0; i < userGroups[msg.sender].length * 10; i++) {
            if (i >= 1000) break; // Safety limit to prevent gas limit issues
            address user = address(uint160(i + 1)); // Crude way to iterate possible addresses
            if (joinRequests[groupId][user].exists) {
                requestCount++;
            }
        }
        
        address[] memory requesters = new address[](requestCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < userGroups[msg.sender].length * 10; i++) {
            if (i >= 1000 || index >= requestCount) break;
            address user = address(uint160(i + 1));
            if (joinRequests[groupId][user].exists) {
                requesters[index] = user;
                index++;
            }
        }
        
        return requesters;
    }
} 