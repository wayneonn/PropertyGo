import React, { useState, useEffect } from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

import { Line } from 'react-chartjs-2';

const LineGraphCommissionFeeBreakdown = () => {
    const tokenData = [
        {
            transactionId: 1,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 3,
            transactionItem: "Commission Fee",
            quantity: 10,
            gst: true,
            // sellerId: 2,
            // invoiceId: 1,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 10,
            createdAt: "2023-11-10 14:01:38"
        },
        {
            transactionId: 2,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 20,
            gst: true,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 20,
            createdAt: "2023-10-10 14:01:38"
        },
        {
            transactionId: 3,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 1,
            transactionItem: "Token Purchase",
            quantity: 20,
            gst: true,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 20,
            createdAt: "2023-09-10 14:01:38"
        },
        {
            transactionId: 4,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 4,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 4,
            status: "PENDING",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 50,
            createdAt: "2023-08-10 14:01:38"
        },
        {
            transactionId: 5,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 5,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: true,
            // sellerId: 2,
            // invoiceId: 5,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 10,
        },
        {
            transactionId: 6,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 6,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 10,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 1000,
            createdAt: "2023-07-10 14:01:38"
        },
        {
            onHoldBalance: 1000,
            buyerId: 1,
            propertyId: 11,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PENDING",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 0,
            createdAt: "2023-06-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 1,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 1,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 10,
            createdAt: "2023-05-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 1000,
            createdAt: "2023-04-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 50,
            createdAt: "2023-03-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 5,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 5,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 50,
            createdAt: "2023-02-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 6,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 50,
            createdAt: "2023-01-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 7,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 8,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 50,
            createdAt: "2023-02-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 9,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            invoiceId: 3,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 100,
            buyerId: 1,
            propertyId: 10,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 0,
            createdAt: "2023-03-10 14:01:38"
        },
        {
            onHoldBalance: 1000,
            buyerId: 3,
            propertyId: 10,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PENDING",
            transactionType: "OPTION_FEE",
            paymentAmount: 0,
        },
        {
            transactionId: 1,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 3,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: true,
            // sellerId: 2,
            // invoiceId: 1,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 10,
            createdAt: "2023-04-10 14:01:38"
        },
        {
            transactionId: 2,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 20,
            gst: true,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 20,
        },
        {
            transactionId: 3,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 1,
            transactionItem: "Token Purchase",
            quantity: 20,
            gst: true,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 20,
        },
        {
            transactionId: 4,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 4,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 4,
            status: "PENDING",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            transactionId: 5,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 5,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: true,
            // sellerId: 2,
            // invoiceId: 5,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 10,
        },
        {
            transactionId: 6,
            onHoldBalance: 0,
            buyerId: 1, // buyer
            propertyId: 6,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 10,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 1000,
            createdAt: "2023-05-10 14:01:38"
        },
        {
            onHoldBalance: 1000,
            buyerId: 1,
            propertyId: 11,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PENDING",
            transactionType: "OPTION_FEE",
            paymentAmount: 0,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 1,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 1,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 10,
            createdAt: "2023-06-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 1000,
            createdAt: "2023-07-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 50,
            createdAt: "2023-08-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 5,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 5,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 6,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 7,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 8,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            // invoiceId: 6,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 9,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: true,
            // sellerId: 2,
            invoiceId: 3,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 10,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "TOKEN_PURCHASE",
            paymentAmount: 50,
        },
        {
            onHoldBalance: 1000,
            buyerId: 3,
            propertyId: 10,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PENDING",
            transactionType: "OPTION_FEE",
            paymentAmount: 0,
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 140,
            createdAt: "2023-11-01 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 1040,
            createdAt: "2023-11-01 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 500,
            createdAt: "2023-11-01 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 10,
            createdAt: "2023-11-02 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 1000,
            createdAt: "2023-11-02 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 50,
            createdAt: "2023-11-02 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 500,
            createdAt: "2023-11-03 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 1500,
            createdAt: "2023-11-03 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 550,
            createdAt: "2023-11-03 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 160,
            createdAt: "2023-11-04 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 10500,
            createdAt: "2023-11-04 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 540,
            createdAt: "2023-11-04 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 180,
            createdAt: "2023-11-05 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 2000,
            createdAt: "2023-11-05 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 5440,
            createdAt: "2023-11-05 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 180,
            createdAt: "2023-11-06 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 2000,
            createdAt: "2023-11-06 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 570,
            createdAt: "2023-11-06 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 123,
            createdAt: "2023-11-07 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 321,
            createdAt: "2023-11-07 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 521,
            createdAt: "2023-11-07 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 10,
            createdAt: "2023-11-08 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 9000,
            createdAt: "2023-11-08 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 580,
            createdAt: "2023-11-08 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 140,
            createdAt: "2023-11-09 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 4000,
            createdAt: "2023-11-09 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 760,
            createdAt: "2023-11-09 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 2,
            transactionItem: "Token Purchase",
            quantity: 10,
            gst: false,
            // sellerId: 2,
            // invoiceId: 2,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 300,
            createdAt: "2023-11-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 3,
            transactionItem: "Option Fee",
            quantity: 1,
            gst: false,
            // sellerId: 2,
            // invoiceId: 3,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 2000,
            createdAt: "2023-11-10 14:01:38"
        },
        {
            onHoldBalance: 0,
            buyerId: 1,
            propertyId: 4,
            // sellerId: 2,
            transactionItem: "Token Purchase",
            quantity: 50,
            gst: false,
            // invoiceId: 4,
            status: "PAID",
            transactionType: "COMMISSION_FEE",
            paymentAmount: 1000,
            createdAt: "2023-11-10 14:01:38"
        },
    ];

    const [chartData, setChartData] = useState({});
    const [overall, setOverall] = useState(null);

    const monthOrder = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11
    };

    const filterDataForCurrentMonth = () => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        // Create a date representing the start of the current month
        const startDate = new Date(currentYear, currentMonth, 1);

        // Create a date representing the start of the next month
        const nextMonth = currentMonth + 1;
        const endDate = new Date(currentYear, nextMonth, 1);

        const filteredTokenData = tokenData.filter((item) => item.transactionType === "COMMISSION_FEE").filter((item) => {
            const itemDate = new Date(item.createdAt);
            return itemDate >= startDate && itemDate < endDate;
        });

        return filteredTokenData;
    };


    const groupUsersByCreatedAtMonth = (users) => {
        const groupedUsers = {};
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();

        for (const user of users) {
            const userCreatedAt = new Date(user.createdAt);

            // Check if the user's createdAt date is in the current month and year
            if (
                userCreatedAt.getFullYear() === currentYear &&
                userCreatedAt.getMonth() === currentMonth
            ) {
                // Get the day of the month (e.g., 1 for the 1st day of the month)
                const dayOfMonth = userCreatedAt.getDate();

                // Initialize the day as a key in the groupedUsers object
                if (!groupedUsers[dayOfMonth]) {
                    groupedUsers[dayOfMonth] = 0;
                }

                // Update the value for the day with the desired user data (e.g., user.onHoldBalance or user.paymentAmount)
                groupedUsers[dayOfMonth] += user.onHoldBalance === 0 ? user.paymentAmount : user.onHoldBalance;
            }
        }

        return groupedUsers;
    };

    useEffect(() => {

        let filteredData = "";

        filteredData = filterDataForCurrentMonth();

        const groupedUsers = groupUsersByCreatedAtMonth(filteredData);

        const jsonArray = Object.entries(groupedUsers).map(([key, value]) => {
            return { name: key, count: value };
        });

        const dataSortedByMonth = jsonArray.sort((a, b) => monthOrder[a.name] - monthOrder[b.name]);

        const difference = dataSortedByMonth[dataSortedByMonth.length - 1].count - dataSortedByMonth[0].count;
        const overall = Math.round(difference / dataSortedByMonth[0].count * 100) / 100;

        setOverall(overall);

        const data = {
            labels: dataSortedByMonth.map((data) => data.name),
            datasets: [
                {
                    data: dataSortedByMonth.map((data) => data.count),
                    borderColor: 'rgb(244, 194, 194)',
                    backgroundColor: 'rgba(244, 194, 194)',
                },
            ],
        };

        // Render the chart
        setChartData(data);

    }, []);

    return (
        <div style={{ width: "96%", marginLeft: "1.5em" }}>
            <section className="col-lg-14 connectedSortable">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title" style={{ textAlign: "center" }}>
                            <i className="fas fa-bar-chart mr-1" />
                            Commission Fee as of {new Date().toDateString()}
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="tab-content p-0">
                            <div style={{ textAlign: "right", marginRight: "0" }}>
                                <h5 htmlFor="timePeriodSelect" style={{ marginRight: "1em", color: `${overall > 0 ? `green` : `red`}` }}>
                                    {chartData.length === 0 ? "" : (
                                        <span style={{ backgroundColor: "lightgray", padding: "0 5px" }}>
                                            Overall {overall > 0 ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}{Math.abs(overall)}%
                                        </span>
                                    )}
                                </h5>
                            </div>
                            {chartData.labels && chartData.labels.length > 0 ? (
                                <div>
                                    <Line
                                        data={chartData}
                                        options={{
                                            plugins: {
                                                legend: {
                                                    display: false
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    ticks: {
                                                        precision: 0
                                                    },
                                                    beginAtZero: true,
                                                    stepSize: 1,
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            ) : (
                                <p>No data to show...</p>
                            )}
                        </div>
                    </div>
                    {/* <section className="col-lg-4 connectedSortable">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title" style={{ textAlign: "center" }}>
                            Current Month Gain/Loss
                        </h3>
                    </div>
                    <div className="card-body">
                        <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                            {currentMonthTotal !== null ? `$${currentMonthTotal.toFixed(2)}` : "N/A"}
                        </p>
                    </div>
                </div>
            </section> */}
                </div>
            </section>
        </div>
    );
};

export default LineGraphCommissionFeeBreakdown;