
# YouTube Backend Mimic

This project is a Backend mimic of YouTube demonstrating its key features like uploading videos, likes, comments, playlists, subscriptions etc.


## Features

- **User Management**: Secure authentication and authorization using JWT
- **Video Management**: Upload, manage, and stream video files
- **Playlist Management**: Create, update, and delete playlists
- **Comments & Likes**: Add, update, delete comments, and like videos
- **Channel Analytics**: Track views, subscribers, likes, and more

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Libraries**: Mongoose, Multer, Cloudinary

### Database Schema

[Model Link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)


## Installation

- Clone the repository:
```bash
  git clone https://github.com/Kartik-ui/youtube_backend
  cd youtube_backend
```
- Install dependencies:
```bash
  npm install
```
## Environment Variables

Add the following environment variables to your .env file

`PORT`
`MONGODB_URI`
`CORS_ORIGIN`
`ACCESS_TOKEN_SECRET`
`ACCESS_TOKEN_EXPIRY`
`REFRESH_TOKEN_SECRET`
`REFRESH_TOKEN_EXPIRY`
`CLOUDINARY_CLOUD_NAME`
`CLOUDINARY_API_KEY`
`CLOUDINARY_API_SECRET`


## Usage

- Start the server:
```bash
  npm start
```
## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss improvements
