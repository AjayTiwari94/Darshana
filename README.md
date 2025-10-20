# Darshana
    DDDDDD   AAAAA   RRRRRR   SSSSS    H   H    AAAAA    N   N    AAAAA
    D    D   A   A   R    R   S        H   H    A   A    NN  N    A   A
    D    D   AAAAA   RRRRR    SSSSS    HHHHH    AAAAA    N N N    AAAAA
    D    D   A   A   R  R          S   H   H    A   A    N  NN    A   A
    DDDDDD   A   A   R   R    SSSSS    H   H    A   A    N   N    A   A

Where history meets myths & tech

---
## Introduction
Shh, It's a Secret 🤫

Darshana is an immersive cultural exploration platform that brings India's rich heritage to life through the power of AI and storytelling. Named after the Sanskrit word for "vision" or "perspective," Darshana offers users a unique lens into the stories, myths, and traditions that define Indian culture.

This repository contains the complete Darshana platform, including:
- **Frontend**: Next.js web application with interactive UI
- **Backend**: Node.js/Express API service
- **AI Service**: Python Flask service with Google Gemini AI integration

---
## Project Status
**Active Development** - The platform is actively being developed with regular updates and new features.

## Core Features

### 🎙️ Narad AI - Your Cultural Guide
Narad AI is the heart of the Darshana experience - an intelligent cultural companion that provides personalized storytelling about Indian heritage and culture.

#### Enhanced Voice-to-Voice Conversations
- **Continuous Voice Mode**: Speak naturally with hands-free conversation
- **Automatic Input Processing**: Messages sent automatically after 1-second pause
- **Smart Keyboard Handling**: Enter sends text, Escape stops recording
- **Stop Speaking Control**: Instantly halt AI speech output with dedicated button
- **Authentic Indian Accents**: Male voices with genuine Indian English and native language pronunciation
- **Soft, Soothing Voice**: Slower speech rate and lower pitch for better listening experience
- **Smart Language Detection**: Automatic script recognition for Hindi, Tamil, Telugu, and other regional languages
- **Context Preservation**: Maintains language consistency throughout multi-turn conversations
- **Multi-language Support**: Conversations in 11 Indian languages
- **Emoji Filtering**: Automatic removal of emojis for clean speech output
- **One-touch Activation**: Simple toggle to enable/disable voice mode

#### Text-based Chat
- **Rich Cultural Knowledge**: Extensive database of Indian history, mythology, and traditions
- **Personalized Responses**: AI adapts to user interests and preferences
- **Multilingual Support**: Chat in English and Indian regional languages
- **Context-Aware Responses**: Maintains conversation history for coherent interactions

### 🌍 Interactive Cultural Experiences
- **AR Integration**: Augmented reality experiences at cultural sites
- **Storytelling Mode**: Immersive narrative experiences
- **Cultural Treasures**: Interactive exploration of India's heritage
- **3D Virtual Tours**: Explore monuments in 3D space

### 🏛️ Monument & Heritage Exploration
- **Detailed Monument Information**: Extensive database of Indian historical sites
- **Interactive Maps**: Location-based exploration of cultural sites
- **Historical Timelines**: Chronological presentation of historical events
- **Photo Galleries**: High-quality images of monuments and artifacts

### 📚 Storytelling Platform
- **Mythological Stories**: Rich collection of Indian myths and legends
- **Historical Narratives**: Detailed accounts of historical events
- **Cultural Insights**: Deep dives into Indian traditions and customs
- **Multimedia Content**: Text, images, and audio for immersive storytelling

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth UI interactions
- **State Management**: Zustand for lightweight state management
- **Icons**: Lucide React icons
- **3D Graphics**: Three.js with React Three Fiber
- **Testing**: Jest and React Testing Library

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **API Documentation**: Swagger/OpenAPI
- **Validation**: express-validator
- **Logging**: Winston
- **Testing**: Jest with Supertest

### AI Service
- **Framework**: Python Flask
- **AI Model**: Google Gemini AI
- **NLP Libraries**: NLTK, spaCy, Langchain
- **Database**: MongoDB integration
- **Testing**: Pytest

## Database Setup

The Darshana platform supports both local MongoDB and MongoDB Atlas (cloud). For production deployments, we recommend using MongoDB Atlas.

To set up MongoDB Atlas:
1. Follow the detailed instructions in [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)
2. Update your `backend/.env` file with your Atlas connection string
3. Set `USE_ATLAS=true` in your environment variables

For local development, you can use the included MongoDB installation script:
- Run `install_mongodb.bat` to install MongoDB locally
- The application will automatically connect to your local MongoDB instance

## Setup Instructions

### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB 4.4+
- npm or yarn

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AjayTiwari94/Darshana.git
   cd Darshana
   ```

2. **Frontend Setup**:
   ```bash
   cd Frontend
   npm install
   # Create a .env file based on .env.example and add your API keys
   npm run dev
   ```

3. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file with your MongoDB connection string and other configs
   npm run dev
   ```

4. **AI Service Setup**:
   ```bash
   cd ai-service
   pip install -r requirements.txt
   python app.py
   ```

### Environment Variables
Create `.env` files in respective directories:
- `Frontend/.env` (copy from `Frontend/.env.example`)
- `ai-service/.env`
- `backend/.env`

Example `Frontend/.env`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

## Project Structure
```
Darshana/
├── Frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   ├── store/         # Zustand store
│   │   └── ...
│   ├── public/            # Static assets
│   └── ...
├── backend/               # Node.js/Express backend API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── ...
│   └── ...
├── ai-service/            # Python Flask AI service
│   ├── src/
│   │   ├── services/      # AI services
│   │   └── ...
│   └── ...
├── docs/                  # Documentation files
└── README.md
```

## Contributing
Contributions are welcome! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments
- Thanks to all contributors who have helped build this platform
- Special thanks to the open-source community for the libraries and tools that made this project possible