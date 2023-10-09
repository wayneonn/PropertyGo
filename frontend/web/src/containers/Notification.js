import React, { useState, useEffect } from "react";
import BreadCrumb from "../components/Common/BreadCrumb.js";
import { ButtonGroup, ToggleButton, Accordion } from "react-bootstrap";
import socketIOClient from 'socket.io-client';

import "./styles/Notification.css";
import API from "../services/API.js";

const Notification = () => {
    const [selectedCategory, setSelectedCategory] = useState("PENDING");
    const [categoryMap, setCategoryMap] = useState({
        "partner application": {
            "PENDING": [],
            "HISTORY": [],
        },
        // "contact us": {
        //     "PENDING": [],
        //     "HISTORY": [],
        // },
        "forum topic": {
            "PENDING": [],
            "HISTORY": []
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get(`/admin/notifications`);
                const notifications = response.data.notifications;

                const categoryMap = {
                    "partner application": {
                        "PENDING": [],
                        "HISTORY": [],
                    },
                    // "contact us": {
                    //     "PENDING": [],
                    //     "HISTORY": [],
                    // },
                    "forum topic": {
                        "PENDING": [],
                        "HISTORY": []
                    }
                };

                for (const notification of notifications) {
                    notification.category = notification.isPending ? "PENDING" : "HISTORY";

                    if (notification.content.toLowerCase().includes("partner application")) {
                        categoryMap["partner application"][notification.category].push(notification);
                        // } else if (notification.content.toLowerCase().includes("contact us")) {
                        //    categoryMap["contact us"][notification.category].push(notification);
                    } else if (notification.content.toLowerCase().includes("forum topic")) {
                        categoryMap["forum topic"][notification.category].push(notification);
                    }
                }

                setCategoryMap(categoryMap);

            } catch (error) {
                console.error(error);
            }
        };

        const socket = socketIOClient('http://localhost:3000');

        // socket.on('newContactUsNotification', () => {
        //     fetchData();
        // });

        socket.on('newFlaggedForumTopicNotification', () => {
            fetchData();
        });

        socket.on('newRemoveFlaggedForumTopicNotification', () => {
            fetchData();
        });

        socket.on('newPartnerApplicationNotification', () => {
            fetchData();
        });

        socket.on('newAcceptPartnerApplicationNotification', () => {
            fetchData();
        });

        socket.on('newRejectPartnerApplicationNotification', () => {
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
                <BreadCrumb names={["Home"]} lastname="Notification" links={["/"]}></BreadCrumb>
            </div>
            <div
                style={{
                    marginLeft: "2em",
                }}
            >
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
                        value="HISTORY"
                        checked={selectedCategory === "HISTORY"}
                        onClick={() => handleCategoryChange("HISTORY")}
                    >
                        HISTORY
                    </ToggleButton>
                </ButtonGroup>
                <div style={{ marginTop: "1em", marginLeft: "13em", width: "50em", }}>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Partner Application</Accordion.Header>
                            <Accordion.Body>
                                {categoryMap['partner application'][selectedCategory].length > 0 ? (
                                    <div>
                                        {sortTime(categoryMap['partner application'][selectedCategory]).map((notification, index) => (
                                            <div key={index}>
                                                <div>
                                                    <div>
                                                        <span style={{ float: 'left' }}>{notification.content}</span>
                                                        <span style={{ float: 'right' }}>{formatRelativeTime(notification.createdAt)}</span>
                                                        <div style={{ clear: 'both' }}></div>
                                                    </div>
                                                    <hr style={{ clear: 'both' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No notifications for Partner Application</p>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                        {/* <Accordion.Item eventKey="1">
                            <Accordion.Header>Contact Us</Accordion.Header>
                            <Accordion.Body>
                                {categoryMap['contact us'][selectedCategory].length > 0 ? (
                                    <div>
                                        {sortTime(categoryMap['contact us'][selectedCategory]).map((notification, index) => (
                                            <div key={index}>
                                                <div>
                                                    <div>
                                                        <span style={{ float: 'left' }}>{notification.content}</span>
                                                        <span style={{ float: 'right' }}>{formatRelativeTime(notification.createdAt)}</span>
                                                        <div style={{ clear: 'both' }}></div>
                                                    </div>
                                                    <hr style={{ clear: 'both' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No notifications for Contact Us</p>
                                )}
                            </Accordion.Body>
                        </Accordion.Item> */}
                        {selectedCategory === "HISTORY" && (
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Forum Topic</Accordion.Header>
                                <Accordion.Body>
                                    {categoryMap['forum topic'][selectedCategory].length > 0 ? (
                                        <div>
                                            {sortTime(categoryMap['forum topic'][selectedCategory]).map((notification, index) => (
                                                <div key={index}>
                                                    <div>
                                                        <div>
                                                            <span style={{ float: 'left' }}>{notification.content}</span>
                                                            <span style={{ float: 'right' }}>{formatRelativeTime(notification.createdAt)}</span>
                                                            <div style={{ clear: 'both' }}></div>
                                                        </div>
                                                        <hr style={{ clear: 'both' }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No notifications for Forum Topic</p>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>
                        )}
                    </Accordion>
                </div>
                <br />
            </div>
        </div>
    );
};

export default Notification;
