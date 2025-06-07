# 🎬 Movie Explorer

A responsive, mobile-first movie search application built with React TypeScript and Vite. Discover and search for your favorite movies using OMDb API (which provides IMDB data).

## ✨ Features

- **Responsive Design**: Mobile-first approach that works beautifully on all devices
- **Real-time Search**: Dynamic movie search with debounced input
- **IMDB Data**: Get movie information directly from IMDB database
- **Modern UI**: Clean, modern interface with smooth animations
- **Loading States**: Skeleton loading and error handling
- **Movie Information**: Shows movie posters, titles, release years, IMDB ratings, genres, and plots

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- OMDb API key (free at [omdbapi.com](http://www.omdbapi.com/))

### Setup

1. **Get your OMDb API key:**
   - Visit [OMDb API](http://www.omdbapi.com/)
   - Click "API Key" in the top menu
   - Choose "FREE!" option (1,000 daily requests)
   - Fill out the form and verify your email
   - You'll receive your API key via email

2. **Create environment file:**
   Create a `.env` file in the root directory and add your API key:
   ```
   VITE_OMDB_API_KEY=your_api_key_here
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🛠️ Built With

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features
- **OMDb API** - IMDB movie data source

## 📱 Responsive Design

The application uses a mobile-first approach with breakpoints at:
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

## 🎯 Performance Features

- Lazy loading images
- Debounced search (500ms)
- Skeleton loading states
- Optimized grid layouts
- Smooth animations and transitions

## 🌟 Project Structure

```
src/
├── components/          # React components
│   ├── SearchBar.tsx   # Search input component
│   ├── MovieCard.tsx   # Individual movie display
│   └── MovieGrid.tsx   # Grid layout for movies
├── hooks/              # Custom React hooks
│   └── useMovieSearch.ts # Search logic and state
├── services/           # API services
│   └── movieApi.ts     # OMDb API integration
├── types/              # TypeScript definitions
│   └── movie.ts        # Movie data interfaces
└── App.tsx             # Main application component
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [OMDb API](http://www.omdbapi.com/) for providing free IMDB data
- [IMDB](https://www.imdb.com/) for the movie database
- [Vite](https://vitejs.dev/) for the amazing build tool
- [React](https://reactjs.org/) for the UI framework
