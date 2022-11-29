// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract ChainList {
    // state variables
    struct Article {
        uint256 id;
        address payable seller;
        address payable buyer;
        string name;
        string description;
        uint256 price;
    }

    // state variables
    address owner;
    mapping(uint256 => Article) public articles;
    uint256 articleCounter;

    // event
    event LogSellArticle(
        uint256 _id,
        address indexed _seller,
        string _name,
        uint256 _price
    );

    event LogBuyArticle(
        uint256 _id,
        address indexed _seller,
        address indexed _buyer,
        string _name,
        uint256 _price
    );

    // modifiers
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // sell an article
    function sellArticle(
        string memory _name,
        string memory _description,
        uint256 _price
    ) public {
        // a new article
        articleCounter++;
        articles[articleCounter] = Article(
            articleCounter,
            payable(msg.sender),
            payable(0x0),
            _name,
            _description,
            _price
        );

        // trigger an event
        emit LogSellArticle(articleCounter, msg.sender, _name, _price);
    }

    constructor() {
        owner = msg.sender;
    }

    // get an article
    function getArticle(uint256 _id)
        public
        view
        returns (
            uint256 id,
            address payable _seller,
            address payable _buyer,
            string memory _name,
            string memory _description,
            uint256 _price
        )
    {
        Article memory article = articles[_id];
        return (
            article.id,
            article.seller,
            article.buyer,
            article.name,
            article.description,
            article.price
        );
    }

    // kill the smart contract
    function kill() public onlyOwner {
        selfdestruct(payable(owner));
    }

    // detach the number of articles in the contract
    function getNumberOfArticles() public view returns (uint256) {
        return articleCounter;
    }

    // fetch and return all article IDs available for sale
    function getArticlesForSale() public view returns (uint256[] memory) {
        uint256[] memory articleIds = new uint256[](articleCounter);

        uint256 numberOfArticlesForSale = 0;

        for (uint256 i = 1; i <= articleCounter; i++) {
            // keep the ID if the article is still for sale
            if (articles[i].buyer == address(0x0)) {
                articleIds[numberOfArticlesForSale] = articles[i].id;
                numberOfArticlesForSale++;
            }
        }

        // copy the articleIds array into a smaller forSale array
        uint256[] memory forSale = new uint256[](numberOfArticlesForSale);
        for (uint256 j = 0; j < numberOfArticlesForSale; j++) {
            forSale[j] = articleIds[j];
        }

        return forSale;
    }

    // buy an article
    function buyArticle(uint256 _id) public payable {
        require(
            articleCounter > 0,
            "There should be at least one article on sale"
        );
        require(
            _id > 0 && _id <= articleCounter,
            "The article id should be valid"
        );
        Article memory article = articles[_id];
        require(
            article.buyer == address(0x0),
            "The article has already been sold"
        );
        require(
            article.price == msg.value,
            "The value sent does not match the article price"
        );
        require(
            article.seller != msg.sender,
            "The seller cannot buy his own article"
        );

        // keep buyer's information
        article.buyer = payable(msg.sender);

        article.seller.transfer(msg.value);

        emit LogBuyArticle(
            _id,
            article.seller,
            article.buyer,
            article.name,
            article.price
        );
    }
}
