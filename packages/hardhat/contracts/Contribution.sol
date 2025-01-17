// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./libraries/DataTypes.sol";
import "./libraries/Errors.sol";

/**
 * Contract to store contributions and operate with them.
 */
contract Contribution is ERC721Upgradeable, OwnableUpgradeable, PausableUpgradeable {
  using Counters for Counters.Counter;

  event Published(uint256 indexed tokenId, DataTypes.ContributionParams params);
  event ProofPosted(uint256 indexed tokenId, DataTypes.ContributionProof proof);
  event Closed(uint256 indexed tokenId, DataTypes.ContributionParams params);
  event AccountReputationSet(address indexed accountAddress, DataTypes.ContributionAccountReputation accountReputation);

  string _imageSVG;
  Counters.Counter private _counter;
  mapping(uint256 => DataTypes.ContributionParams) private _params;
  mapping(uint256 => DataTypes.ContributionProof[]) private _proofs;
  mapping(address => DataTypes.ContributionAccountReputation) private _accountReputations;

  function initialize() public initializer {
    __ERC721_init("Family Contribution", "FC");
    __Ownable_init();
    __Pausable_init();
    _imageSVG = '<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M159.755 184.264H191.499V193.8H171.083V202.184H185.995V211.08H171.083V229H159.755V184.264ZM199.902 229.96C196.062 229.96 192.947 229.043 190.558 227.208C188.211 225.331 187.038 222.728 187.038 219.4C187.038 215.944 188.168 213.299 190.43 211.464C192.734 209.587 196.019 208.648 200.286 208.648C201.95 208.648 203.614 208.84 205.278 209.224C206.942 209.565 208.371 210.035 209.566 210.632V209.992C209.566 206.707 206.878 205.064 201.502 205.064C197.747 205.064 194.312 205.789 191.198 207.24V199.496C192.563 198.856 194.355 198.344 196.574 197.96C198.792 197.533 201.096 197.32 203.486 197.32C209.203 197.32 213.512 198.472 216.414 200.776C219.358 203.037 220.83 206.216 220.83 210.312V229H210.27V226.376C209.118 227.485 207.667 228.36 205.918 229C204.168 229.64 202.163 229.96 199.902 229.96ZM203.23 223.048C204.552 223.048 205.79 222.792 206.942 222.28C208.094 221.725 208.968 221.021 209.566 220.168V217.48C207.731 216.243 205.64 215.624 203.294 215.624C201.8 215.624 200.648 215.944 199.838 216.584C199.027 217.224 198.622 218.163 198.622 219.4C198.622 220.552 199.006 221.448 199.774 222.088C200.584 222.728 201.736 223.048 203.23 223.048ZM226.255 198.28H236.687V201.608C237.967 200.243 239.439 199.197 241.103 198.472C242.767 197.704 244.538 197.32 246.415 197.32C248.719 197.32 250.554 197.661 251.919 198.344C253.327 199.027 254.458 200.051 255.311 201.416C256.591 200.136 258.148 199.133 259.983 198.408C261.818 197.683 263.674 197.32 265.551 197.32C269.604 197.32 272.484 198.365 274.191 200.456C275.898 202.504 276.751 205.469 276.751 209.352V229H265.999V210.952C265.999 209.245 265.679 208.008 265.039 207.24C264.399 206.472 263.332 206.088 261.839 206.088C259.919 206.088 258.362 206.771 257.167 208.136C257.21 208.861 257.231 209.971 257.231 211.464V229H246.479V210.504C246.479 208.925 246.202 207.795 245.647 207.112C245.092 206.429 244.111 206.088 242.703 206.088C240.527 206.088 238.65 207.304 237.071 209.736V229H226.255V198.28ZM288.209 194.184C286.502 194.184 285.073 193.629 283.921 192.52C282.769 191.411 282.193 190.003 282.193 188.296C282.193 186.632 282.769 185.245 283.921 184.136C285.073 182.984 286.502 182.408 288.209 182.408C289.873 182.408 291.281 182.984 292.433 184.136C293.627 185.245 294.225 186.632 294.225 188.296C294.225 189.96 293.627 191.368 292.433 192.52C291.281 193.629 289.873 194.184 288.209 194.184ZM282.577 198.28H293.841V229H282.577V198.28ZM300.005 181.704H311.269V229H300.005V181.704ZM326.477 241.672C325.112 241.672 323.682 241.565 322.189 241.352C320.696 241.181 319.586 240.925 318.861 240.584V232.2C320.098 232.712 321.506 232.968 323.085 232.968C324.493 232.968 325.581 232.648 326.349 232.008C327.16 231.411 327.8 230.451 328.269 229.128L329.037 227.08L315.725 198.28H326.989L334.989 218.248L342.541 198.28H353.805L341.133 230.408C339.64 234.248 337.72 237.085 335.373 238.92C333.069 240.755 330.104 241.672 326.477 241.672ZM83.734 326.96C78.87 326.96 74.582 326.021 70.87 324.144C67.2007 322.267 64.3633 319.579 62.358 316.08C60.3527 312.539 59.35 308.4 59.35 303.664C59.35 298.928 60.3527 294.811 62.358 291.312C64.3633 287.771 67.2007 285.061 70.87 283.184C74.582 281.264 78.87 280.304 83.734 280.304C86.934 280.304 89.7927 280.624 92.31 281.264C94.8273 281.904 97.1527 282.907 99.286 284.272V295.024C97.4087 293.531 95.2753 292.443 92.886 291.76C90.5393 291.077 87.83 290.736 84.758 290.736C80.3633 290.736 76.9713 291.888 74.582 294.192C72.1927 296.453 70.998 299.611 70.998 303.664C70.998 307.717 72.1927 310.896 74.582 313.2C77.014 315.504 80.406 316.656 84.758 316.656C87.83 316.656 90.582 316.293 93.014 315.568C95.446 314.843 97.7073 313.691 99.798 312.112V322.8C95.7447 325.573 90.39 326.96 83.734 326.96ZM120.294 326.96C116.497 326.96 113.169 326.277 110.31 324.912C107.451 323.504 105.233 321.584 103.654 319.152C102.118 316.677 101.35 313.84 101.35 310.64C101.35 307.44 102.118 304.624 103.654 302.192C105.233 299.717 107.451 297.797 110.31 296.432C113.169 295.024 116.497 294.32 120.294 294.32C124.091 294.32 127.419 295.024 130.278 296.432C133.137 297.797 135.334 299.717 136.87 302.192C138.449 304.624 139.238 307.44 139.238 310.64C139.238 313.84 138.449 316.677 136.87 319.152C135.334 321.584 133.137 323.504 130.278 324.912C127.419 326.277 124.091 326.96 120.294 326.96ZM120.294 318.192C122.555 318.192 124.347 317.531 125.67 316.208C127.035 314.843 127.718 312.987 127.718 310.64C127.718 308.293 127.035 306.459 125.67 305.136C124.347 303.771 122.555 303.088 120.294 303.088C118.033 303.088 116.219 303.771 114.854 305.136C113.531 306.459 112.87 308.293 112.87 310.64C112.87 312.987 113.531 314.843 114.854 316.208C116.219 317.531 118.033 318.192 120.294 318.192ZM143.693 295.28H154.573V298.672C155.895 297.221 157.495 296.133 159.373 295.408C161.25 294.683 163.213 294.32 165.261 294.32C169.57 294.32 172.749 295.451 174.797 297.712C176.887 299.931 177.933 302.96 177.933 306.8V326H166.669V308.272C166.669 304.816 165.09 303.088 161.933 303.088C160.482 303.088 159.159 303.429 157.965 304.112C156.77 304.752 155.767 305.755 154.957 307.12V326H143.693V295.28ZM196.692 326.96C192.895 326.96 190.015 325.915 188.052 323.824C186.132 321.691 185.172 318.789 185.172 315.12V303.088H180.82V295.28H185.172V286.064H196.436V295.28H203.476V303.088H196.436V313.584C196.436 315.248 196.735 316.443 197.332 317.168C197.972 317.893 199.081 318.256 200.66 318.256C202.068 318.256 203.476 317.872 204.884 317.104V325.488C203.775 326 202.58 326.363 201.3 326.576C200.063 326.832 198.527 326.96 196.692 326.96ZM208.068 295.28H218.948V299.12C220.142 297.755 221.828 296.709 224.003 295.984C226.18 295.216 228.59 294.832 231.236 294.832V303.472C228.42 303.472 225.924 303.877 223.748 304.688C221.614 305.499 220.142 306.715 219.332 308.336V326H208.068V295.28ZM240.459 291.184C238.752 291.184 237.323 290.629 236.171 289.52C235.019 288.411 234.443 287.003 234.443 285.296C234.443 283.632 235.019 282.245 236.171 281.136C237.323 279.984 238.752 279.408 240.459 279.408C242.123 279.408 243.531 279.984 244.683 281.136C245.877 282.245 246.475 283.632 246.475 285.296C246.475 286.96 245.877 288.368 244.683 289.52C243.531 290.629 242.123 291.184 240.459 291.184ZM234.827 295.28H246.091V326H234.827V295.28ZM274.015 326.96C269.62 326.96 265.994 325.616 263.135 322.928V326H252.255V278.704H263.519V297.776C264.756 296.709 266.292 295.877 268.127 295.28C270.004 294.64 271.967 294.32 274.015 294.32C277.258 294.32 280.095 295.003 282.527 296.368C285.002 297.733 286.922 299.675 288.287 302.192C289.652 304.667 290.335 307.504 290.335 310.704C290.335 313.947 289.652 316.805 288.287 319.28C286.922 321.712 285.002 323.611 282.527 324.976C280.052 326.299 277.215 326.96 274.015 326.96ZM271.071 318.256C273.375 318.256 275.231 317.595 276.639 316.272C278.047 314.907 278.751 313.051 278.751 310.704C278.751 308.357 278.047 306.501 276.639 305.136C275.231 303.771 273.375 303.088 271.071 303.088C269.364 303.088 267.828 303.536 266.463 304.432C265.098 305.285 264.116 306.459 263.519 307.952V313.392C264.116 314.885 265.098 316.08 266.463 316.976C267.828 317.829 269.364 318.256 271.071 318.256ZM305.545 326.96C301.321 326.96 298.142 325.787 296.009 323.44C293.918 321.093 292.873 318 292.873 314.16V295.28H304.137V312.88C304.137 316.421 305.737 318.192 308.937 318.192C310.387 318.192 311.71 317.851 312.905 317.168C314.099 316.485 315.081 315.483 315.849 314.16V295.28H327.113V326H316.233V322.672C314.91 324.08 313.31 325.147 311.433 325.872C309.555 326.597 307.593 326.96 305.545 326.96ZM346.192 326.96C342.395 326.96 339.515 325.915 337.552 323.824C335.632 321.691 334.672 318.789 334.672 315.12V303.088H330.32V295.28H334.672V286.064H345.936V295.28H352.976V303.088H345.936V313.584C345.936 315.248 346.235 316.443 346.832 317.168C347.472 317.893 348.581 318.256 350.16 318.256C351.568 318.256 352.976 317.872 354.384 317.104V325.488C353.275 326 352.08 326.363 350.8 326.576C349.563 326.832 348.027 326.96 346.192 326.96ZM363.584 291.184C361.877 291.184 360.448 290.629 359.296 289.52C358.144 288.411 357.568 287.003 357.568 285.296C357.568 283.632 358.144 282.245 359.296 281.136C360.448 279.984 361.877 279.408 363.584 279.408C365.248 279.408 366.656 279.984 367.808 281.136C369.002 282.245 369.6 283.632 369.6 285.296C369.6 286.96 369.002 288.368 367.808 289.52C366.656 290.629 365.248 291.184 363.584 291.184ZM357.952 295.28H369.216V326H357.952V295.28ZM393.044 326.96C389.247 326.96 385.919 326.277 383.06 324.912C380.201 323.504 377.983 321.584 376.404 319.152C374.868 316.677 374.1 313.84 374.1 310.64C374.1 307.44 374.868 304.624 376.404 302.192C377.983 299.717 380.201 297.797 383.06 296.432C385.919 295.024 389.247 294.32 393.044 294.32C396.841 294.32 400.169 295.024 403.028 296.432C405.887 297.797 408.084 299.717 409.62 302.192C411.199 304.624 411.988 307.44 411.988 310.64C411.988 313.84 411.199 316.677 409.62 319.152C408.084 321.584 405.887 323.504 403.028 324.912C400.169 326.277 396.841 326.96 393.044 326.96ZM393.044 318.192C395.305 318.192 397.097 317.531 398.42 316.208C399.785 314.843 400.468 312.987 400.468 310.64C400.468 308.293 399.785 306.459 398.42 305.136C397.097 303.771 395.305 303.088 393.044 303.088C390.783 303.088 388.969 303.771 387.604 305.136C386.281 306.459 385.62 308.293 385.62 310.64C385.62 312.987 386.281 314.843 387.604 316.208C388.969 317.531 390.783 318.192 393.044 318.192ZM416.443 295.28H427.323V298.672C428.645 297.221 430.245 296.133 432.123 295.408C434 294.683 435.963 294.32 438.011 294.32C442.32 294.32 445.499 295.451 447.547 297.712C449.637 299.931 450.683 302.96 450.683 306.8V326H439.419V308.272C439.419 304.816 437.84 303.088 434.683 303.088C433.232 303.088 431.909 303.429 430.715 304.112C429.52 304.752 428.517 305.755 427.707 307.12V326H416.443V295.28Z" fill="#9747FF"/></svg>';
  }

  /// ***************************
  /// ***** OWNER FUNCTIONS *****
  /// ***************************

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function setImageSVG(string memory imageSVG) public onlyOwner {
    _imageSVG = imageSVG;
  }

  /// **************************
  /// ***** USER FUNCTIONS *****
  /// **************************

  function publish(
    string memory description,
    uint reward,
    address[] memory potentialContributors
  ) public payable whenNotPaused returns (uint256) {
    // Base checks
    if (msg.value != reward) revert Errors.MessageValueMismatch();
    if (reward <= 0) revert Errors.RewardInvalid();
    // Update counter
    _counter.increment();
    // Mint token
    uint256 newTokenId = _counter.current();
    _mint(msg.sender, newTokenId);
    // Set params
    DataTypes.ContributionParams memory tokenParams = DataTypes.ContributionParams(
      block.timestamp,
      msg.sender,
      description,
      reward,
      potentialContributors,
      address(0),
      false
    );
    _params[newTokenId] = tokenParams;
    emit Published(newTokenId, tokenParams);
    // Return
    return newTokenId;
  }

  function postProof(uint256 tokenId, string memory extraDataURI) public whenNotPaused {
    // Base Checks
    if (!_exists(tokenId)) revert Errors.TokenDoesNotExist();
    if (_params[tokenId].isClosed) revert Errors.ContributionClosed();
    if (_params[tokenId].authorAddress != msg.sender && !_isPotentialContributor(tokenId, msg.sender))
      revert Errors.NotPotentialContributor();
    // Add proof
    DataTypes.ContributionProof memory proof = DataTypes.ContributionProof(block.timestamp, msg.sender, extraDataURI);
    _proofs[tokenId].push(proof);
    emit ProofPosted(tokenId, proof);
  }

  function confirmContributor(uint256 tokenId, address confirmedContributor) public whenNotPaused {
    // Base checks
    if (!_exists(tokenId)) revert Errors.TokenDoesNotExist();
    if (_params[tokenId].isClosed) revert Errors.ContributionClosed();
    if (_params[tokenId].authorAddress != msg.sender) revert Errors.NotAuthor();
    if (!_isPotentialContributor(tokenId, confirmedContributor)) revert Errors.NotPotentialContributor();
    // Update params
    _params[tokenId].confirmedContributor = confirmedContributor;
    _params[tokenId].isClosed = true;
    emit Closed(tokenId, _params[tokenId]);
    // Update reputation
    _accountReputations[confirmedContributor].confirmedContributions++;
    emit AccountReputationSet(confirmedContributor, _accountReputations[confirmedContributor]);
    // Send reward
    (bool sent, ) = confirmedContributor.call{value: _params[tokenId].reward}("");
    if (!sent) revert Errors.SendingRewardFailed();
  }

  /// *********************************
  /// ***** PUBLIC VIEW FUNCTIONS *****
  /// *********************************

  function getImageSVG() public view returns (string memory) {
    return _imageSVG;
  }

  function getCurrentCounter() public view returns (uint) {
    return _counter.current();
  }

  function getParams(uint256 tokenId) public view returns (DataTypes.ContributionParams memory) {
    return _params[tokenId];
  }

  function getProofs(uint256 tokenId) public view returns (DataTypes.ContributionProof[] memory) {
    return _proofs[tokenId];
  }

  function getAccountReputation(
    address accountAddress
  ) public view returns (DataTypes.ContributionAccountReputation memory) {
    return _accountReputations[accountAddress];
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    return
      string(
        abi.encodePacked(
          "data:application/json;base64,",
          Base64.encode(
            abi.encodePacked(
              '{"name":"Family Contribution #',
              Strings.toString(tokenId),
              '","image":"data:image/svg+xml;base64,',
              Base64.encode(abi.encodePacked(_imageSVG)),
              '","attributes":[{"trait_type":"id","value":"',
              Strings.toString(tokenId),
              '"},{"trait_type":"author","value":"',
              Strings.toHexString(uint160(_params[tokenId].authorAddress)),
              '"},{"trait_type":"description","value":"',
              _params[tokenId].description,
              '"},{"trait_type":"reward","value":"',
              Strings.toString(_params[tokenId].reward),
              '"},{"trait_type":"is closed","value":"',
              _params[tokenId].isClosed ? "true" : "false",
              '"}]}'
            )
          )
        )
      );
  }

  /// ******************************
  /// ***** INTERNAL FUNCTIONS *****
  /// ******************************

  function _isPotentialContributor(uint256 tokenId, address accountAddress) internal view returns (bool) {
    for (uint i = 0; i < _params[tokenId].potentialContributors.length; i++) {
      if (_params[tokenId].potentialContributors[i] == accountAddress) {
        return true;
      }
    }
    return false;
  }

  /**
   * Hook that is called before any token transfer.
   */
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override(ERC721Upgradeable) {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    // Disable transfers except minting
    if (from != address(0)) revert Errors.TokenNotTransferable();
  }
}
