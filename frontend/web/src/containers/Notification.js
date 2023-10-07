import React, { useState, useEffect } from "react";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { ButtonGroup, ToggleButton, Accordion } from "react-bootstrap";
import socketIOClient from 'socket.io-client';

import "./styles/Notification.css";
import API from "../services/API.js";

const Notification = () => {
    const [selectedCategory, setSelectedCategory] = useState("PENDING");
    const [categoryMap, setCategoryMap] = useState({
        "forum topic": {
            "PENDING": [],
            "COMPLETED": [],
        },
        "contact us": {
            "PENDING": [],
            "COMPLETED": [],
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get(`/admin/notifications`);
                const notifications = response.data.notifications;

                const categoryMap = {
                    "forum topic": {
                        "PENDING": [],
                        "COMPLETED": [],
                    },
                    "contact us": {
                        "PENDING": [],
                        "COMPLETED": [],
                    },
                };

                for (const notification of notifications) {
                    notification.category = notification.isPending ? "PENDING" : "COMPLETED";

                    if (notification.content.toLowerCase().includes("forum topic")) {
                        categoryMap["forum topic"][notification.category].push(notification);
                    } else if (notification.content.toLowerCase().includes("contact us")) {
                        categoryMap["contact us"][notification.category].push(notification);
                    }
                }

                setCategoryMap(categoryMap)

            } catch (error) {
                console.error(error);
            }
        };

        const socket = socketIOClient('http://localhost:3000');

        socket.on('newContactUsNotification', (message) => {
            fetchData();
        });

        fetchData();
    }, [selectedCategory]);

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const sortTime = (notifications) => {
        return notifications
            .sort((a, b) => {
                const timestampA = new Date(a.createdAt).getTime();
                const timestampB = new Date(b.createdAt).getTime();
                return timestampB - timestampA;
            });
    };

    const formatRelativeTime = (createdAt) => {
        const now = new Date();
        const diffInMilliseconds = now - new Date(createdAt);

        const seconds = Math.floor(diffInMilliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hr${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
        } else {
            return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`;
        }
    };

    return (
        <div className="notification">
            <div
                style={{
                    marginTop: "20px",
                    marginLeft: "30px",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <BreadCrumb name="Notification"></BreadCrumb>
            </div>
            <div
                style={{
                    marginLeft: "2em",
                }}
            >
                <h3>Category</h3>
                <ButtonGroup key="category-group" toggle="true">
                    <ToggleButton
                        key="recent-button"
                        type="radio"
                        variant="warning"
                        name="category"
                        value="PENDING"
                        checked={selectedCategory === "PENDING"}
                        onClick={() => handleCategoryChange("PENDING")}
                    >
                        PENDING
                    </ToggleButton>
                    <ToggleButton
                        key="past-button"
                        type="radio"
                        variant="warning"
                        name="category"
                        value="COMPLETED"
                        checked={selectedCategory === "COMPLETED"}
                        onClick={() => handleCategoryChange("COMPLETED")}
                    >
                        COMPLETED
                    </ToggleButton>
                </ButtonGroup>
                <div style={{ marginTop: "1em", marginLeft: "13em", width: "50em", }}>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Forum Topic</Accordion.Header>
                            <Accordion.Body>
                                {categoryMap['forum topic'][selectedCategory].length > 0 ? (
                                    <div>
                                        {sortTime(categoryMap['forum topic'][selectedCategory]).map((notification, index) => (
                                            <div key={index}>
                                                <div>
                                                    <p>
                                                        <span style={{ float: 'left' }}>{notification.content}</span>
                                                        <span style={{ float: 'right' }}>{formatRelativeTime(notification.createdAt)}</span>
                                                        <div style={{ clear: 'both' }}></div>
                                                    </p>
                                                    <hr style={{ clear: 'both' }}/>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No notifications for Forum Topic</p>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Contact Us</Accordion.Header>
                            <Accordion.Body>
                                {categoryMap['contact us'][selectedCategory].length > 0 ? (
                                    <div>
                                        {sortTime(categoryMap['contact us'][selectedCategory]).map((notification, index) => (
                                            <div key={index}>
                                                <div>
                                                    <p>
                                                        <span style={{ float: 'left' }}>{notification.content}</span>
                                                        <span style={{ float: 'right' }}>{formatRelativeTime(notification.createdAt)}</span>
                                                        <div style={{ clear: 'both' }}></div>
                                                    </p>
                                                    <hr style={{ clear: 'both' }}/>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No notifications for Contact Us</p>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
                <br />
            </div>
        </div>
    );
};

export default Notification;
