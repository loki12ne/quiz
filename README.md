# English Quiz Application

A beautiful, interactive quiz application that reads questions from a CSV file. Perfect for testing English vocabulary, grammar, and prepositions.

## Features

- 📝 **CSV-Based Questions**: Easily update questions by modifying the `questions.csv` file
- 🎯 **Interactive Interface**: Clean, modern UI with smooth animations
- 📊 **Real-time Progress**: Track your progress with a visual progress bar
- 🏆 **Detailed Results**: Get comprehensive results with category breakdown
- 📱 **Responsive Design**: Works perfectly on all devices
- 🔄 **Quiz Navigation**: Go back and forth between questions
- 🎨 **Beautiful Design**: Modern gradient backgrounds and smooth transitions

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd quiz-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## CSV Format

The quiz reads questions from `public/questions.csv`. The CSV should have the following format:

```csv
question,optionA,optionB,optionC,correct_answer,category
"What color is the sky?",Green,Blue,Red,B,Vocabulary
"She ___ to school every day.",go,goes,going,B,Grammar
```

### CSV Columns:
- **question**: The question text (use quotes if it contains commas)
- **optionA**: First answer option
- **optionB**: Second answer option  
- **optionC**: Third answer option
- **correct_answer**: The correct answer (A, B, or C)
- **category**: Question category for grouping

## Deployment

### Deploy to GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to GitHub Pages using your preferred method:
   - GitHub Actions
   - Manual upload
   - gh-pages package

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder to Netlify

## Customization

### Adding New Questions

Simply edit the `public/questions.csv` file and add your questions following the format above.

### Styling

The app uses Tailwind CSS. You can customize the design by modifying the component files in `src/components/`.

### Categories

Questions are automatically grouped by the `category` column in your CSV file. The results page will show performance breakdown by category.

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful icon library

## File Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main application component

public/
└── questions.csv       # Quiz questions data
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.