# PropertyGo: Peer-to-Peer HDB Resale Platform

PropertyGo is a comprehensive platform designed for the peer-to-peer (P2P) HDB resale market, empowering buyers, sellers, and administrators with tools to streamline property transactions. The platform leverages predictive analytics, secure transactions, and community engagement to enhance the property resale experience.

## Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
    - [User Application (React Native)](#user-application-react-native)
    - [Admin Portal (Web)](#admin-portal-web)
3. [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Setting Up the Admin Portal](#setting-up-the-admin-portal)
    - [Setting Up the User Mobile App](#setting-up-the-user-mobile-app)
4. [Code Structure](#code-structure)
    - [React Native User Application](#react-native-user-application)
    - [Admin Portal](#admin-portal)
5. [Technologies Used](#technologies-used)
    - [Libraries for Admin Portal](#libraries-for-admin-portal)
    - [Libraries for User Mobile App](#libraries-for-user-mobile-app)

## Overview
This repository contains two key components:
1. **Admin Portal**: A web-based interface for managing user accounts, property listings, transactions, and content moderation.
2. **React Native User App**: A mobile application for buyers and sellers to browse properties, interact with the community, and manage their profiles.

---

## Key Features

### User Application (React Native)
- **Property Listings**: View and filter property listings based on preferences such as location, price, and amenities.
- **Predictive Analytics**: AI-powered insights to forecast property trends and market values.
- **User Profiles**: Manage personal details, view transaction history, and track interactions.
- **Community Engagement**: Participate in forums to discuss market trends, share insights, and build connections.
- **Notifications**: Stay informed on new listings, community updates, and transaction milestones.

### Admin Portal (Web)
- **User Management**: Oversee user accounts, roles, and activity logs.
- **Property Management**: Add, edit, and remove property listings with detailed attributes.
- **Content Moderation**: Manage forums, FAQs, and user-generated content to ensure quality.
- **Transaction Monitoring**: Track payments and resolve transaction issues.
- **Analytics and Reports**: Gain insights into user activity, transaction trends, and platform performance.

---

## Installation

### Prerequisites
- Node.js (v14 or above)
- npm or yarn package manager
- Expo CLI for mobile development
- Xcode for iOS development (optional, for iOS builds)

---

### Setting Up the Admin Portal

1. Navigate to the admin frontend directory:
   ```bash
   cd frontend/web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the admin portal:
   ```bash
   npm start
   ```

4. Open the portal in your browser at `http://localhost:3000`.

---

### Setting Up the User Mobile App

1. Navigate to the mobile app directory:
   ```bash
   cd frontend/mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   expo start
   ```

4. For iOS, open the project in Xcode:
   ```bash
   open ios/PropertyGo.xcworkspace
   ```

5. Run the app on an iOS simulator or a connected device.

---

## Code Structure

### React Native User Application

#### Key Components
- **AuthContext.js**: Manages user authentication and session state.
- **PropertyListScreen.js**: Displays a list of properties with search and filter functionalities.
- **PropertyDetailScreen.js**: Provides detailed information about selected properties, including pricing, images, and seller details.
- **UserProfileScreen.js**: Allows users to manage their profiles and view transaction history.
- **NotificationScreen.js**: Displays alerts and updates related to the user's activities.
- **ForumScreen.js**: Enables users to participate in discussions on market trends and property advice.
- **LoginScreen.js, OtpScreen.js**: Handle user authentication through login and OTP verification.

#### Supporting Modules
- **Services**: API integrations for fetching and updating property, user, and transaction data.
- **Utilities**: Shared utility functions for data validation, formatting, and state management.

#### Platform-Specific Setup
- **iOS Configuration**: Podfile and Xcode workspace files for managing dependencies and builds.

---

### Admin Portal

#### Dashboard and User Management
- **Dashboard.js**: Displays platform metrics, including active users and transaction volumes.
- **UsersList.js**: Allows administrators to view and manage user accounts.
- **UserDetail.js**: Provides detailed information about individual users, including activity logs.

#### Property and Content Management
- **AllProperties.js**: Lists all properties with options to edit or remove them.
- **Property.js**: Manage details of individual properties, such as price and status.
- **Faq.js**: Create and update frequently asked questions for user guidance.
- **ForumTopic.js, ForumPost.js**: Monitor and moderate community discussions.

#### Notifications and Transactions
- **Notification.js**: Manage system-wide notifications sent to users.
- **Payment.js**: Oversee transactions and resolve payment-related issues.

#### Analytics
- **BarChartUsersOnboard.js**: Visualize user registration trends.
- **LineGraphCommissionFee.js**: Analyze revenue from transaction fees.

---

## Technologies Used

### Libraries for Admin Portal
- **Charting and Analytics**:
  - `chart.js` and `react-chartjs-2`: For visualizing data trends.
- **Real-time Communication**:
  - `socket.io-client`: For real-time updates and notifications.
- **File Management**:
  - `pdf-lib` and `react-signature-canvas`: To manage and annotate documents.
- **UI Frameworks**:
  - `react-bootstrap` and `react-icons`: For responsive UI components.

### Libraries for User Mobile App
- **Notifications**:
  - `expo-notifications` and `native-notify`: For handling push notifications.
- **Charts**:
  - `react-native-chart-kit` and `victory-native`: For creating data visualizations.
- **File and Media Handling**:
  - `expo-file-system`, `react-native-pdf`, and `react-native-image-picker`: For file and media management.
- **Navigation**:
  - `@react-navigation/*`: Comprehensive navigation solutions for React Native.
- **UI Design**:
  - `react-native-elements` and `react-native-paper`: For creating consistent and intuitive user interfaces.
- **TensorFlow.js**:
  - Provides machine learning capabilities to power predictive analytics, enabling property trend forecasts and market insights.
- **Stripe API**:
  - `@stripe/react-stripe-js` and `@stripe/stripe-js`: Enable secure payment processing and integration with the Stripe platform for handling transactions efficiently.
  
---
