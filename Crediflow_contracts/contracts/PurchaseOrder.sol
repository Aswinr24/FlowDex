// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./StakeHolders.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PurchaseOrder is ReentrancyGuard{

    enum OrderStatus { Created, Accepted, Confirmed, Dispatched, Delivered, Completed, Disputed }

    struct Order {
        address buyer;
        address supplier;
        string orderDetailsHash; // IPFS hash for order details
        string logisticsDetailsHash; // IPFS hash for logistics details
        string estimateInvoiceHash; // IPFS hash for estimate invoice
        uint256 totalAmount; // Total amount for the order
        uint256 escrowAmount; // Escrow amount held in contract
        uint256 remainingAmount; // Remaining amount to be paid after escrow
        string estimatedDeliveryDate; // Estimated delivery date provided by the supplier
        OrderStatus status;
        string finalInvoiceHash; // IPFS hash for final invoice
    }

    StakeHolders private stakeHoldersContract;

    mapping(uint256 => Order) public orders;
    uint256 public orderCount;

    event OrderRequested(uint256 indexed orderId, address indexed buyer, address indexed supplier);
    event OrderAccepted(uint256 indexed orderId, address indexed supplier, address indexed buyer);
    event OrderDispatched(uint256 indexed orderId, address indexed supplier);
    event OrderDelivered(uint256 indexed orderId, address indexed supplier);
    event OrderCompleted(uint256 indexed orderId, address indexed buyer, address indexed supplier, uint256 totalAmount);
    event OrderDisputed(uint256 indexed orderId, address indexed buyer, address indexed supplier);

    modifier onlyBuyer(uint256 _orderId) {
        require(stakeHoldersContract.walletToStakeholder(msg.sender) == StakeHolders.StakeholderType.Buyer, "Only buyers can perform this action");
        require(orders[_orderId].buyer == msg.sender, "Only the buyer can perform this action");
        _;
    }

    modifier onlySupplier(uint256 _orderId) {
        require(stakeHoldersContract.walletToStakeholder(msg.sender) == StakeHolders.StakeholderType.Supplier, "Only suppliers can perform this action");
        require(orders[_orderId].supplier == msg.sender, "Only the supplier can perform this action");
        _;
    }

    modifier onlyArbiter() {
        require(stakeHoldersContract.walletToStakeholder(msg.sender) == StakeHolders.StakeholderType.Arbiter, "Only the arbiter can perform this action");
        _;
    }

    constructor(address _stakeHoldersContractAddress) {
        stakeHoldersContract = StakeHolders(_stakeHoldersContractAddress);
    }

    // Buyer requests a Purchase Order with the details
    function requestOrder(address _supplier, string memory _orderDetailsHash ) public {
        require(stakeHoldersContract.walletToStakeholder(_supplier) == StakeHolders.StakeholderType.Supplier, "Supplier not registered");
        
        orderCount++;
        orders[orderCount] = Order({
            buyer: msg.sender,
            supplier: _supplier,
            orderDetailsHash: _orderDetailsHash,
            logisticsDetailsHash: "",
            estimateInvoiceHash: "",
            totalAmount: 0,
            escrowAmount: 0,
            remainingAmount: 0,
            estimatedDeliveryDate: "",
            status: OrderStatus.Created,
            finalInvoiceHash: ""
        });

        emit OrderRequested(orderCount, msg.sender, _supplier);
    }

    // Function for the supplier to retrieve the order details hash
    function getOrderDetailsHash(uint256 _orderId) public view onlySupplier(_orderId) returns (string memory) {
        return orders[_orderId].orderDetailsHash;
    }

    // Supplier accepts the Purchase Order and provides the estimated delivery date and estimate invoice
    function acceptOrder(uint256 _orderId, string memory _estimateInvoiceHash, uint256 _totalAmount, string memory _estimatedDeliveryDate) public onlySupplier(_orderId) {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Created, "Order not in Created status");
        
        order.estimateInvoiceHash = _estimateInvoiceHash;
        order.totalAmount = _totalAmount;
        order.escrowAmount = _totalAmount / 2; 
        order.remainingAmount = _totalAmount - order.escrowAmount;
        order.estimatedDeliveryDate = _estimatedDeliveryDate;
        order.status = OrderStatus.Accepted;

        emit OrderAccepted(_orderId, msg.sender, order.buyer);
    }

    // Buyer pays part of the money held in escrow to create the Purchase Order
    function payEscrow(uint256 _orderId) public payable onlyBuyer(_orderId) {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Accepted, "Order not in Accepted status");
        require(msg.value == order.escrowAmount, "Incorrect escrow amount");

        // Payment is held in the contract as escrow
        order.status = OrderStatus.Confirmed;
    }

    // Supplier updates order details during the logistics process
    function updateLogistics(uint256 _orderId, string memory _logisticsDetailsHash) public onlySupplier(_orderId) {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Confirmed, "Initial Payment Not Done Yet");
        
        order.logisticsDetailsHash = _logisticsDetailsHash;
        order.status = OrderStatus.Dispatched;
        emit OrderDispatched(_orderId, msg.sender);
    }

    function confirmDelivery(uint256 _orderId, string memory _finalInvoiceHash) public onlySupplier(_orderId) {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Dispatched, "Order not in Dispatched status");
        order.finalInvoiceHash = _finalInvoiceHash;
        order.status = OrderStatus.Delivered;
        emit OrderDelivered(_orderId, msg.sender);
    }

    // Buyer verifies delivery and pays the remaining amount
    function completeOrder(uint256 _orderId) public payable onlyBuyer(_orderId) {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Delivered, "Order not in Delivered status");
        require(msg.value == order.remainingAmount, "Incorrect remaining amount");

        payable(order.supplier).transfer(order.escrowAmount + msg.value);

        order.status = OrderStatus.Completed;

        emit OrderCompleted(_orderId, order.buyer, order.supplier, order.totalAmount);
    }

    // Retrieve the estimate invoice hash, delivery date, total amount, and escrow amount after order acceptance
    function getOrderEstimateDetails(uint256 _orderId) public view returns (string memory, string memory, uint256, uint256) {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Accepted, "Order not in Accepted status");

        return (order.estimateInvoiceHash, order.estimatedDeliveryDate, order.totalAmount, order.escrowAmount);
    }

    // Retrieve the final invoice hash after delivery confirmation
    function getFinalInvoiceDetails(uint256 _orderId) public view onlyBuyer(_orderId) returns (string memory, uint256) {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Delivered, "Order not in Delivered status");
        return (order.finalInvoiceHash, order.remainingAmount);
    }

    function raiseDispute(uint256 _orderId) public {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Delivered || order.status == OrderStatus.Dispatched, "Cannot dispute this order status");

        order.status = OrderStatus.Disputed;

        emit OrderDisputed(_orderId, order.buyer, order.supplier);
    }

    // Arbiter resolves the dispute
    function resolveDispute(uint256 _orderId, bool _refundBuyer) public onlyArbiter {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Disputed, "Order not in Disputed status");

        if (_refundBuyer) {
            payable(order.buyer).transfer(order.escrowAmount);
        } else {
            payable(order.supplier).transfer(order.escrowAmount);
        }
        order.status = OrderStatus.Completed;
    }
}
