
# Social Networking API

## Overview
This is a RESTful API for a social networking platform developed using Express.js and MongoDB. It implements token-based authentication and authorization using JSON Web Tokens (JWT) and password encryption using bcrypt. The API supports three main models: User, Post, and Follower.

## Hosted Link
- https://social-networking-api-lemon.vercel.app/

## Features
- User authentication and authorization with JWT
- Post management (create, read, update, delete)
- Follower management (follow/unfollow users)
- Get latest posts of followed users
- Get followed user's  followers and followings count


## Technology used
- MongoDB: Database to store and manage data.
- Express.js: Backend framework for building RESTful APIs.
- Node.js: Server-side JavaScript runtime environment.

## Requirements
Before getting started, ensure you have the following installed:
- Node.js and npm: Node.js is the JavaScript runtime, and npm is the package manager for Node.js.
- MongoDB: MongoDB is the NoSQL database used for storing data.


## Configuration
Create a .env file in the server directory of the project and add the necessary environment variables:

- MONGODB_URL
- ACCESS_TOKEN_SECRET 
- ACCESS_TOKEN_EXPIRY
- CORS_ORIGIN = *

Replace the values with your desired configurations, such as  MongoDB URI and a secure JWT secret key.

## Installation

- `git clone https://github.com/maaz64/social-networking-API.git`
- `cd social-networking-API` 
- `npm install` to install all the dependencies.
- `npm start` to start the development server.

## API Documentation
[Click Here](https://documenter.getpostman.com/view/24002220/2sA2xnxA2t) to get the complete documentation of API Endpoints
###

## API Endpoints
### Authentication

#### Register a new user

```http
  POST /api/v1/users/register
```
#### Log in with existing credentials and receive a JWT token

```http
  POST /api/v1/users/login
```
###
### Post

Below API uses token-based authentication. To access protected routes, clients must include the JWT token received upon successful login in the Authorization header as follows:
- Authorization: Bearer <token>


#### Create Post

```http
  POST /api/v1/post/create-post
```

#### Get Single Post

```http
  GET /api/v1/post/get-a-post?postId=1
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `postId`      | `string` | **Required**. Id of Post |


#### Update Post

```http
  PATCH /api/v1/post?postId=1
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `postId`      | `string` | **Required**. Id of Post |

#### Delete Post

```http
  DELETE /api/v1/post?postId=1
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `postId`      | `string` | **Required**. Id of Post |

#### Get latest post of a followed user

```http
  GET /api/v1/post?username=1
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. username of the user |

###

### Follow

#### Follow/Unfollow a user

```http
  POST /api/v1/follower/follow?username=1
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. username of the user |

#### Get Follower and Following of a followed user

```http
  GET /api/v1/users?username=1
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. username of the user |

###


## Dependencies
List of main dependencies used in project.

- express: Fast, unopinionated, minimalist web framework for Node.js.

- mongoose: Elegant MongoDB object modeling for Node.js.
- jsonwebtoken: JSON Web Token implementation for Node.js.
For a complete list of dependencies, check the package.json file.



## Authors

- [@Maaz](https://www.linkedin.com/in/abumaaz/)



