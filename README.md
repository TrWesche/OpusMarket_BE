# OpusMarket - Backend

## Built With
- Node.js
- Express.js
- Postgres.sql

## Users & Merchants
- The db.sql file contains a variety of sale data to populate the backend excluding orders.
  - 6 Users Are Present - All with a password of "password"
    - cHylda@fakeprovider.com
    - bJonquil@fakeprovider.com
    - eMchumba@fakeprovider.com
    - sRasim@fakeprovider.com
    - aMarlies@fakeprovider.com
    - CAnita@fakeprovider.com
  - 20 Merchants Are Present - All with a password of "passwordpassword" (6 listed, see db.sql for full list)
    - support@graytable.com
    - support@bulbzy.com
    - support@glaazel.com
    - support@superlamp.com
    - support@techshoe.com
    - support@wearsly.com

## Database Schema
`Note: Schema is currently under development and may change significantly throughout the course of development` 
![DB Schema](OpusMarket.png)

### Internal Database Functionalities:
- User Account Management
  - Users
- Merchant Account Management
  - Merchants
- Product Management
  - Products & Associated Tables
- Order Management - Transition point between Square API & Internal System
  - Orders & Orders_Products
- Event Management - Transition point between Discord API & Internal System
  - Events
